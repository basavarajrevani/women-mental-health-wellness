import express from 'express';
import { catchAsync } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Health check endpoint
// @route   GET /api/v1/health
// @access  Public
export const healthCheck = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'WMH Backend API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
  });
});

// @desc    Database health check
// @route   GET /api/v1/health/db
// @access  Public
export const dbHealthCheck = catchAsync(async (req, res, next) => {
  const mongoose = await import('mongoose');

  const dbStatus = mongoose.default.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(dbStatus === 1 ? 200 : 503).json({
    success: dbStatus === 1,
    database: {
      status: statusMap[dbStatus],
      name: mongoose.default.connection.name,
      host: mongoose.default.connection.host,
      port: mongoose.default.connection.port,
    },
    timestamp: new Date().toISOString(),
  });
});

// Routes
router.get('/', healthCheck);
router.get('/db', dbHealthCheck);

export default router;
