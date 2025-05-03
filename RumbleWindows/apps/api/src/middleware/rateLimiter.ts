import rateLimit from 'express-rate-limit';

// Create rate limiter middleware
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: {
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

// Specific limiter for upload endpoint
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many upload requests, please try again later.',
      code: 'UPLOAD_LIMIT_EXCEEDED'
    }
  }
});