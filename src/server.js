// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route modules
import playerRoutes from './api/routes/playerRoutes.js';
import storyRoutes from './api/routes/storyRoutes.js';
import realityRoutes from './api/routes/realityRoutes.js';
import healthRoutes from './api/routes/healthRoutes.js';

// Import middleware
import rateLimiters from './api/middleware/rateLimiterMiddleware.js';
import { errorHandler } from './utils/errorHandler.js';
import PerformanceTracker from './utils/performanceTracker.js';
import Logger from './utils/logger.js';
import gameConfig from './config/gameConfig.js';
import DatabaseConnectionManager from './database/connections.js';

// Load environment variables
dotenv.config();

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(helmet()); // Adds security headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// Performance tracking middleware
app.use(PerformanceTracker.routePerformanceMiddleware());

// Apply rate limiters
app.use(rateLimiters.general);

// Routes
app.use('/api/player', playerRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/reality', realityRoutes);
app.use('/health', healthRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Log server startup
        Logger.info('Starting WuTong Mountain Server', {
            environment: gameConfig.game.environment,
            version: gameConfig.game.version
        });

        // Test database connection before starting server
        const isDatabaseConnected = await DatabaseConnectionManager.testConnection();
        
        if (!isDatabaseConnected) {
            Logger.error('Database connection failed. Server cannot start.');
            process.exit(1);
        }

        const server = app.listen(PORT, () => {
            console.log(
🏔️ WuTong Mountain Consciousness Evolution Server

🌟 Server: http://localhost:
🌟 Environment: 
🌟 Version: 
🤖 Game Features: 
   - Story Generation: 
   - Reality Switching: 

✨ Ready for consciousness evolution journeys! ✨
            );
        });

        // Graceful shutdown
        const gracefulShutdown = async () => {
            Logger.warn('Server shutdown initiated');
            
            // Close database connections
            await DatabaseConnectionManager.closeConnections();

            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        return server;
    } catch (error) {
        Logger.error('Failed to start server', { error: error.message });
        process.exit(1);
    }
};

// Start the server
startServer();
