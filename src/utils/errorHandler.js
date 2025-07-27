class ErrorHandler {
    // Create Express error handling middleware
    static createExpressErrorMiddleware() {
        return (err, req, res, next) => {
            // Log the error
            console.error('Unhandled Error:', {
                message: err.message,
                name: err.name,
                stack: err.stack,
                method: req.method,
                path: req.path,
                timestamp: new Date().toISOString()
            });

            // Determine error status code
            const statusCode = err.status || 
                (err.name === 'ValidationError' ? 400 : 
                (err.name === 'UnauthorizedError' ? 401 : 
                (err.name === 'ForbiddenError' ? 403 : 500)));

            // Send error response
            res.status(statusCode).json({
                error: {
                    message: err.message || 'An unexpected error occurred',
                    status: statusCode,
                    timestamp: new Date().toISOString()
                }
            });
        };
    }

    // Method to log errors with additional context
    static logError(error, context = {}) {
        console.error('Detailed Error Log:', {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            context,
            timestamp: new Date().toISOString()
        });
    }
}

export default ErrorHandler;
