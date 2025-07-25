// src/utils/performanceTracker.js
import Logger from './logger.js';

/**
 * Performance tracking and profiling utility
 */
class PerformanceTracker {
    /**
     * Start a performance measurement
     * @returns {Function} Stop function to end measurement
     */
    static start() {
        const start = process.hrtime();

        return () => {
            const [seconds, nanoseconds] = process.hrtime(start);
            const durationMs = (seconds * 1000) + (nanoseconds / 1_000_000);
            return durationMs;
        };
    }

    /**
     * Measure and log performance of an async function
     * @param {string} operationName - Name of the operation being measured
     * @param {Function} fn - Async function to measure
     * @returns {Promise} Result of the function
     */
    static async measure(operationName, fn) {
        const stop = this.start();

        try {
            const result = await fn();
            const duration = stop();

            // Log performance if it exceeds threshold
            if (duration > 500) { // 500ms threshold
                Logger.performance(operationName, duration);
            }

            return result;
        } catch (error) {
            const duration = stop();
            Logger.error(Performance measurement failed for , { 
                duration, 
                error: error.message 
            });
            throw error;
        }
    }

    /**
     * Create a middleware for tracking route performance
     * @returns {Function} Express middleware
     */
    static routePerformanceMiddleware() {
        return (req, res, next) => {
            const start = process.hrtime();

            // Patch the end method to measure total response time
            const originalEnd = res.end;
            res.end = function(...args) {
                const [seconds, nanoseconds] = process.hrtime(start);
                const durationMs = (seconds * 1000) + (nanoseconds / 1_000_000);

                // Log route performance
                Logger.performance('route_request', {
                    path: req.path,
                    method: req.method,
                    duration: durationMs,
                    status: res.statusCode
                });

                // Call the original end method
                originalEnd.apply(this, args);
            };

            next();
        };
    }
}

export default PerformanceTracker;
