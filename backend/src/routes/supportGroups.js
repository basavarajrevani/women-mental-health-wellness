import express from 'express';
import SupportGroup from '../models/SupportGroup.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import { 
  validateSupportGroup,
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all support groups
// @route   GET /api/v1/support-groups
// @access  Public (with optional auth)
export const getSupportGroups = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    meetingType,
    search,
    isActive = true,
    isPublic = true
  } = req.query;

  // Build filter object
  const filter = { isActive, isPublic };
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (meetingType && meetingType !== 'all') {
    filter.meetingType = meetingType;
  }

  // Build search query
  if (search) {
    filter.$text = { $search: search };
  }

  const supportGroups = await SupportGroup.find(filter)
    .populate('facilitator.user', 'name profile.avatar')
    .populate('coFacilitators.user', 'name profile.avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SupportGroup.countDocuments(filter);

  // If user is authenticated, mark which groups they've joined
  if (req.user) {
    supportGroups.forEach(group => {
      group.isJoinedByUser = group.members.some(
        member => member.user.toString() === req.user._id.toString() && member.status === 'active'
      );
    });
  }

  res.status(200).json({
    success: true,
    data: {
      supportGroups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single support group
// @route   GET /api/v1/support-groups/:id
// @access  Public (with optional auth)
export const getSupportGroup = catchAsync(async (req, res, next) => {
  const supportGroup = await SupportGroup.findById(req.params.id)
    .populate('facilitator.user', 'name profile.avatar')
    .populate('coFacilitators.user', 'name profile.avatar')
    .populate('members.user', 'name profile.avatar')
    .populate('createdBy', 'name');

  if (!supportGroup || !supportGroup.isPublic) {
    return next(new AppError('Support group not found', 404));
  }

  // If user is authenticated, check membership status
  if (req.user) {
    const membership = supportGroup.members.find(
      member => member.user._id.toString() === req.user._id.toString()
    );
    supportGroup.userMembership = membership || null;
  }

  res.status(200).json({
    success: true,
    data: { supportGroup },
  });
});

// @desc    Create new support group
// @route   POST /api/v1/support-groups
// @access  Private (Admin/Moderator only)
export const createSupportGroup = catchAsync(async (req, res, next) => {
  const supportGroupData = {
    ...req.body,
    createdBy: req.user._id,
    facilitator: {
      ...req.body.facilitator,
      user: req.body.facilitator.user || req.user._id,
    },
  };

  const supportGroup = await SupportGroup.create(supportGroupData);

  // Populate facilitator information
  await supportGroup.populate('facilitator.user', 'name profile.avatar');

  res.status(201).json({
    success: true,
    message: 'Support group created successfully',
    data: { supportGroup },
  });
});

// @desc    Update support group
// @route   PUT /api/v1/support-groups/:id
// @access  Private (Admin/Moderator or Facilitator)
export const updateSupportGroup = catchAsync(async (req, res, next) => {
  let supportGroup = await SupportGroup.findById(req.params.id);

  if (!supportGroup) {
    return next(new AppError('Support group not found', 404));
  }

  // Check if user is authorized to update
  const isAuthorized = 
    req.user.role === 'admin' ||
    req.user.role === 'moderator' ||
    supportGroup.facilitator.user.toString() === req.user._id.toString() ||
    supportGroup.createdBy.toString() === req.user._id.toString();

  if (!isAuthorized) {
    return next(new AppError('Not authorized to update this support group', 403));
  }

  supportGroup = await SupportGroup.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('facilitator.user', 'name profile.avatar');

  res.status(200).json({
    success: true,
    message: 'Support group updated successfully',
    data: { supportGroup },
  });
});

// @desc    Delete support group
// @route   DELETE /api/v1/support-groups/:id
// @access  Private (Admin only)
export const deleteSupportGroup = catchAsync(async (req, res, next) => {
  const supportGroup = await SupportGroup.findById(req.params.id);

  if (!supportGroup) {
    return next(new AppError('Support group not found', 404));
  }

  // Soft delete - change status to cancelled
  supportGroup.status = 'cancelled';
  supportGroup.isActive = false;
  await supportGroup.save();

  res.status(200).json({
    success: true,
    message: 'Support group deleted successfully',
  });
});

// @desc    Join support group
// @route   POST /api/v1/support-groups/:id/join
// @access  Private
export const joinSupportGroup = catchAsync(async (req, res, next) => {
  const supportGroup = await SupportGroup.findById(req.params.id);

  if (!supportGroup || !supportGroup.isActive || !supportGroup.isPublic) {
    return next(new AppError('Support group not found or not available', 404));
  }

  // Check if user is already a member
  const existingMember = supportGroup.members.find(
    member => member.user.toString() === req.user._id.toString()
  );

  if (existingMember && existingMember.status === 'active') {
    return next(new AppError('You are already a member of this group', 400));
  }

  // Check if group is full
  if (supportGroup.currentMembers >= supportGroup.maxMembers) {
    if (!supportGroup.requiresApproval) {
      return next(new AppError('Support group is full', 400));
    }
    
    // Add to waitlist
    supportGroup.waitlist.push({
      user: req.user._id,
      notes: req.body.notes || '',
    });
    
    await supportGroup.save();
    
    return res.status(200).json({
      success: true,
      message: 'Added to waitlist. You will be notified when a spot becomes available.',
    });
  }

  // Add user as member
  if (existingMember) {
    existingMember.status = 'active';
    existingMember.joinedAt = new Date();
  } else {
    supportGroup.members.push({
      user: req.user._id,
      status: 'active',
    });
  }

  supportGroup.currentMembers += 1;
  await supportGroup.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: {
      joinedGroups: {
        groupId: supportGroup._id,
        role: 'member',
      },
    },
    $inc: { 'stats.joinedGroupsCount': 1 },
    'stats.lastActiveDate': new Date(),
  });

  // Create notification for facilitator
  await Notification.create({
    recipient: supportGroup.facilitator.user,
    sender: req.user._id,
    type: 'group-join',
    title: 'New member joined your support group',
    message: `${req.user.name} joined "${supportGroup.name}"`,
    reference: {
      model: 'SupportGroup',
      id: supportGroup._id,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Successfully joined the support group',
  });
});

// @desc    Leave support group
// @route   POST /api/v1/support-groups/:id/leave
// @access  Private
export const leaveSupportGroup = catchAsync(async (req, res, next) => {
  const supportGroup = await SupportGroup.findById(req.params.id);

  if (!supportGroup) {
    return next(new AppError('Support group not found', 404));
  }

  // Find user's membership
  const memberIndex = supportGroup.members.findIndex(
    member => member.user.toString() === req.user._id.toString() && member.status === 'active'
  );

  if (memberIndex === -1) {
    return next(new AppError('You are not a member of this group', 400));
  }

  // Remove member
  supportGroup.members[memberIndex].status = 'inactive';
  supportGroup.currentMembers = Math.max(0, supportGroup.currentMembers - 1);
  
  // If there's a waitlist, promote the first person
  if (supportGroup.waitlist.length > 0) {
    const nextUser = supportGroup.waitlist.shift();
    supportGroup.members.push({
      user: nextUser.user,
      status: 'active',
    });
    supportGroup.currentMembers += 1;

    // Notify the promoted user
    await Notification.create({
      recipient: nextUser.user,
      type: 'group-invite',
      title: 'Spot available in support group',
      message: `A spot is now available in "${supportGroup.name}". You have been automatically added.`,
      reference: {
        model: 'SupportGroup',
        id: supportGroup._id,
      },
    });
  }

  await supportGroup.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { joinedGroups: { groupId: supportGroup._id } },
    $inc: { 'stats.joinedGroupsCount': -1 },
  });

  res.status(200).json({
    success: true,
    message: 'Successfully left the support group',
  });
});

// Apply optional auth to public routes
router.get('/', optionalAuth, validatePagination, getSupportGroups);
router.get('/:id', optionalAuth, validateObjectId('id'), getSupportGroup);

// Apply authentication to protected routes
router.use(protect);

router.post('/', authorize('admin', 'moderator'), validateSupportGroup, createSupportGroup);
router.put('/:id', validateObjectId('id'), validateSupportGroup, updateSupportGroup);
router.delete('/:id', validateObjectId('id'), authorize('admin'), deleteSupportGroup);
router.post('/:id/join', validateObjectId('id'), joinSupportGroup);
router.post('/:id/leave', validateObjectId('id'), leaveSupportGroup);

export default router;
