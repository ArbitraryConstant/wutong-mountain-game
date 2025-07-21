const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const GameOrchestrator = require('./services/gameOrchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

// Database initialization function
async function initializeDatabase(pool) {
    console.log('🗄️ Initializing database tables...');
    
    const schema = `
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            passphrase VARCHAR(100) UNIQUE NOT NULL,
            consciousness_level INTEGER DEFAULT 0,
            spiral_points INTEGER DEFAULT 0,
            current_reality VARCHAR(20) DEFAULT 'wutong',
            current_location VARCHAR(100) DEFAULT 'arrival-point',
            
            insight INTEGER DEFAULT 35,
            presence INTEGER DEFAULT 35,
            resolve INTEGER DEFAULT 35,
            vigor INTEGER DEFAULT 35,
            harmony INTEGER DEFAULT 35,
            
            created_at TIMESTAMP DEFAULT NOW(),
            last_active TIMESTAMP DEFAULT NOW(),
            sessions_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS community_choices (
            id SERIAL PRIMARY KEY,
            creator_passphrase VARCHAR(100) NOT NULL,
            original_text TEXT NOT NULL,
            processed_text TEXT NOT NULL,
            quality_rating INTEGER DEFAULT 3,
            spiral_points_bonus INTEGER DEFAULT 5,
            consciousness_alignment TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            used_count INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_players_passphrase ON players(passphrase);
    `;

    try {
        await pool.query(schema);
        console.log('✅ Database tables ready!');
    } catch (error) {
        console.log('⚠️ Database initialization error:', error.message);
    }
}

// Try multiple DATABASE_URL sources (Railway auto-links services)
function getDatabaseUrl() {
    return process.env.DATABASE_URL || 
           process.env.DATABASE_PRIVATE_URL || 
           process.env.DATABASE_PUBLIC_URL ||
           process.env.POSTGRES_URL ||
           process.env.PGURL;
}

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Database connections
let dbPool;
let gameOrchestrator;

async function initializeConnections() {
    try {
        const databaseUrl = getDatabaseUrl();
        
        if (databaseUrl) {
            console.log('🔗 Database URL found:', databaseUrl.substring(0, 20) + '...');
            
            dbPool = new Pool({
                connectionString: databaseUrl,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            
            await dbPool.query('SELECT NOW()');
            console.log('✅ PostgreSQL connected');
            
            // Initialize database tables
            await initializeDatabase(dbPool);
        } else {
            console.log('❌ No DATABASE_URL found in environment variables');
            console.log('Available env vars:', Object.keys(process.env).filter(key => 
                key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('PG')
            ));
        }

        // Initialize Game Orchestrator
        if (process.env.CLAUDE_API_KEY) {
            gameOrchestrator = new GameOrchestrator(dbPool, null, process.env.CLAUDE_API_KEY);
            console.log('✅ Claude API integrated');
        }

    } catch (error) {
        console.error('❌ Connection initialization failed:', error);
    }
}

// Health check
app.get('/health', (req, res) => {
    const databaseUrl = getDatabaseUrl();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: dbPool ? 'connected' : 'disconnected',
            database_url_found: !!databaseUrl,
            claude: process.env.CLAUDE_API_KEY ? 'configured' : 'not configured'
        },
        debug: {
            database_env_vars: Object.keys(process.env).filter(key => 
                key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('PG')
            )
        }
    });
});

// Create new player journey
app.post('/api/player/new', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({
                success: false,
                error: 'Database not available - check environment variables'
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
            error: 'Failed to initiate consciousness journey: ' + error.message
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

        res.json({
            success: true,
            player: player,
            consciousness_level: consciousnessLevel
        });

    } catch (error) {
        console.error('Player retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve consciousness data'
        });
    }
});

// Generate story content
app.post('/api/story/generate', async (req, res) => {
    try {
        const { passphrase, reality } = req.body;

        if (!passphrase || !reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and reality required'
            });
        }

        if (!gameOrchestrator) {
            return res.status(500).json({
                success: false,
                error: 'Story generation not available'
            });
        }

        const result = await gameOrchestrator.generateStoryContent(passphrase, reality);
        res.json(result);

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Story generation failed'
        });
    }
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🌟 WuTong Mountain - Consciousness Evolution Gaming Platform',
        status: 'Consciousness evolution system online',
        claude_integration: process.env.CLAUDE_API_KEY ? 'Active ✅' : 'Not configured ❌',
        database_status: dbPool ? 'Connected ✅' : 'Not connected ❌',
        endpoints: {
            health: '/health',
            new_player: 'POST /api/player/new',
            get_player: 'GET /api/player/:passphrase',
            generate_story: 'POST /api/story/generate'
        }
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
            console.log('🚀 Consciousness evolution platform LIVE!');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer().catch(console.error);
