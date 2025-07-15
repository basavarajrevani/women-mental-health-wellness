import express from 'express';
import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import SupportGroup from '../models/SupportGroup.js';
import Event from '../models/Event.js';
import Resource from '../models/Resource.js';
import Partner from '../models/Partner.js';
import Notification from '../models/Notification.js';
import AdminLog from '../models/AdminLog.js';
import SystemSettings from '../models/SystemSettings.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { validatePagination, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last3Months = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [
    // User Statistics
    totalUsers,
    activeUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    suspendedUsers,
    verifiedUsers,

    // Content Statistics
    totalPosts,
    newPostsThisWeek,
    totalComments,
    pendingPosts,
    reportedPosts,

    // Community Statistics
    totalGroups,
    activeGroups,
    totalEvents,
    upcomingEvents,
    totalResources,
    verifiedResources,

    // Engagement Statistics
    totalNotifications,
    unreadNotifications,

    // Recent Activity
    recentUsers,
    recentPosts,
    recentAdminActions,

    // System Health
    systemSettings
  ] = await Promise.all([
    // User queries
    User.countDocuments({ status: { $ne: 'deleted' } }),
    User.countDocuments({
      status: 'active',
      'stats.lastActiveDate': { $gte: lastWeek }
    }),
    User.countDocuments({
      status: 'active',
      createdAt: { $gte: lastWeek }
    }),
    User.countDocuments({
      status: 'active',
      createdAt: { $gte: lastMonth }
    }),
    User.countDocuments({ status: 'suspended' }),
    User.countDocuments({ 'verification.isEmailVerified': true }),

    // Content queries
    CommunityPost.countDocuments({ status: { $ne: 'deleted' } }),
    CommunityPost.countDocuments({
      status: 'published',
      createdAt: { $gte: lastWeek }
    }),
    CommunityPost.aggregate([
      { $unwind: '$comments' },
      { $count: 'total' }
    ]).then(result => result[0]?.total || 0),
    CommunityPost.countDocuments({ status: 'pending' }),
    CommunityPost.countDocuments({ isReported: true }),

    // Community queries
    SupportGroup.countDocuments({ isActive: true }),
    SupportGroup.countDocuments({
      isActive: true,
      'stats.lastActivityDate': { $gte: lastWeek }
    }),
    Event.countDocuments({ isActive: true }),
    Event.countDocuments({
      isActive: true,
      startDate: { $gte: now }
    }),
    Resource.countDocuments({ status: 'active' }),
    Resource.countDocuments({
      status: 'active',
      'verification.isVerified': true
    }),

    // Engagement queries
    Notification.countDocuments({ createdAt: { $gte: lastMonth } }),
    Notification.countDocuments({ isRead: false }),

    // Recent activity
    User.find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt status role profile.avatar'),
    CommunityPost.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name profile.avatar')
      .select('content author createdAt category likes comments'),
    AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('admin', 'name')
      .select('action target details createdAt severity'),

    // System settings
    SystemSettings.getCurrentSettings()
  ]);

  // Calculate user growth trend
  const userGrowthTrend = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: last3Months },
        status: { $ne: 'deleted' }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          week: { $week: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }
    }
  ]);

  // Calculate engagement metrics
  const engagementMetrics = await CommunityPost.aggregate([
    {
      $match: {
        createdAt: { $gte: lastMonth },
        status: 'published'
      }
    },
    {
      $group: {
        _id: null,
        avgLikes: { $avg: { $size: '$likes' } },
        avgComments: { $avg: { $size: '$comments' } },
        totalViews: { $sum: '$views' }
      }
    }
  ]);

  // User demographics
  const userDemographics = await User.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $group: {
        _id: '$profile.personalInfo.gender',
        count: { $sum: 1 }
      }
    }
  ]);

  // Platform health score (simple calculation)
  const healthScore = Math.round(
    (activeUsers / Math.max(totalUsers, 1)) * 40 +
    (verifiedUsers / Math.max(totalUsers, 1)) * 30 +
    (newUsersThisWeek > 0 ? 20 : 0) +
    (reportedPosts < totalPosts * 0.05 ? 10 : 0)
  );

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        newUsersThisWeek,
        newUsersThisMonth,
        suspendedUsers,
        verifiedUsers,
        totalPosts,
        newPostsThisWeek,
        totalComments,
        pendingPosts,
        reportedPosts,
        totalGroups,
        activeGroups,
        totalEvents,
        upcomingEvents,
        totalResources,
        verifiedResources,
        healthScore,
      },
      engagement: {
        totalNotifications,
        unreadNotifications,
        metrics: engagementMetrics[0] || {
          avgLikes: 0,
          avgComments: 0,
          totalViews: 0
        },
      },
      demographics: userDemographics,
      trends: {
        userGrowth: userGrowthTrend,
      },
      recentActivity: {
        users: recentUsers,
        posts: recentPosts,
        adminActions: recentAdminActions,
      },
      systemInfo: {
        maintenanceMode: systemSettings.platform.maintenanceMode.enabled,
        version: systemSettings.platform.version,
        lastUpdated: systemSettings.lastUpdatedAt,
      },
    },
  });
});

