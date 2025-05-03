import express from 'express';
import songRoutes from './song.routes';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply rate limiting to all API routes
router.use(apiLimiter);

// Mount song routes
router.use('/songs', songRoutes);

export default router;