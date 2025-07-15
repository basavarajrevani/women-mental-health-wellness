import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  handleValidationErrors
];

// Community post validation rules
export const validateCommunityPost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Post content must be between 1 and 5000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('category')
    .isIn(['support', 'achievement', 'question', 'general', 'announcement', 'milestone', 'discussion'])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
  
  handleValidationErrors
];

export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content must be between 1 and 1000 characters'),
  
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
  
  handleValidationErrors
];

// Support group validation rules
export const validateSupportGroup = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Group name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .isIn([
      'anxiety', 'depression', 'trauma', 'grief', 'stress', 'parenting', 
      'relationships', 'self-care', 'workplace', 'general', 'eating-disorders',
      'addiction', 'bipolar', 'ocd', 'ptsd', 'postpartum', 'lgbtq+', 
      'teens', 'seniors', 'other'
    ])
    .withMessage('Invalid category'),
  
  body('meetingType')
    .isIn(['online', 'in-person', 'hybrid'])
    .withMessage('Meeting type must be online, in-person, or hybrid'),
  
  body('maxMembers')
    .isInt({ min: 2, max: 100 })
    .withMessage('Max members must be between 2 and 100'),
  
  body('duration')
    .isInt({ min: 15, max: 240 })
    .withMessage('Duration must be between 15 and 240 minutes'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  handleValidationErrors
];

// Event validation rules
export const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Description must be between 10 and 3000 characters'),
  
  body('category')
    .isIn([
      'workshop', 'webinar', 'support-session', 'therapy-group', 'mindfulness',
      'fitness', 'social', 'educational', 'fundraising', 'awareness',
      'conference', 'retreat', 'other'
    ])
    .withMessage('Invalid category'),
  
  body('type')
    .isIn(['online', 'in-person', 'hybrid'])
    .withMessage('Event type must be online, in-person, or hybrid'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('pricing.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  handleValidationErrors
];

// Resource validation rules
export const validateResource = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Resource title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .isIn([
      'article', 'video', 'podcast', 'book', 'app', 'website', 'tool',
      'worksheet', 'guide', 'course', 'therapy', 'hotline', 'emergency',
      'medication', 'exercise', 'meditation', 'other'
    ])
    .withMessage('Invalid category'),
  
  body('type')
    .isIn([
      'educational', 'therapeutic', 'emergency', 'self-help', 'professional',
      'community', 'crisis', 'wellness', 'medical', 'legal', 'financial'
    ])
    .withMessage('Invalid type'),
  
  body('content.url')
    .optional()
    .isURL()
    .withMessage('Content URL must be a valid URL'),
  
  handleValidationErrors
];

// Mood entry validation rules
export const validateMoodEntry = [
  body('mood')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood rating must be between 1 and 10'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  
  body('sleepQuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Sleep quality must be between 1 and 5'),
  
  body('energyLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy level must be between 1 and 10'),
  
  body('stressLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),
  
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid ID`),
  
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];
