// Updated server.js with Claude API Integration
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const Redis = require('redis');
const GameOrchestrator = require('./services/gameOrchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Claude API specific rate limiting
const claudeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 Claude API calls per minute
    message: { error: 'Claude API rate limit exceeded. Please wait a moment.' }
});

// Database connection
let dbPool;
let redisClient;
let gameOrchestrator;

async function initializeConnections() {
    try {
        // PostgreSQL
        if (process.env.DATABASE_URL) {
            dbPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            
            await dbPool.query('SELECT NOW()');
            console.log('✅ PostgreSQL connected');
        }

        // Redis (optional)
        if (process.env.REDIS_URL) {
            redisClient = Redis.createClient({ url: process.env.REDIS_URL });
            await redisClient.connect();
            console.log('✅ Redis connected');
        }

        // Initialize Game Orchestrator with Claude API
        if (process.env.CLAUDE_API_KEY) {
            gameOrchestrator = new GameOrchestrator(dbPool, redisClient, process.env.CLAUDE_API_KEY);
            console.log('✅ Claude API integrated');
        } else {
            console.log('⚠️ Claude API key not configured');
        }

    } catch (error) {
        console.error('Connection initialization failed:', error);
    }
}

// =============================================================================
// API ENDPOINTS WITH CLAUDE INTEGRATION
// =============================================================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: dbPool ? 'connected' : 'disconnected',
            redis: redisClient ? 'connected' : 'disconnected',
            claude: process.env.CLAUDE_API_KEY ? 'configured' : 'not configured'
        }
    });
});

// Create new player journey
app.post('/api/player/new', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({
                success: false,
                error: 'Database not available'
            });
        }

        const passphrase = req.body.passphrase || `consciousness-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await dbPool.query(
            `INSERT INTO players (
                passphrase, current_reality, insight, presence, resolve, vigor, harmony,
                spiral_points, sessions_count, created_at, last_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING *`,
            [passphrase, 'wutong', 25, 25, 25, 25, 25, 0, 1]
        );

        res.json({
            success: true,
            passphrase: passphrase,
            message: 'Consciousness evolution journey initiated',
            player: result.rows[0]
        });

    } catch (error) {
        console.error('Player creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate consciousness journey'
        });
    }
});

// Get player data
app.get('/api/player/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;
        
        if (!dbPool) {
            return res.status(500).json({
                success: false,
                error: 'Database not available'
            });
        }

        const result = await dbPool.query(
            'SELECT * FROM players WHERE passphrase = $1',
            [passphrase]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Consciousness journey not found'
            });
        }

        const player = result.rows[0];
        const consciousnessLevel = gameOrchestrator ? 
            gameOrchestrator.calculateConsciousnessLevel(player.spiral_points) : 1;
        const convergenceStage = gameOrchestrator ?
            gameOrchestrator.calculateConvergenceStage(player.spiral_points) : 1;

        res.json({
            success: true,
            player: player,
            consciousness_level: consciousnessLevel,
            convergence_stage: convergenceStage
        });

    } catch (error) {
        console.error('Player retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve consciousness data'
        });
    }
});

// Generate story content with Claude
app.post('/api/story/generate', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, reality } = req.body;

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Claude API not available'
            });
        }

        if (!passphrase || !reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and reality required'
            });
        }

        const result = await gameOrchestrator.generateStoryContent(passphrase, reality);
        res.json(result);

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Story generation temporarily unavailable'
        });
    }
});

// Process choice with Claude
app.post('/api/choice/process', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, choice } = req.body;

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Claude API not available'
            });
        }

        if (!passphrase || !choice) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and choice required'
            });
        }

        const result = await gameOrchestrator.processChoice(passphrase, choice);
        res.json(result);

    } catch (error) {
        console.error('Choice processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Choice processing temporarily unavailable'
        });
    }
});

// Switch reality with consciousness transfer
app.post('/api/reality/switch', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, target_reality } = req.body;

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Claude API not available'
            });
        }

        if (!passphrase || !['wokemound', 'wutong'].includes(target_reality)) {
            return res.status(400).json({
                success: false,
                error: 'Valid passphrase and target reality required'
            });
        }

        const result = await gameOrchestrator.switchReality(passphrase, target_reality);
        res.json(result);

    } catch (error) {
        console.error('Reality switch error:', error);
        res.status(500).json({
            success: false,
            error: 'Reality transfer temporarily unavailable'
        });
    }
});

// Initiate dream sharing
app.post('/api/dream/share', claudeLimiter, async (req, res) => {
    try {
        const { helper_passphrase, dreamer_id } = req.body;

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Claude API not available'
            });
        }

        if (!helper_passphrase) {
            return res.status(400).json({
                success: false,
                error: 'Helper passphrase required'
            });
        }

        const result = await gameOrchestrator.initiateDreamSharing(
            helper_passphrase, 
            dreamer_id || `dreamer-${Date.now()}`
        );
        res.json(result);

    } catch (error) {
        console.error('Dream sharing error:', error);
        res.status(500).json({
            success: false,
            error: 'Dream sharing temporarily unavailable'
        });
    }
});

// Add player choice to community pool
app.post('/api/choice/add', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, choice_text, game_context } = req.body;

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Claude API not available'
            });
        }

        if (!passphrase || !choice_text) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and choice text required'
            });
        }

        const result = await gameOrchestrator.addPlayerChoice(
            passphrase, 
            choice_text, 
            game_context || {}
        );
        res.json(result);

    } catch (error) {
        console.error('Choice addition error:', error);
        res.status(500).json({
            success: false,
            error: 'Choice addition temporarily unavailable'
        });
    }
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🌟 WuTong Mountain - Consciousness Evolution Gaming Platform',
        status: 'Consciousness evolution system online',
        claude_integration: process.env.CLAUDE_API_KEY ? 'Active ✅' : 'Not configured ❌',
        endpoints: {
            health: '/health',
            new_player: 'POST /api/player/new',
            get_player: 'GET /api/player/:passphrase',
            generate_story: 'POST /api/story/generate',
            process_choice: 'POST /api/choice/process',
            switch_reality: 'POST /api/reality/switch',
            dream_sharing: 'POST /api/dream/share',
            add_choice: 'POST /api/choice/add'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Consciousness evolution continues despite temporary obstacles'
    });
});

// Start server
async function startServer() {
    try {
        await initializeConnections();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🏔️ WuTong Mountain server running on port ${PORT}`);
            console.log(`🌐 URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || `http://localhost:${PORT}`}`);
            console.log(`🧠 Claude API: ${process.env.CLAUDE_API_KEY ? 'Connected' : 'Not configured'}`);
            console.log(`💾 Database: ${dbPool ? 'Connected' : 'Not configured'}`);
            console.log(`⚡ Redis: ${redisClient ? 'Connected' : 'Not configured'}`);
            console.log('🚀 Consciousness evolution platform with AI storytelling LIVE!');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', async () => {
    console.log('🏔️ WuTong Mountain server shutting down gracefully...');
    if (dbPool) await dbPool.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});

startServer().catch(console.error);
