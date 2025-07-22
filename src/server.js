// WuTong Mountain Enhanced Server with Claude AI Integration
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import WuTongGameOrchestrator from './services/gameOrchestrator.js';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced middleware setup
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.anthropic.com"]
        }
    }
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, '../public')));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' }
});

const claudeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit Claude API calls
    message: { error: 'Claude API rate limit exceeded' }
});

app.use(generalLimiter);

// Initialize database and game orchestrator
let dbPool, redisClient, gameOrchestrator;

async function initializeDatabases() {
    try {
        // PostgreSQL connection
        if (process.env.DATABASE_URL) {
            dbPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });

            // Test database connection
            await dbPool.query('SELECT NOW()');
            console.log('✅ PostgreSQL connected successfully');

            // Create tables if they don't exist
            await createTables();
        } else {
            console.log('⚠️ No DATABASE_URL provided, using demo mode');
        }

        // Redis connection (optional)
        if (process.env.REDIS_URL) {
            redisClient = createClient({ url: process.env.REDIS_URL });
            await redisClient.connect();
            console.log('✅ Redis connected successfully');
        } else {
            console.log('⚠️ No REDIS_URL provided, continuing without Redis');
        }

        // Initialize Game Orchestrator with Claude AI
        if (process.env.CLAUDE_API_KEY) {
            gameOrchestrator = new WuTongGameOrchestrator(dbPool, redisClient, process.env.CLAUDE_API_KEY);
            console.log('✅ Claude AI Game Orchestrator initialized');
        } else {
            console.log('⚠️ No CLAUDE_API_KEY provided, using fallback responses');
        }

    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

async function createTables() {
    try {
        // Enhanced player table with consciousness tracking
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                passphrase VARCHAR(50) UNIQUE NOT NULL,
                insight INTEGER DEFAULT 45,
                presence INTEGER DEFAULT 40,
                resolve INTEGER DEFAULT 35,
                vigor INTEGER DEFAULT 50,
                harmony INTEGER DEFAULT 55,
                spiral_points INTEGER DEFAULT 0,
                consciousness_level INTEGER DEFAULT 1,
                convergence_stage INTEGER DEFAULT 1,
                current_reality VARCHAR(20) DEFAULT 'wutong',
                current_location VARCHAR(100) DEFAULT 'meditation-gardens',
                created_at TIMESTAMP DEFAULT NOW(),
                last_active TIMESTAMP DEFAULT NOW()
            );
        `);

        // Memory archive table
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                player_passphrase VARCHAR(50) REFERENCES players(passphrase),
                reality VARCHAR(20),
                location VARCHAR(100),
                action TEXT,
                outcome TEXT,
                spiral_points_gained INTEGER DEFAULT 0,
                stats_changed JSONB,
                consciousness_impact VARCHAR(20),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('✅ Database tables created/verified');
    } catch (error) {
        console.error('Table creation error:', error);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        services: {
            database: dbPool ? 'connected' : 'unavailable',
            redis: redisClient ? 'connected' : 'unavailable',
            claude_ai: gameOrchestrator ? 'ready' : 'unavailable'
        },
        consciousness_evolution: 'active'
    });
});

// Create new player journey
app.post('/api/player/new', async (req, res) => {
    try {
        const adjectives = ['silver', 'golden', 'quiet', 'wise', 'gentle', 'radiant', 'peaceful', 'mystic'];
        const nouns = ['moon', 'star', 'river', 'mountain', 'light', 'wind', 'harmony', 'crystal'];
        const passphrase = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}`;

        let player = {
            passphrase: passphrase,
            insight: 45,
            presence: 40,
            resolve: 35,
            vigor: 50,
            harmony: 55,
            spiral_points: 0,
            consciousness_level: 1,
            convergence_stage: 1,
            current_reality: 'wutong',
            current_location: 'meditation-gardens'
        };

        // Save to database if available
        if (dbPool) {
            try {
                const result = await dbPool.query(`
                    INSERT INTO players (passphrase, insight, presence, resolve, vigor, harmony, spiral_points, current_reality, current_location)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING *
                `, [player.passphrase, player.insight, player.presence, player.resolve, player.vigor, player.harmony, player.spiral_points, player.current_reality, player.current_location]);
                
                player = result.rows[0];
            } catch (dbError) {
                console.log('Database save failed, using in-memory player:', dbError.message);
            }
        }

        res.json({
            success: true,
            player: player,
            message: 'Welcome to your consciousness evolution journey!',
            instructions: `Save this passphrase: ${passphrase}`
        });

    } catch (error) {
        console.error('Player creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create consciousness journey'
        });
    }
});

// Load existing player
app.get('/api/player/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;
        let player = null;

        // Try to load from database
        if (dbPool) {
            try {
                const result = await dbPool.query('SELECT * FROM players WHERE passphrase = $1', [passphrase]);
                player = result.rows[0];
            } catch (dbError) {
                console.log('Database query error:', dbError.message);
            }
        }

        // Create demo player if not found
        if (!player) {
            player = {
                passphrase: passphrase,
                insight: 45,
                presence: 40,
                resolve: 35,
                vigor: 50,
                harmony: 55,
                spiral_points: 0,
                consciousness_level: 1,
                convergence_stage: 1,
                current_reality: 'wutong',
                current_location: 'meditation-gardens'
            };
        }

        // Format stats for frontend
        player.stats = {
            insight: player.insight,
            presence: player.presence,
            resolve: player.resolve,
            vigor: player.vigor,
            harmony: player.harmony
        };

        res.json({
            success: true,
            player: player,
            message: 'Welcome back to your consciousness evolution journey!'
        });

    } catch (error) {
        console.error('Player load error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load consciousness journey'
        });
    }
});

