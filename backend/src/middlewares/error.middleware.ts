// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Determine status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let isOperational = err.isOperational || false;

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    message = `${field} already exists`;
    statusCode = 409;
    isOperational = true;
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map(
      (e: any) => e.message
    );
    message = messages.join(', ');
    statusCode = 400;
    isOperational = true;
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
    isOperational = true;
  }
  else if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
    isOperational = true;
  }

  // Treat all 4xx client errors as operational
  if (statusCode < 500) {
    isOperational = true;
  }

  // Logging: Unexpected 5xx errors get full stack trace; 4xx client errors get clean warnings
  if (statusCode >= 500) {
    console.error('❌ Unexpected Server Error:', err);
  } else {
    console.warn(`⚠️ Client Error (${statusCode}): ${message}`);
  }

  const responseMessage = (isOperational || process.env.NODE_ENV !== 'production')
    ? message
    : 'Internal server error';

  sendError(res, responseMessage, statusCode);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
