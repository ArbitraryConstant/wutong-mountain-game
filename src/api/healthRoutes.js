// src/api/routes/healthRoutes.js
import express from 'express';
import DatabaseConnectionManager from '../../database/connections.js';
import gameConfig from '../../config/gameConfig.js';

const router = express.Router();

/**
 * Comprehensive health check endpoint
 */
router.get('/', async (req, res) => {
    try {
        // Test database connection
        const isDatabaseConnected = await DatabaseConnectionManager.testConnection();

        // Prepare health check response
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: gameConfig.game.version,
            environment: gameConfig.game.environment,
            components: {
                database: isDatabaseConnected ? 'connected' : 'disconnected',
                server: 'running',
                features: {
                    storyGeneration: gameConfig.features.storyGeneration,
                    realitySwitching: gameConfig.features.realitySwitching
                }
            }
        };

        // Determine overall status code
        const statusCode = isDatabaseConnected ? 200 : 503;

        res.status(statusCode).json(healthCheck);
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error during health check'
        });
    }
});

export default router;
