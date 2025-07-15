import express from 'express';
import User from '../models/User.js';
import MoodEntry from '../models/MoodEntry.js';
import Notification from '../models/Notification.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, authorize, ownerOrAdmin } from '../middleware/auth.js';
import { 
  validateUserUpdate, 
  validateMoodEntry,
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/v1/users/:id
// @access  Private (Own profile or Admin)
export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('joinedGroups.groupId', 'name category meetingSchedule')
    .populate('registeredEvents.eventId', 'title startDate type');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Users can only see their own full profile, others see limited info
  if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
    const limitedProfile = {
      id: user._id,
      name: user.name,
      profile: {
        avatar: user.profile.avatar,
        bio: user.profile.bio,
      },
      stats: {
        postsCount: user.stats.postsCount,
        joinedGroupsCount: user.stats.joinedGroupsCount,
        streakDays: user.stats.streakDays,
      },
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: { user: limitedProfile },
    });
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/users/:id
// @access  Private (Own profile or Admin)
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

// @desc    Delete user account
// @route   DELETE /api/v1/users/:id
// @access  Private (Own account or Admin)
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Soft delete - change status to deleted
  user.status = 'deleted';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User account deleted successfully',
  });
});

// @desc    Get user mood entries
// @route   GET /api/v1/users/:id/mood-entries
// @access  Private (Own data or Admin)
export const getUserMoodEntries = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 30, days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const moodEntries = await MoodEntry.find({
    user: req.params.id,
    entryDate: { $gte: startDate },
  })
    .sort({ entryDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await MoodEntry.countDocuments({
    user: req.params.id,
    entryDate: { $gte: startDate },
  });

  // Calculate mood statistics
  const moodStats = await MoodEntry.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.params.id),
        entryDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        averageMood: { $avg: '$mood' },
        highestMood: { $max: '$mood' },
        lowestMood: { $min: '$mood' },
        totalEntries: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      moodEntries,
      stats: moodStats[0] || {
        averageMood: 0,
        highestMood: 0,
        lowestMood: 0,
        totalEntries: 0,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Create mood entry
// @route   POST /api/v1/users/:id/mood-entries
// @access  Private (Own data only)
export const createMoodEntry = catchAsync(async (req, res, next) => {
  // Ensure user can only create mood entries for themselves
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('You can only create mood entries for yourself', 403));
  }

  const moodEntry = await MoodEntry.create({
    ...req.body,
    user: req.params.id,
  });

  // Update user streak
  const streak = await MoodEntry.getMoodStreak(req.params.id);
  await User.findByIdAndUpdate(req.params.id, {
    'stats.streakDays': streak,
    'stats.lastActiveDate': new Date(),
  });

  res.status(201).json({
    success: true,
    message: 'Mood entry created successfully',
    data: { moodEntry },
  });
});

// @desc    Get user notifications
// @route   GET /api/v1/users/:id/notifications
// @access  Private (Own notifications only)
export const getUserNotifications = catchAsync(async (req, res, next) => {
  // Ensure user can only access their own notifications
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('You can only access your own notifications', 403));
  }

  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const filter = { recipient: req.params.id };
  if (unreadOnly === 'true') {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('sender', 'name profile.avatar');

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.getUnreadCount(req.params.id);

  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/users/:id/notifications/:notificationId/read
// @access  Private (Own notifications only)
export const markNotificationAsRead = catchAsync(async (req, res, next) => {
  // Ensure user can only mark their own notifications as read
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('You can only mark your own notifications as read', 403));
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.notificationId,
      recipient: req.params.id,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification },
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/users/:id/notifications/mark-all-read
// @access  Private (Own notifications only)
export const markAllNotificationsAsRead = catchAsync(async (req, res, next) => {
  // Ensure user can only mark their own notifications as read
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('You can only mark your own notifications as read', 403));
  }

  await Notification.markAllAsRead(req.params.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// @desc    Get user dashboard data
// @route   GET /api/v1/users/:id/dashboard
// @access  Private (Own data only)
export const getUserDashboard = catchAsync(async (req, res, next) => {
  // Ensure user can only access their own dashboard
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('You can only access your own dashboard', 403));
  }

  const userId = req.params.id;

  // Get recent mood entries (last 7 days)
  const recentMoodEntries = await MoodEntry.getMoodTrends(userId, 7);

  // Get user stats
  const user = await User.findById(userId);

  // Get unread notifications count
  const unreadNotifications = await Notification.getUnreadCount(userId);

  // Get recent notifications
  const recentNotifications = await Notification.getRecent(userId, 5);

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: user.name,
        profile: user.profile,
        stats: user.stats,
      },
      recentMoodEntries,
      unreadNotifications,
      recentNotifications,
    },
  });
});

// Routes
router.get('/:id', validateObjectId('id'), ownerOrAdmin(), getUserProfile);
router.put('/:id', validateObjectId('id'), validateUserUpdate, ownerOrAdmin(), updateUser);
router.delete('/:id', validateObjectId('id'), ownerOrAdmin(), deleteUser);

router.get('/:id/mood-entries', validateObjectId('id'), validatePagination, ownerOrAdmin(), getUserMoodEntries);
router.post('/:id/mood-entries', validateObjectId('id'), validateMoodEntry, createMoodEntry);

router.get('/:id/notifications', validateObjectId('id'), validatePagination, getUserNotifications);
router.put('/:id/notifications/:notificationId/read', validateObjectId('id'), validateObjectId('notificationId'), markNotificationAsRead);
router.put('/:id/notifications/mark-all-read', validateObjectId('id'), markAllNotificationsAsRead);

router.get('/:id/dashboard', validateObjectId('id'), getUserDashboard);

export default router;
