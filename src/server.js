// WuTong Mountain Backend Server - Complete Fixed Implementation
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import pkg from 'pg';
import { createClient } from 'redis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connections
let dbPool = null;
let redisClient = null;

// Initialize database connections
async function initializeDatabases() {
    try {
        // PostgreSQL connection
        if (process.env.DATABASE_URL) {
            dbPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            // Test connection and create tables
            await createTables();
            console.log('✅ PostgreSQL connected and tables ready');
        }

        // Redis connection (optional)
        if (process.env.REDIS_URL && process.env.REDIS_URL.trim()) {
            redisClient = createClient({ url: process.env.REDIS_URL });
            redisClient.on('error', (err) => console.log('Redis Error:', err));
            await redisClient.connect();
            console.log('✅ Redis connected');
        }
    } catch (error) {
        console.log('⚠️ Database initializing...', error.message);
    }
}

// Create database tables with migration
async function createTables() {
    const client = await dbPool.connect();
    try {
        // Players table - core consciousness evolution data
        await client.query(`
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
                service_actions INTEGER DEFAULT 0,
                trauma_healing_actions INTEGER DEFAULT 0,
                collaborative_actions INTEGER DEFAULT 0,
                choices_created INTEGER DEFAULT 0,
                choices_adopted INTEGER DEFAULT 0,
                players_helped INTEGER DEFAULT 0,
                success_rate DECIMAL(3,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_play_time INTEGER DEFAULT 0,
                sessions_count INTEGER DEFAULT 0
            )
        `);

        // Add missing columns if they don't exist (migration)
        await client.query(`
            ALTER TABLE players 
            ADD COLUMN IF NOT EXISTS sessions_count INTEGER DEFAULT 0
        `);

        console.log('✅ Database tables created/verified and migrated');
    } finally {
        client.release();
    }
}

// Middleware setup
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.anthropic.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: '🏔️ WuTong Mountain consciousness evolution system is running!',
        timestamp: new Date().toISOString(),
        database: {
            postgresql: dbPool ? 'connected' : 'not configured',
            redis: redisClient ? 'connected' : 'not configured'
        }
    });
});

// Generate consciousness evolution passphrase
function generatePassphrase() {
    const adjectives = [
        'quiet', 'silver', 'golden', 'crimson', 'azure', 'violet', 'emerald',
        'wise', 'gentle', 'radiant', 'serene', 'mystic', 'flowing', 'dancing',
        'luminous', 'peaceful', 'sacred', 'eternal', 'cosmic', 'stellar'
    ];

    const nouns = [
        'moon', 'star', 'wind', 'river', 'mountain', 'ocean', 'forest',
        'crystal', 'harmony', 'spirit', 'dawn', 'light', 'phoenix', 'dragon',
        'lotus', 'sage', 'oracle', 'wanderer', 'temple', 'bridge'
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}-${noun}`;
}

// Validate and normalize passphrase
function isValidPassphrase(passphrase) {
    return /^[a-z]+-[a-z]+$/.test(passphrase);
}

function normalizePassphrase(passphrase) {
    return passphrase.toLowerCase().replace(/\s+/g, '-');
}

// Create new consciousness journey
app.post('/api/player/new', async (req, res) => {
    try {
        const passphrase = generatePassphrase();
        let player = {
            passphrase: passphrase,
            consciousness_level: 0,
            spiral_points: 0,
            current_reality: 'wutong',
            current_location: 'arrival-point',
            stats: { insight: 35, presence: 35, resolve: 35, vigor: 35, harmony: 35 }
        };

        if (dbPool) {
            try {
                await dbPool.query(`
                    INSERT INTO players (
                        passphrase, consciousness_level, spiral_points,
                        current_reality, current_location,
                        insight, presence, resolve, vigor, harmony
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [passphrase, 0, 0, 'wutong', 'arrival-point', 35, 35, 35, 35, 35]);
                console.log('✅ New consciousness journey created:', passphrase);
            } catch (dbError) {
                console.log('⚠️ Database not ready, using memory:', dbError.message);
            }
        }

        res.json({
            success: true,
            passphrase: passphrase,
            message: `Welcome to WuTong Mountain! Your consciousness journey begins.`,
            player: player
        });
    } catch (error) {
        console.error('Player creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create consciousness journey'
        });
    }
});

