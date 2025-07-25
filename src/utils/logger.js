// src/utils/logger.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Logging utility with multiple log levels
 */
class Logger {
    /**
     * Write log message to file
     * @param {string} level - Log level (info, warn, error)
     * @param {string} message - Log message
     * @param {Object} [metadata] - Additional log metadata
     */
    static writeLog(level, message, metadata = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = JSON.stringify({
            timestamp,
            level,
            message,
            ...metadata
        }) + '\n';

        const logFilePath = path.join(logDirectory, ${level}-.log);
        
        try {
            fs.appendFileSync(logFilePath, logEntry);
        } catch (error) {
            console.error('Failed to write log:', error);
        }
    }

    /**
     * Log informational message
     * @param {string} message - Info message
     * @param {Object} [metadata] - Additional metadata
     */
    static info(message, metadata = {}) {
        console.log(ℹ️ , metadata);
        this.writeLog('info', message, metadata);
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {Object} [metadata] - Additional metadata
     */
    static warn(message, metadata = {}) {
        console.warn(⚠️ , metadata);
        this.writeLog('warn', message, metadata);
    }

    /**
     * Log error message
     * @param {string} message - Error message
     * @param {Object} [metadata] - Additional metadata
     */
    static error(message, metadata = {}) {
        console.error(🚨 , metadata);
        this.writeLog('error', message, metadata);
    }

    /**
     * Log game-specific events
     * @param {string} eventType - Type of game event
     * @param {Object} eventData - Event details
     */
    static gameEvent(eventType, eventData = {}) {
        const message = Game Event: ;
        console.log(message, eventData);
        this.writeLog('game-event', message, eventData);
    }

    /**
     * Performance logging
     * @param {string} operation - Operation being measured
     * @param {number} duration - Time taken in milliseconds
     */
    static performance(operation, duration) {
        const message = Performance: ;
        console.log(message, { duration });
        this.writeLog('performance', message, { duration });
    }
}

export default Logger;
