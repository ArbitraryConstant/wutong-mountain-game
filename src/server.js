import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import healthRoutes from './api/routes/healthRoutes.js';
import playerRoutes from './api/routes/playerRoutes.js';
import realityRoutes from './api/routes/realityRoutes.js';
import storyRoutes from './api/routes/storyRoutes.js';
import narrativeRoutes from './api/routes/narrativeRoutes.js';

// Import services and utilities
import SystemOrchestrator from './config/systemOrchestrator.js';
import ConsciousnessLogger from './utils/logger.js';
import ErrorHandler from './utils/errorHandler.js';

// Import the Prisma client
import DatabaseConnection from './database/connections.js';

// Create Express application
const app = express();

// Determine current directory (for ES Module compatibility)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security and Performance Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging and Performance Tracking Middleware
app.use(morgan('combined'));

// Server Startup Function
async function startServer() {
    try {
        // Initialize Prisma client
        await DatabaseConnection.connect();

        // Initialize system components with more detailed logging
        const systemHealth = await SystemOrchestrator.initialize();

        // Prepare log message with safe value retrieval
        const databaseStatus = systemHealth.database?.status || 'Unknown';
        const initializationTime = systemHealth.database?.initializationTime || 'N/A';
        const averageLevel = systemHealth.consciousness?.evolutionState?.averageConsciousnessLevel || 'N/A';
        const averageSpiralPoints = systemHealth.consciousness?.evolutionState?.averageSpiralPoints || 'N/A';

        // Log detailed system initialization
        const logMessage = '?? WuTong Mountain Consciousness Evolution Server Initialized ??\n\n' +
            'System Health Overview:\n' +
            '- Database Status: ' + databaseStatus + '\n' +
            '- Connection Time: ' + initializationTime + 'ms\n\n' +
            'Consciousness Metrics:\n' +
            '- Average Level: ' + averageLevel + '\n' +
            '- Average Spiral Points: ' + averageSpiralPoints;

        ConsciousnessLogger.log(logMessage, {
            level: 'EMERGENCE',
            category: 'system'
        });

        // Route Configuration
        app.use('/health', healthRoutes);
        app.use('/api/player', playerRoutes);
        app.use('/api/reality', realityRoutes);
        app.use('/api/story', storyRoutes);
        app.use('/api/narrative', narrativeRoutes);

        // Static File Serving
        app.use(express.static(path.join(__dirname, '../public')));

        // Catch-all route for SPA
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // Global Error Handling Middleware
        app.use(ErrorHandler.createExpressErrorMiddleware());

        // Server Configuration
        const PORT = process.env.PORT || 3000;
        const HOST = process.env.HOST || '0.0.0.0';

        // Start the server
        const server = app.listen(PORT, HOST, () => {
            const serverLogMessage = '?? WuTong Mountain Consciousness Evolution Server Running ??\n\n' +
                '?? Server Details:\n' +
                '- Host: ' + HOST + '\n' +
                '- Port: ' + PORT + '\n' +
                '- Environment: ' + (process.env.NODE_ENV || 'development') + '\n\n' +
                '?? Available Routes:\n' +
                '- Health Check: /health\n' +
                '- Player Management: /api/player\n' +
                '- Reality Interactions: /api/reality\n' +
                '- Story Generation: /api/story\n' +
                '- Narrative Exploration: /api/narrative\n\n' +
                '?? Consciousness Evolution Activated!';

            ConsciousnessLogger.log(serverLogMessage, {
                level: 'EMERGENCE',
                category: 'system'
            });
        });

        // Graceful Shutdown Handling
        process.on('SIGTERM', () => {
            ConsciousnessLogger.log('Graceful shutdown initiated', {
                level: 'TRANSFORMATION',
                category: 'system'
            });
            server.close(() => {
                SystemOrchestrator.shutdown();
                process.exit(0);
            });
        });

        return server;
    } catch (error) {
        ConsciousnessLogger.log('Server startup failed', {
            level: 'CRITICAL',
            category: 'error',
            details: error
        });
        ErrorHandler.logError(error);
        process.exit(1);
    }
}

// Initiate Server Startup
startServer().catch(console.error);

export default app;