// @desc    Get all users (admin view)
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getUsers = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    role,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (role && role !== 'all') {
    filter.role = role;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const users = await User.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-password');

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Update user status/role
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin only)
export const updateUser = catchAsync(async (req, res, next) => {
  const { status, role, reason, notes } = req.body;

  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Store old values for logging
  const oldValues = {
    status: user.status,
    role: user.role,
  };

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { status, role },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  // Log admin action
  await AdminLog.logAction(req.user._id, 'user_updated', {
    target: {
      model: 'User',
      id: user._id,
      name: user.name,
    },
    description: `Updated user ${user.name} (${user.email})`,
    oldValues,
    newValues: { status, role },
    reason,
    notes,
    category: 'user_management',
    severity: status === 'suspended' ? 'high' : 'medium',
    affectedUsers: [user._id],
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });

  // Create notification for user if status changed
  if (status && status !== oldValues.status) {
    await Notification.create({
      recipient: user._id,
      type: 'admin',
      title: 'Account Status Updated',
      message: `Your account status has been updated to: ${status}${reason ? `. Reason: ${reason}` : ''}`,
      priority: status === 'suspended' ? 'high' : 'normal',
    });
  }

  // Create notification for role change
  if (role && role !== oldValues.role) {
    await Notification.create({
      recipient: user._id,
      type: 'admin',
      title: 'Account Role Updated',
      message: `Your account role has been updated to: ${role}`,
      priority: 'normal',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser },
  });
});

