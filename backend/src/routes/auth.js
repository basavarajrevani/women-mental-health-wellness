import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, authRateLimit } from '../middleware/auth.js';
import { 
  validateUserRegistration, 
  validateUserLogin,
  handleValidationErrors 
} from '../middleware/validation.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper function to create and send token response
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  const responseData = {
    success: true,
    message,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        status: user.status,
        createdAt: user.createdAt,
      },
    },
  };

  console.log('📤 Sending token response:', {
    success: responseData.success,
    message: responseData.message,
    userRole: responseData.data.user.role,
    userEmail: responseData.data.user.email,
    tokenLength: token ? token.length : 0
  });

  res.status(statusCode).json(responseData);
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  console.log('📝 Register request body:', req.body);
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
    return next(new AppError('Name, email, and password are required', 400));
  }

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    console.log('❌ User already exists:', email);
    return next(new AppError('User with this email already exists', 400));
  }

  console.log('✅ Creating new user:', { name, email });

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    profile: {
      avatar: '👤',
    },
  });

  console.log('✅ User created successfully:', user._id);

  // Update user stats
  user.stats.lastActiveDate = new Date();
  await user.save();

  createSendToken(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  console.log('🔐 Login request body:', req.body);
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    console.log('❌ Missing login credentials');
    return next(new AppError('Email and password are required', 400));
  }

  // Check if MongoDB is available
  const mongoose = (await import('mongoose')).default;
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  MongoDB not available, using mock authentication for development');

    // Mock authentication for development/testing
    if (password === '123456') {
      const mockUser = {
        _id: email === 'basu@gmail.com' ? '6876b161f270b709a4ff566a' : '6878f15abbd43cf983ff6d32',
        name: email === 'basu@gmail.com' ? 'Basu' : 'Bassu',
        email: email,
        role: 'user',
        profile: {
          avatar: '👤',
          bio: 'Test user for Socket.IO development'
        },
        stats: { postsCount: 0, likesReceived: 0, commentsCount: 0 },
        status: 'active',
        createdAt: new Date()
      };

      console.log('✅ Mock login successful for:', email);
      return createSendToken(mockUser, 200, res, 'Login successful (mock mode)');
    } else {
      console.log('❌ Mock login failed for:', email);
      return next(new AppError('Invalid credentials (use password: 123456 for testing)', 401));
    }
  }

  // Find user and include password for comparison
  console.log('🔍 Looking for user:', email);
  const user = await User.findByEmail(email).select('+password');

  if (!user) {
    console.log('❌ User not found:', email);
    return next(new AppError('Invalid email or password', 401));
  }

  console.log('✅ User found:', user.email, 'Role:', user.role);

  // Check if account is locked
  if (user.isLocked) {
    return next(new AppError('Account is temporarily locked due to too many failed login attempts', 423));
  }

  // Check if account is active
  if (user.status !== 'active') {
    return next(new AppError('Account is not active', 401));
  }

  // Check password
  console.log('🔑 Checking password for user:', user.email);
  const isPasswordCorrect = await user.comparePassword(password);
  console.log('🔑 Password check result:', isPasswordCorrect);

  if (!isPasswordCorrect) {
    console.log('❌ Password incorrect for user:', user.email);
    // Increment login attempts
    await user.incLoginAttempts();
    return next(new AppError('Invalid email or password', 401));
  }

  console.log('✅ Password correct for user:', user.email);

  // Reset login attempts on successful login
  if (user.security.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login and IP
  user.security.lastLogin = new Date();
  user.security.ipAddresses = user.security.ipAddresses || [];
  
  const clientIP = req.ip || req.connection.remoteAddress;
  if (!user.security.ipAddresses.includes(clientIP)) {
    user.security.ipAddresses.push(clientIP);
    // Keep only last 10 IPs
    if (user.security.ipAddresses.length > 10) {
      user.security.ipAddresses = user.security.ipAddresses.slice(-10);
    }
  }

  user.stats.lastActiveDate = new Date();
  await user.save();

  console.log('🎯 Sending login response for user:', user.email, 'Role:', user.role);
  createSendToken(user, 200, res, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  // In a stateless JWT system, logout is handled on the client side
  // But we can update the user's last active date
  if (req.user) {
    req.user.stats.lastActiveDate = new Date();
    await req.user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  // Check if MongoDB is available
  const mongoose = (await import('mongoose')).default;
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  MongoDB not available, using mock user data');

    // Return mock user data based on JWT token
    const mockUser = {
      _id: req.user.id,
      id: req.user.id,
      name: req.user.email === 'basu@gmail.com' ? 'Basu' : 'Bassu',
      email: req.user.email,
      role: req.user.role || 'user',
      profile: {
        avatar: '👤',
        bio: 'Test user for Socket.IO development',
        age: 25,
        location: 'Test City',
        preferences: {},
        mentalHealthGoals: [],
        emergencyContacts: []
      },
      stats: {
        postsCount: 0,
        likesReceived: 0,
        commentsCount: 0,
        lastActiveDate: new Date()
      },
      status: 'active',
      createdAt: new Date(),
      joinedGroups: [],
      registeredEvents: []
    };

    return res.status(200).json({
      success: true,
      data: {
        user: mockUser,
      },
    });
  }

  const user = await User.findById(req.user._id)
    .populate('joinedGroups.groupId', 'name category')
    .populate('registeredEvents.eventId', 'title startDate');

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'name',
    'profile.bio',
    'profile.age',
    'profile.location',
    'profile.preferences',
    'profile.mentalHealthGoals',
    'profile.emergencyContacts',
  ];

  const updates = {};
  
  // Filter allowed fields
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current password and new password', 400));
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  createSendToken(user, 200, res, 'Password changed successfully');
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide email address', 400));
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  user.security.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.security.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  await user.save();

  // In a real application, you would send an email here
  // For now, we'll just return the token (remove this in production)
  res.status(200).json({
    success: true,
    message: 'Password reset token sent to email',
    // Remove this in production - only for development
    resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
  });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Please provide new password', 400));
  }

  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    'security.passwordResetToken': hashedToken,
    'security.passwordResetExpires': { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Set new password
  user.password = password;
  user.security.passwordResetToken = undefined;
  user.security.passwordResetExpires = undefined;
  
  await user.save();

  createSendToken(user, 200, res, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({
    'verification.emailVerificationToken': token,
    'verification.emailVerificationExpires': { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.verification.isEmailVerified = true;
  user.verification.emailVerificationToken = undefined;
  user.verification.emailVerificationExpires = undefined;
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

// Apply rate limiting to auth routes (temporarily disabled for testing)
// router.use(authRateLimit());

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes working!' });
});

// Simple test login
router.post('/test-login', async (req, res) => {
  try {
    console.log('🧪 Test login request:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    console.log('🔍 User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Test login working',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Test login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Simple test login route for development
router.post('/test-login', (req, res) => {
  try {
    console.log('🧪 Test login request received');
    console.log('🧪 Request body:', req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Simple mock authentication
    if (password === '123456') {
      const mockUser = {
        _id: email === 'basu@gmail.com' ? '6876b161f270b709a4ff566a' : '6878f15abbd43cf983ff6d32',
        id: email === 'basu@gmail.com' ? '6876b161f270b709a4ff566a' : '6878f15abbd43cf983ff6d32',
        name: email === 'basu@gmail.com' ? 'Basu' : 'Bassu',
        email: email,
        role: 'user',
        profile: {
          avatar: '👤',
          bio: 'Test user for Socket.IO development'
        },
        stats: { postsCount: 0, likesReceived: 0, commentsCount: 0 },
        status: 'active',
        createdAt: new Date()
      };

      const token = jwt.sign(
        {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      console.log('✅ Test login successful for:', email);

      return res.status(200).json({
        success: true,
        message: 'Login successful (test mode)',
        data: {
          token,
          user: mockUser
        }
      });
    } else {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials (use password: 123456 for testing)'
      });
    }
  } catch (error) {
    console.error('❌ Test login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Test login failed',
      error: error.message
    });
  }
});

// Simple health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