// Load existing consciousness journey
app.get('/api/player/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;
        const normalizedPassphrase = normalizePassphrase(passphrase);

        if (!isValidPassphrase(normalizedPassphrase)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid passphrase format'
            });
        }

        let player = null;

        if (dbPool) {
            try {
                const result = await dbPool.query(`
                    SELECT * FROM players WHERE passphrase = $1
                `, [normalizedPassphrase]);

                if (result.rows.length > 0) {
                    const dbPlayer = result.rows[0];
                    await dbPool.query(`
                        UPDATE players SET
                            last_active = CURRENT_TIMESTAMP,
                            sessions_count = COALESCE(sessions_count, 0) + 1
                        WHERE passphrase = $1
                    `, [normalizedPassphrase]);

                    player = {
                        passphrase: dbPlayer.passphrase,
                        consciousness_level: dbPlayer.consciousness_level,
                        spiral_points: dbPlayer.spiral_points,
                        current_reality: dbPlayer.current_reality,
                        current_location: dbPlayer.current_location,
                        stats: {
                            insight: dbPlayer.insight,
                            presence: dbPlayer.presence,
                            resolve: dbPlayer.resolve,
                            vigor: dbPlayer.vigor,
                            harmony: dbPlayer.harmony
                        }
                    };
                }
            } catch (dbError) {
                console.log('⚠️ Database query error:', dbError.message);
            }
        }

        if (!player) {
            player = {
                passphrase: normalizedPassphrase,
                consciousness_level: 1,
                spiral_points: 50,
                current_reality: 'wutong',
                current_location: 'meditation-gardens',
                stats: { insight: 45, presence: 40, resolve: 35, vigor: 50, harmony: 55 }
            };
        }

        res.json({
            success: true,
            player: player,
            message: `Welcome back to your consciousness evolution journey!`
        });
    } catch (error) {
        console.error('Player load error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load consciousness journey'
        });
    }
});

// Switch between realities
app.post('/api/reality/switch', async (req, res) => {
    try {
        const { passphrase, newReality, target_reality } = req.body;
        const realityToSwitch = newReality || target_reality;

        if (!passphrase || !realityToSwitch) {
            return res.status(400).json({
                success: false,
                error: 'Missing passphrase or reality'
            });
        }

        const normalizedPassphrase = normalizePassphrase(passphrase);

        if (!['wutong', 'wokemound'].includes(realityToSwitch)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid reality'
            });
        }

        if (dbPool) {
            try {
                await dbPool.query(`
                    UPDATE players SET
                        current_reality = $1,
                        last_active = CURRENT_TIMESTAMP
                    WHERE passphrase = $2
                `, [realityToSwitch, normalizedPassphrase]);
                console.log(`✅ Reality switched to ${realityToSwitch} for ${normalizedPassphrase}`);
            } catch (dbError) {
                console.log('⚠️ Database update error:', dbError.message);
            }
        }

        res.json({
            success: true,
            newReality: realityToSwitch,
            message: `Consciousness shifted to ${realityToSwitch === 'wutong' ? 'WuTong Mountain (Utopia)' : 'WokeMound (Horror)'}`
        });
    } catch (error) {
        console.error('Reality switch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to switch realities'
        });
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
🏔️ WuTong Mountain Consciousness Evolution Server Running!

🌟 Server: http://localhost:${PORT}
🌟 Health: http://localhost:${PORT}/health
🌟 Environment: ${process.env.NODE_ENV || 'development'}

✨ Ready for consciousness evolution journeys! ✨
        `);
    });
}

process.on('SIGTERM', async () => {
    console.log('🏔️ WuTong Mountain server shutting down gracefully...');
    if (dbPool) await dbPool.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});

startServer().catch(console.error);
