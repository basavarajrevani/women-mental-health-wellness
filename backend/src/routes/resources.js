import express from 'express';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import { 
  validateResource,
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all resources
// @route   GET /api/v1/resources
// @access  Public (with optional auth)
export const getResources = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    type,
    search,
    targetCondition,
    targetDemographic,
    isFree,
    isVerified,
    featured = false
  } = req.query;

  // Build filter object
  const filter = { status: 'active', isPublic: true };
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (type && type !== 'all') {
    filter.type = type;
  }

  if (targetCondition && targetCondition !== 'all') {
    filter['targetAudience.conditions'] = targetCondition;
  }

  if (targetDemographic && targetDemographic !== 'all') {
    filter['targetAudience.demographics'] = targetDemographic;
  }

  if (isFree === 'true') {
    filter['cost.isFree'] = true;
  }

  if (isVerified === 'true') {
    filter['verification.isVerified'] = true;
  }

  if (featured === 'true') {
    filter.isFeatured = true;
  }

  // Build search query
  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort object
  let sort = {};
  if (featured === 'true') {
    sort = { isFeatured: -1, 'ratings.averageRating': -1, createdAt: -1 };
  } else {
    sort = { 'ratings.averageRating': -1, createdAt: -1 };
  }

  const resources = await Resource.find(filter)
    .populate('createdBy', 'name profile.avatar')
    .populate('ratings.reviews.user', 'name profile.avatar')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Resource.countDocuments(filter);

  // If user is authenticated, mark which resources they've bookmarked
  if (req.user) {
    resources.forEach(resource => {
      resource.isBookmarkedByUser = resource.usage.bookmarks.includes(req.user._id);
    });
  }

  res.status(200).json({
    success: true,
    data: {
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single resource
// @route   GET /api/v1/resources/:id
// @access  Public (with optional auth)
export const getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id)
    .populate('createdBy', 'name profile.avatar')
    .populate('ratings.reviews.user', 'name profile.avatar')
    .populate('lastUpdatedBy', 'name');

  if (!resource || resource.status !== 'active' || !resource.isPublic) {
    return next(new AppError('Resource not found', 404));
  }

  // Increment view count
  resource.usage.views += 1;
  await resource.save();

  // If user is authenticated, check bookmark status
  if (req.user) {
    resource.isBookmarkedByUser = resource.usage.bookmarks.includes(req.user._id);
  }

  res.status(200).json({
    success: true,
    data: { resource },
  });
});

// @desc    Create new resource
// @route   POST /api/v1/resources
// @access  Private (Admin/Moderator only)
export const createResource = catchAsync(async (req, res, next) => {
  const resourceData = {
    ...req.body,
    createdBy: req.user._id,
  };

  const resource = await Resource.create(resourceData);

  // Populate creator information
  await resource.populate('createdBy', 'name profile.avatar');

  res.status(201).json({
    success: true,
    message: 'Resource created successfully',
    data: { resource },
  });
});

// @desc    Update resource
// @route   PUT /api/v1/resources/:id
// @access  Private (Admin/Moderator or Creator)
export const updateResource = catchAsync(async (req, res, next) => {
  let resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }

  // Check if user is authorized to update
  const isAuthorized = 
    req.user.role === 'admin' ||
    req.user.role === 'moderator' ||
    resource.createdBy.toString() === req.user._id.toString();

  if (!isAuthorized) {
    return next(new AppError('Not authorized to update this resource', 403));
  }

  resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      lastUpdatedBy: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate('createdBy', 'name profile.avatar');

  res.status(200).json({
    success: true,
    message: 'Resource updated successfully',
    data: { resource },
  });
});

// @desc    Delete resource
// @route   DELETE /api/v1/resources/:id
// @access  Private (Admin only)
export const deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }

  // Soft delete - change status to archived
  resource.status = 'archived';
  await resource.save();

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully',
  });
});

