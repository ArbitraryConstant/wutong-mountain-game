// src/utils/errorHandler.js

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        // Capture stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(
    🚨 Error Occurred 🚨
    Path: 
    Method: 
    Error: 
    );

    // Determine status code and error response
    const statusCode = err instanceof AppError 
        ? err.statusCode 
        : (err.status || 500);

    const errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            code: err instanceof AppError ? err.errorCode : 'UNKNOWN_ERROR'
        }
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = err.stack;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper to handle async route errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Predefined error types for consistent error handling
 */
export const ErrorTypes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Create a new AppError with predefined types
 * @param {string} message - Error message
 * @param {string} type - Error type from ErrorTypes
 * @returns {AppError} Custom application error
 */
export const createError = (message, type = ErrorTypes.INTERNAL_ERROR) => {
    const errorStatusCodes = {
        [ErrorTypes.VALIDATION_ERROR]: 400,
        [ErrorTypes.NOT_FOUND]: 404,
        [ErrorTypes.UNAUTHORIZED]: 401,
        [ErrorTypes.FORBIDDEN]: 403,
        [ErrorTypes.DATABASE_ERROR]: 500
    };

    return new AppError(
        message, 
        errorStatusCodes[type] || 500, 
        type
    );
};

export default {
    AppError,
    errorHandler,
    asyncHandler,
    createError,
    ErrorTypes
};
