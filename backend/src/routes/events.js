import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import { 
  validateEvent,
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public (with optional auth)
export const getEvents = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    type,
    search,
    upcoming = true,
    isActive = true,
    isPublic = true
  } = req.query;

  // Build filter object
  const filter = { isActive, isPublic, status: 'published' };
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (type && type !== 'all') {
    filter.type = type;
  }

  // Filter for upcoming events
  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
  }

  // Build search query
  if (search) {
    filter.$text = { $search: search };
  }

  const events = await Event.find(filter)
    .populate('organizer.user', 'name profile.avatar')
    .sort({ startDate: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Event.countDocuments(filter);

  // If user is authenticated, mark which events they've registered for
  if (req.user) {
    events.forEach(event => {
      event.isRegisteredByUser = event.attendees.some(
        attendee => attendee.user.toString() === req.user._id.toString()
      );
    });
  }

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public (with optional auth)
export const getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer.user', 'name profile.avatar')
    .populate('attendees.user', 'name profile.avatar')
    .populate('createdBy', 'name');

  if (!event || !event.isPublic || event.status !== 'published') {
    return next(new AppError('Event not found', 404));
  }

  // Increment view count
  event.analytics.views += 1;
  await event.save();

  // If user is authenticated, check registration status
  if (req.user) {
    const registration = event.attendees.find(
      attendee => attendee.user._id.toString() === req.user._id.toString()
    );
    event.userRegistration = registration || null;
  }

  res.status(200).json({
    success: true,
    data: { event },
  });
});

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private (Admin/Moderator only)
export const createEvent = catchAsync(async (req, res, next) => {
  const eventData = {
    ...req.body,
    createdBy: req.user._id,
    organizer: {
      ...req.body.organizer,
      user: req.body.organizer.user || req.user._id,
    },
  };

  const event = await Event.create(eventData);

  // Populate organizer information
  await event.populate('organizer.user', 'name profile.avatar');

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: { event },
  });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private (Admin/Moderator or Organizer)
export const updateEvent = catchAsync(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if user is authorized to update
  const isAuthorized = 
    req.user.role === 'admin' ||
    req.user.role === 'moderator' ||
    event.organizer.user.toString() === req.user._id.toString() ||
    event.createdBy.toString() === req.user._id.toString();

  if (!isAuthorized) {
    return next(new AppError('Not authorized to update this event', 403));
  }

  event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('organizer.user', 'name profile.avatar');

  // Notify registered attendees of updates
  if (event.attendees.length > 0) {
    const notifications = event.attendees.map(attendee => ({
      recipient: attendee.user,
      type: 'event-update',
      title: 'Event Updated',
      message: `"${event.title}" has been updated. Please check the latest details.`,
      reference: {
        model: 'Event',
        id: event._id,
      },
    }));

    await Notification.insertMany(notifications);
  }

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: { event },
  });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private (Admin only)
export const deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Change status to cancelled
  event.status = 'cancelled';
  event.isActive = false;
  await event.save();

  // Notify registered attendees
  if (event.attendees.length > 0) {
    const notifications = event.attendees.map(attendee => ({
      recipient: attendee.user,
      type: 'event-update',
      title: 'Event Cancelled',
      message: `Unfortunately, "${event.title}" has been cancelled. We apologize for any inconvenience.`,
      reference: {
        model: 'Event',
        id: event._id,
      },
    }));

    await Notification.insertMany(notifications);
  }

  res.status(200).json({
    success: true,
    message: 'Event cancelled successfully',
  });
});

// @desc    Register for event
// @route   POST /api/v1/events/:id/register
// @access  Private
export const registerForEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event || !event.isActive || !event.isPublic || event.status !== 'published') {
    return next(new AppError('Event not found or not available for registration', 404));
  }

  // Check if registration is still open
  if (event.registration.deadline && new Date() > event.registration.deadline) {
    return next(new AppError('Registration deadline has passed', 400));
  }

  // Check if user is already registered
  const existingRegistration = event.attendees.find(
    attendee => attendee.user.toString() === req.user._id.toString()
  );

  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 400));
  }

  // Check if event is full
  if (event.capacity.maxAttendees && event.capacity.currentAttendees >= event.capacity.maxAttendees) {
    if (!event.capacity.waitlistEnabled) {
      return next(new AppError('Event is full', 400));
    }
    
    // Add to waitlist
    event.waitlist.push({
      user: req.user._id,
    });
    
    await event.save();
    
    return res.status(200).json({
      success: true,
      message: 'Added to waitlist. You will be notified if a spot becomes available.',
    });
  }

  // Register user for event
  event.attendees.push({
    user: req.user._id,
    customResponses: req.body.customResponses || [],
  });

  event.capacity.currentAttendees += 1;
  event.analytics.registrationClicks += 1;
  await event.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: {
      registeredEvents: {
        eventId: event._id,
      },
    },
    'stats.lastActiveDate': new Date(),
  });

  // Create confirmation notification
  await Notification.create({
    recipient: req.user._id,
    type: 'event-reminder',
    title: 'Event Registration Confirmed',
    message: `You have successfully registered for "${event.title}". We'll send you a reminder before the event.`,
    reference: {
      model: 'Event',
      id: event._id,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Successfully registered for the event',
  });
});

// @desc    Unregister from event
// @route   POST /api/v1/events/:id/unregister
// @access  Private
export const unregisterFromEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Find user's registration
  const attendeeIndex = event.attendees.findIndex(
    attendee => attendee.user.toString() === req.user._id.toString()
  );

  if (attendeeIndex === -1) {
    return next(new AppError('You are not registered for this event', 400));
  }

  // Remove attendee
  event.attendees.splice(attendeeIndex, 1);
  event.capacity.currentAttendees = Math.max(0, event.capacity.currentAttendees - 1);
  
  // If there's a waitlist, promote the first person
  if (event.waitlist.length > 0) {
    const nextUser = event.waitlist.shift();
    event.attendees.push({
      user: nextUser.user,
    });
    event.capacity.currentAttendees += 1;

    // Notify the promoted user
    await Notification.create({
      recipient: nextUser.user,
      type: 'event-reminder',
      title: 'Spot available in event',
      message: `A spot is now available for "${event.title}". You have been automatically registered.`,
      reference: {
        model: 'Event',
        id: event._id,
      },
    });
  }

  await event.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { registeredEvents: { eventId: event._id } },
  });

  res.status(200).json({
    success: true,
    message: 'Successfully unregistered from the event',
  });
});

// Apply optional auth to public routes
router.get('/', optionalAuth, validatePagination, getEvents);
router.get('/:id', optionalAuth, validateObjectId('id'), getEvent);

// Apply authentication to protected routes
router.use(protect);

router.post('/', authorize('admin', 'moderator'), validateEvent, createEvent);
router.put('/:id', validateObjectId('id'), validateEvent, updateEvent);
router.delete('/:id', validateObjectId('id'), authorize('admin'), deleteEvent);
router.post('/:id/register', validateObjectId('id'), registerForEvent);
router.post('/:id/unregister', validateObjectId('id'), unregisterFromEvent);

export default router;