// @desc    Bookmark/Unbookmark resource
// @route   POST /api/v1/resources/:id/bookmark
// @access  Private
export const toggleBookmark = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource || resource.status !== 'active' || !resource.isPublic) {
    return next(new AppError('Resource not found', 404));
  }

  const userId = req.user._id;
  const isBookmarked = resource.usage.bookmarks.includes(userId);

  if (isBookmarked) {
    // Remove bookmark
    resource.usage.bookmarks.pull(userId);
  } else {
    // Add bookmark
    resource.usage.bookmarks.push(userId);
  }

  await resource.save();

  res.status(200).json({
    success: true,
    message: isBookmarked ? 'Resource unbookmarked' : 'Resource bookmarked',
    data: {
      isBookmarked: !isBookmarked,
      bookmarkCount: resource.usage.bookmarks.length,
    },
  });
});

// @desc    Add review to resource
// @route   POST /api/v1/resources/:id/reviews
// @access  Private
export const addReview = catchAsync(async (req, res, next) => {
  const { rating, comment, isAnonymous = false } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  const resource = await Resource.findById(req.params.id);

  if (!resource || resource.status !== 'active' || !resource.isPublic) {
    return next(new AppError('Resource not found', 404));
  }

  // Check if user has already reviewed this resource
  const existingReview = resource.ratings.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    return next(new AppError('You have already reviewed this resource', 400));
  }

  // Add review
  const review = {
    user: req.user._id,
    rating,
    comment,
    isAnonymous,
  };

  resource.ratings.reviews.push(review);
  await resource.save();

  // Populate the new review
  await resource.populate('ratings.reviews.user', 'name profile.avatar');
  const newReview = resource.ratings.reviews[resource.ratings.reviews.length - 1];

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: { 
      review: newReview,
      averageRating: resource.ratings.averageRating,
      totalRatings: resource.ratings.totalRatings,
    },
  });
});

// @desc    Track resource click
// @route   POST /api/v1/resources/:id/click
// @access  Public (with optional auth)
export const trackClick = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource || resource.status !== 'active' || !resource.isPublic) {
    return next(new AppError('Resource not found', 404));
  }

  // Increment click count
  resource.usage.clicks += 1;
  await resource.save();

  res.status(200).json({
    success: true,
    message: 'Click tracked successfully',
  });
});

// @desc    Get resource categories
// @route   GET /api/v1/resources/categories
// @access  Public
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = [
    'article', 'video', 'podcast', 'book', 'app', 'website', 'tool',
    'worksheet', 'guide', 'course', 'therapy', 'hotline', 'emergency',
    'medication', 'exercise', 'meditation', 'other'
  ];

  const types = [
    'educational', 'therapeutic', 'emergency', 'self-help', 'professional',
    'community', 'crisis', 'wellness', 'medical', 'legal', 'financial'
  ];

  const conditions = [
    'anxiety', 'depression', 'trauma', 'grief', 'stress', 'eating-disorders',
    'addiction', 'bipolar', 'ocd', 'ptsd', 'postpartum', 'general'
  ];

  const demographics = [
    'women', 'men', 'lgbtq+', 'teens', 'young-adults', 'adults', 'seniors',
    'parents', 'veterans', 'students', 'professionals', 'low-income',
    'immigrants', 'refugees', 'all'
  ];

  res.status(200).json({
    success: true,
    data: {
      categories,
      types,
      conditions,
      demographics,
    },
  });
});

// Apply optional auth to public routes
router.get('/', optionalAuth, validatePagination, getResources);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, validateObjectId('id'), getResource);
router.post('/:id/click', optionalAuth, validateObjectId('id'), trackClick);

// Apply authentication to protected routes
router.use(protect);

router.post('/', authorize('admin', 'moderator'), validateResource, createResource);
router.put('/:id', validateObjectId('id'), validateResource, updateResource);
router.delete('/:id', validateObjectId('id'), authorize('admin'), deleteResource);
router.post('/:id/bookmark', validateObjectId('id'), toggleBookmark);
router.post('/:id/reviews', validateObjectId('id'), addReview);

export default router;
