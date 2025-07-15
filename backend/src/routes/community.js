import express from 'express';
import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { 
  validateCommunityPost, 
  validateComment,
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all community posts
// @route   GET /api/v1/community/posts
// @access  Public (with optional auth for personalization)
export const getPosts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    tags,
    search,
    sortBy = 'recent',
    userId
  } = req.query;

  // Build filter object
  const filter = { status: 'published' };
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    filter.tags = { $in: tagArray };
  }
  
  if (userId) {
    filter.author = userId;
  }

  // Build search query
  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'popular':
      sort = { 'likes': -1, 'comments': -1, createdAt: -1 };
      break;
    case 'trending':
      // For trending, we'll use a combination of recent activity and engagement
      sort = { isPinned: -1, createdAt: -1 };
      break;
    default:
      sort = { isPinned: -1, createdAt: -1 };
  }

  const posts = await CommunityPost.find(filter)
    .populate('author', 'name profile.avatar')
    .populate('comments.author', 'name profile.avatar')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await CommunityPost.countDocuments(filter);

  // If user is authenticated, mark which posts they've liked
  if (req.user) {
    posts.forEach(post => {
      post.isLikedByUser = post.likes.includes(req.user._id);
      post.comments.forEach(comment => {
        comment.isLikedByUser = comment.likes.includes(req.user._id);
      });
    });
  }

  res.status(200).json({
    success: true,
    data: {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single community post
// @route   GET /api/v1/community/posts/:id
// @access  Public (with optional auth)
export const getPost = catchAsync(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id)
    .populate('author', 'name profile.avatar')
    .populate('comments.author', 'name profile.avatar')
    .populate('comments.replies.author', 'name profile.avatar');

  if (!post || post.status !== 'published') {
    return next(new AppError('Post not found', 404));
  }

  // Increment view count
  post.views += 1;
  await post.save();

  // If user is authenticated, mark if they've liked the post
  if (req.user) {
    post.isLikedByUser = post.likes.includes(req.user._id);
    post.comments.forEach(comment => {
      comment.isLikedByUser = comment.likes.includes(req.user._id);
    });
  }

  res.status(200).json({
    success: true,
    data: { post },
  });
});

// @desc    Create new community post
// @route   POST /api/v1/community/posts
// @access  Private
export const createPost = catchAsync(async (req, res, next) => {
  const postData = {
    ...req.body,
    author: req.user._id,
  };

  const post = await CommunityPost.create(postData);

  // Populate author information
  await post.populate('author', 'name profile.avatar');

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.postsCount': 1 },
    'stats.lastActiveDate': new Date(),
  });

  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.sendToCommunity('post_created', {
      post: {
        id: post._id,
        content: post.content,
        category: post.category,
        author: {
          id: post.author._id,
          name: post.isAnonymous ? 'Anonymous' : post.author.name,
          avatar: post.isAnonymous ? '🎭' : post.author.profile.avatar,
        },
        isAnonymous: post.isAnonymous,
        createdAt: post.createdAt,
      },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: { post },
  });
});

// @desc    Update community post
// @route   PUT /api/v1/community/posts/:id
// @access  Private (Author only or Admin)
export const updatePost = catchAsync(async (req, res, next) => {
  let post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this post', 403));
  }

  // Store original content for edit history
  if (req.body.content && req.body.content !== post.content) {
    post.editHistory.push({
      content: post.content,
      editedAt: new Date(),
    });
    post.isEdited = true;
  }

  post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('author', 'name profile.avatar');

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: { post },
  });
});

// @desc    Delete community post
// @route   DELETE /api/v1/community/posts/:id
// @access  Private (Author only or Admin)
export const deletePost = catchAsync(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this post', 403));
  }

  // Soft delete - change status to removed
  post.status = 'removed';
  await post.save();

  // Update user stats
  await User.findByIdAndUpdate(post.author, {
    $inc: { 'stats.postsCount': -1 },
  });

  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.sendToCommunity('post_deleted', { postId: post._id });
  }

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});

// @desc    Like/Unlike a post
// @route   POST /api/v1/community/posts/:id/like
// @access  Private
export const toggleLike = catchAsync(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post || post.status !== 'published') {
    return next(new AppError('Post not found', 404));
  }

  const userId = req.user._id;
  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Unlike the post
    post.likes.pull(userId);
  } else {
    // Like the post
    post.likes.push(userId);

    // Create notification for post author (if not liking own post)
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: 'like',
        title: 'Someone liked your post!',
        message: `${req.user.name} liked your post: "${post.content.substring(0, 50)}..."`,
        reference: {
          model: 'CommunityPost',
          id: post._id,
        },
      });

      // Update author's stats
      await User.findByIdAndUpdate(post.author, {
        $inc: { 'stats.likesReceived': 1 },
      });
    }
  }

  await post.save();

  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.sendToCommunity('post_like_updated', {
      postId: post._id,
      likesCount: post.likes.length,
      isLiked: !isLiked,
      userId: userId,
    });
  }

  res.status(200).json({
    success: true,
    message: isLiked ? 'Post unliked' : 'Post liked',
    data: {
      likesCount: post.likes.length,
      isLiked: !isLiked,
    },
  });
});

// @desc    Add comment to post
// @route   POST /api/v1/community/posts/:id/comments
// @access  Private
export const addComment = catchAsync(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post || post.status !== 'published') {
    return next(new AppError('Post not found', 404));
  }

  const comment = {
    content: req.body.content,
    author: req.user._id,
    isAnonymous: req.body.isAnonymous || false,
  };

  post.comments.push(comment);
  await post.save();

  // Populate the new comment
  await post.populate('comments.author', 'name profile.avatar');
  const newComment = post.comments[post.comments.length - 1];

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.commentsCount': 1 },
    'stats.lastActiveDate': new Date(),
  });

  // Create notification for post author (if not commenting on own post)
  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: post.author,
      sender: req.user._id,
      type: 'comment',
      title: 'New comment on your post!',
      message: `${req.user.name} commented: "${req.body.content.substring(0, 50)}..."`,
      reference: {
        model: 'CommunityPost',
        id: post._id,
      },
    });
  }

  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.sendToCommunity('comment_added', {
      postId: post._id,
      comment: {
        id: newComment._id,
        content: newComment.content,
        author: {
          id: newComment.author._id,
          name: newComment.isAnonymous ? 'Anonymous' : newComment.author.name,
          avatar: newComment.isAnonymous ? '🎭' : newComment.author.profile.avatar,
        },
        isAnonymous: newComment.isAnonymous,
        createdAt: newComment.createdAt,
      },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: { comment: newComment },
  });
});

// Apply optional auth to public routes
router.get('/posts', optionalAuth, validatePagination, getPosts);
router.get('/posts/:id', optionalAuth, validateObjectId('id'), getPost);

// Apply authentication to protected routes
router.use(protect);

router.post('/posts', validateCommunityPost, createPost);
router.put('/posts/:id', validateObjectId('id'), validateCommunityPost, updatePost);
router.delete('/posts/:id', validateObjectId('id'), deletePost);
router.post('/posts/:id/like', validateObjectId('id'), toggleLike);
router.post('/posts/:id/comments', validateObjectId('id'), validateComment, addComment);

export default router;