// @desc    Get all community posts (admin view)
// @route   GET /api/v1/admin/posts
// @access  Private (Admin only)
export const getPosts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    status,
    category,
    reported = false,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (reported === 'true') {
    filter.isReported = true;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const posts = await CommunityPost.find(filter)
    .populate('author', 'name email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await CommunityPost.countDocuments(filter);

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

// @desc    Moderate community post
// @route   PUT /api/v1/admin/posts/:id/moderate
// @access  Private (Admin only)
export const moderatePost = catchAsync(async (req, res, next) => {
  const { action, notes } = req.body; // action: 'approve', 'reject', 'remove'
  
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  switch (action) {
    case 'approve':
      post.moderationStatus = 'approved';
      post.status = 'published';
      break;
    case 'reject':
      post.moderationStatus = 'rejected';
      post.status = 'draft';
      break;
    case 'remove':
      post.status = 'removed';
      break;
    default:
      return next(new AppError('Invalid moderation action', 400));
  }

  post.moderationNotes = notes;
  post.moderatedBy = req.user._id;
  post.moderatedAt = new Date();
  
  await post.save();

  // Notify post author
  await Notification.create({
    recipient: post.author,
    type: 'admin',
    title: 'Post Moderation Update',
    message: `Your post has been ${action}d by a moderator.`,
    reference: {
      model: 'CommunityPost',
      id: post._id,
    },
  });

  res.status(200).json({
    success: true,
    message: `Post ${action}d successfully`,
    data: { post },
  });
});

// @desc    Get system analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin only)
export const getAnalytics = catchAsync(async (req, res, next) => {
  const { period = '30' } = req.query; // days
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // User analytics
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Post analytics
  const postActivity = await CommunityPost.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'published'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Category distribution
  const categoryStats = await CommunityPost.aggregate([
    {
      $match: {
        status: 'published',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      userGrowth,
      postActivity,
      categoryStats,
      period: parseInt(period),
    },
  });
});

// @desc    Send system notification to all users
// @route   POST /api/v1/admin/notifications/broadcast
// @access  Private (Admin only)
export const broadcastNotification = catchAsync(async (req, res, next) => {
  const { title, message, type = 'system', priority = 'normal' } = req.body;

  if (!title || !message) {
    return next(new AppError('Title and message are required', 400));
  }

  // Get all active users
  const activeUsers = await User.find({ status: 'active' }).select('_id');
  
  // Create notifications for all users
  const notifications = activeUsers.map(user => ({
    recipient: user._id,
    type,
    title,
    message,
    priority,
  }));

  await Notification.insertMany(notifications);

  // Emit real-time notification
  const io = req.app.get('io');
  if (io) {
    io.emit('system_notification', {
      title,
      message,
      type,
      priority,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(200).json({
    success: true,
    message: `Notification sent to ${activeUsers.length} users`,
    data: {
      recipientCount: activeUsers.length,
    },
  });
});

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private (Admin only)
export const getSystemSettings = catchAsync(async (req, res, next) => {
  const settings = await SystemSettings.getCurrentSettings();

  res.status(200).json({
    success: true,
    data: { settings },
  });
});

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin only)
export const updateSystemSettings = catchAsync(async (req, res, next) => {
  const settings = await SystemSettings.updateSettings(req.body, req.user._id);

  // Log admin action
  await AdminLog.logAction(req.user._id, 'system_settings_changed', {
    target: {
      model: 'System',
      name: 'System Settings',
    },
    description: 'Updated system settings',
    newValues: req.body,
    category: 'system_admin',
    severity: 'medium',
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });

  res.status(200).json({
    success: true,
    message: 'System settings updated successfully',
    data: { settings },
  });
});

// @desc    Get admin logs
// @route   GET /api/v1/admin/logs
// @access  Private (Admin only)
export const getAdminLogs = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    action,
    category,
    severity,
    adminId,
    startDate,
    endDate
  } = req.query;

  // Build filter
  const filter = {};

  if (action) filter.action = action;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (adminId) filter.admin = adminId;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const logs = await AdminLog.find(filter)
    .populate('admin', 'name email')
    .populate('reversedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await AdminLog.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get detailed user profile (admin view)
// @route   GET /api/v1/admin/users/:id/profile
// @access  Private (Admin only)
export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('joinedGroups.groupId', 'name category')
    .populate('registeredEvents.eventId', 'title startDate');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user's activity summary
  const [
    postsCount,
    commentsCount,
    groupsCount,
    eventsCount,
    moodEntriesCount,
    notificationsCount
  ] = await Promise.all([
    CommunityPost.countDocuments({ author: user._id }),
    CommunityPost.aggregate([
      { $unwind: '$comments' },
      { $match: { 'comments.author': user._id } },
      { $count: 'total' }
    ]).then(result => result[0]?.total || 0),
    SupportGroup.countDocuments({ 'members.user': user._id }),
    Event.countDocuments({ 'attendees.user': user._id }),
    // MoodEntry.countDocuments({ user: user._id }), // Uncomment when MoodEntry model is available
    0, // Placeholder for mood entries
    Notification.countDocuments({ recipient: user._id })
  ]);

  // Get recent admin actions on this user
  const adminActions = await AdminLog.find({
    'target.id': user._id,
    'target.model': 'User'
  })
    .populate('admin', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      user,
      activity: {
        postsCount,
        commentsCount,
        groupsCount,
        eventsCount,
        moodEntriesCount,
        notificationsCount,
      },
      adminActions,
    },
  });
});

// @desc    Suspend user account
// @route   POST /api/v1/admin/users/:id/suspend
// @access  Private (Admin only)
export const suspendUser = catchAsync(async (req, res, next) => {
  const { reason, duration, notes } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.status === 'suspended') {
    return next(new AppError('User is already suspended', 400));
  }

  // Calculate suspension end date
  let suspensionEndDate;
  if (duration && duration !== 'permanent') {
    suspensionEndDate = new Date();
    suspensionEndDate.setDate(suspensionEndDate.getDate() + parseInt(duration));
  }

  // Update user status
  user.status = 'suspended';
  user.security.suspensionReason = reason;
  user.security.suspensionEndDate = suspensionEndDate;
  user.security.suspendedBy = req.user._id;
  user.security.suspendedAt = new Date();
  await user.save();

  // Log admin action
  await AdminLog.logAction(req.user._id, 'user_suspended', {
    target: {
      model: 'User',
      id: user._id,
      name: user.name,
    },
    description: `Suspended user ${user.name} (${user.email})`,
    reason,
    notes,
    category: 'user_management',
    severity: 'high',
    affectedUsers: [user._id],
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      duration,
      suspensionEndDate,
    },
  });

  // Send notification to user
  await Notification.create({
    recipient: user._id,
    type: 'admin',
    title: 'Account Suspended',
    message: `Your account has been suspended. Reason: ${reason}${suspensionEndDate ? ` Until: ${suspensionEndDate.toLocaleDateString()}` : ' (Permanent)'}`,
    priority: 'high',
  });

  res.status(200).json({
    success: true,
    message: 'User suspended successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        suspensionEndDate,
      },
    },
  });
});

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/users', validatePagination, getUsers);
router.get('/users/:id/profile', validateObjectId('id'), getUserProfile);
router.put('/users/:id', validateObjectId('id'), updateUser);
router.post('/users/:id/suspend', validateObjectId('id'), suspendUser);
router.get('/posts', validatePagination, getPosts);
router.put('/posts/:id/moderate', validateObjectId('id'), moderatePost);
router.get('/analytics', getAnalytics);
router.get('/logs', validatePagination, getAdminLogs);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.post('/notifications/broadcast', broadcastNotification);

export default router;