// Generate story content with Claude AI
app.post('/api/story/generate', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, reality } = req.body;

        if (!passphrase || !reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and reality required'
            });
        }

        if (gameOrchestrator) {
            const result = await gameOrchestrator.generateStoryContent(passphrase, reality);
            res.json(result);
        } else {
            // Fallback response when Claude is not available
            res.json({
                success: true,
                story: {
                    scene: reality === 'wutong' ? 
                        "You find yourself in the Harmony Gardens where crystalline towers catch the afternoon light. Community members gather in peaceful circles, sharing wisdom and supporting each other's growth." :
                        "The bio-luminescent corridors of WokeMound pulse with unnatural light. You hear distant screams from the transformation chambers, but also whispers of resistance and hope.",
                    atmosphere: reality === 'wutong' ? 'peaceful and nurturing' : 'tense but determined',
                    choices: [
                        {
                            text: reality === 'wutong' ? 
                                "Join a wisdom circle to learn from others" : 
                                "Investigate the source of the screams to help",
                            mechanics: reality === 'wutong' ? "PRESENCE + HARMONY" : "RESOLVE + VIGOR",
                            service_opportunity: reality === 'wutong' ? 
                                "Support community learning" : 
                                "Rescue others from forced change"
                        }
                    ]
                },
                message: 'Fallback story - Claude AI integration will enhance this experience'
            });
        }

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Story generation temporarily unavailable'
        });
    }
});

// Process choice with Claude AI
app.post('/api/choice/process', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, choice } = req.body;

        if (!passphrase || !choice) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and choice required'
            });
        }

        if (gameOrchestrator) {
            const result = await gameOrchestrator.processChoice(passphrase, choice);
            res.json(result);
        } else {
            // Fallback choice processing
            const statsChanged = {};
            const baseGain = Math.floor(Math.random() * 5) + 3;
            
            if (choice.mechanics && choice.mechanics.includes('INSIGHT')) statsChanged.insight = baseGain;
            if (choice.mechanics && choice.mechanics.includes('PRESENCE')) statsChanged.presence = baseGain;
            if (choice.mechanics && choice.mechanics.includes('RESOLVE')) statsChanged.resolve = baseGain;
            if (choice.mechanics && choice.mechanics.includes('VIGOR')) statsChanged.vigor = baseGain;
            if (choice.mechanics && choice.mechanics.includes('HARMONY')) statsChanged.harmony = baseGain;

            res.json({
                success: true,
                outcome: {
                    outcome: `Your choice to "${choice.text}" creates positive ripples through the consciousness field.`,
                    consciousness_growth: "You gain deeper understanding of how individual actions serve collective evolution.",
                    service_impact: "Your decision helps others in ways both seen and unseen.",
                    impact: "moderate"
                },
                stats_changed: statsChanged,
                spiral_points_gained: 15,
                message: 'Fallback processing - Claude AI will enhance choice outcomes'
            });
        }

    } catch (error) {
        console.error('Choice processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Choice processing temporarily unavailable'
        });
    }
});

// Switch reality
app.post('/api/reality/switch', async (req, res) => {
    try {
        const { passphrase, target_reality } = req.body;

        if (!passphrase || !target_reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and target reality required'
            });
        }

        // Update player reality in database
        if (dbPool) {
            try {
                await dbPool.query(
                    'UPDATE players SET current_reality = $1, last_active = NOW() WHERE passphrase = $2',
                    [target_reality, passphrase]
                );
            } catch (dbError) {
                console.log('Reality update failed:', dbError.message);
            }
        }

        res.json({
            success: true,
            new_reality: target_reality,
            transfer_experience: `Reality shifts around you. The ${target_reality === 'wutong' ? 'harmonious energies of WuTong Mountain' : 'challenging shadows of WokeMound'} welcome your consciousness.`,
            message: `Consciousness transferred to ${target_reality === 'wutong' ? 'WuTong Mountain (Utopia)' : 'WokeMound (Horror)'}`
        });

    } catch (error) {
        console.error('Reality switch error:', error);
        res.status(500).json({
            success: false,
            error: 'Reality transition temporarily unavailable'
        });
    }
});

// Get player memories
app.get('/api/player/:passphrase/memories', async (req, res) => {
    try {
        const { passphrase } = req.params;

        if (dbPool) {
            const result = await dbPool.query(
                'SELECT * FROM memories WHERE player_passphrase = $1 ORDER BY created_at DESC LIMIT 20',
                [passphrase]
            );
            
            res.json({
                success: true,
                memories: result.rows
            });
        } else {
            res.json({
                success: true,
                memories: [],
                message: 'Memory archive will be populated as you make choices'
            });
        }

    } catch (error) {
        console.error('Memory retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Memory archive temporarily unavailable'
        });
    }
});

// Player heartbeat for auto-save
app.post('/api/player/:passphrase/heartbeat', async (req, res) => {
    try {
        const { passphrase } = req.params;

        if (dbPool) {
            await dbPool.query(
                'UPDATE players SET last_active = NOW() WHERE passphrase = $1',
                [passphrase]
            );
        }

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

// Start server
async function startServer() {
    await initializeDatabases();
    
    app.listen(PORT, () => {
        console.log(`
🏔️ WuTong Mountain Enhanced Consciousness Evolution Server

🌟 Server: http://localhost:${PORT}
🌟 Health: http://localhost:${PORT}/health
🌟 Environment: ${process.env.NODE_ENV || 'development'}
🤖 Claude AI: ${process.env.CLAUDE_API_KEY ? 'Enabled' : 'Disabled'}

✨ Ready for consciousness evolution with Claude AI! ✨
        `);
    });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🏔️ WuTong Mountain server shutting down gracefully...');
    if (dbPool) await dbPool.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});

startServer().catch(console.error);
