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
        if (process.env.REDIS_URL) {
            redisClient = createClient({ url: process.env.REDIS_URL });
            redisClient.on('error', (err) => console.log('Redis Error:', err));
            await redisClient.connect();
            console.log('✅ Redis connected');
        }
    } catch (error) {
        console.log(⚠️ Database initializing...', error.message);
    }
}

// Create database tables - FIXED SCHEMA
async function createTables() {
    const client = await dbPool.connect();
    try {
        // Players table - core consciousness evolution data - FIXED
        await client.query(`
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                passphrase VARCHAR(100) UNIQUE NOT NULL,
                consciousness_level INTEGER DEFAULT 0,
                spiral_points INTEGER DEFAULT 0,
                current_reality VARCHAR(20) DEFAULT 'wutong',
                current_location VARCHAR(100) DEFAULT 'arrival-point',
                
                -- Core stats (0-100 scale)
                insight INTEGER DEFAULT 35,
                presence INTEGER DEFAULT 35,
                resolve INTEGER DEFAULT 35,
                vigor INTEGER DEFAULT 35,
                harmony INTEGER DEFAULT 35,
                
                -- Service metrics for spiral progression
                service_actions INTEGER DEFAULT 0,
                trauma_healing_actions INTEGER DEFAULT 0,
                collaborative_actions INTEGER DEFAULT 0,
                
                -- Community impact
                choices_created INTEGER DEFAULT 0,
                choices_adopted INTEGER DEFAULT 0,
                players_helped INTEGER DEFAULT 0,
                success_rate DECIMAL(3,2) DEFAULT 0.00,
                
                -- Metadata - FIXED: Added sessions_count
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_play_time INTEGER DEFAULT 0,
                sessions_count INTEGER DEFAULT 0
            )
        `);

        // Memories table - external memory system
        await client.query(`
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                player_passphrase VARCHAR(100) REFERENCES players(passphrase),
                memory_type VARCHAR(50) NOT NULL,
                content TEXT NOT NULL,
                reality VARCHAR(20) NOT NULL,
                location VARCHAR(100),
                emotional_resonance VARCHAR(20),
                spiral_points_generated INTEGER DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_shared BOOLEAN DEFAULT false,
                impact_score INTEGER DEFAULT 0
            )
        `);

        // Choices table - community-created choices
        await client.query(`
            CREATE TABLE IF NOT EXISTS choices (
                id SERIAL PRIMARY KEY,
                creator_passphrase VARCHAR(100) REFERENCES players(passphrase),
                choice_text TEXT NOT NULL,
                choice_consequence TEXT,
                reality VARCHAR(20) NOT NULL,
                location VARCHAR(100),
                wisdom_level INTEGER DEFAULT 1,
                adoption_count INTEGER DEFAULT 0,
                success_rate DECIMAL(3,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables created/verified');
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

// =============================================================================
// CONSCIOUSNESS EVOLUTION API ENDPOINTS
// =============================================================================

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

// Validate passphrase format
function isValidPassphrase(passphrase) {
    return /^[a-z]+-[a-z]+$/.test(passphrase);
}

// Normalize passphrase (convert various formats to dash-separated lowercase)
function normalizePassphrase(passphrase) {
    return passphrase.toLowerCase().replace(/\s+/g, '-');
}

// Create new consciousness journey
app.post('/api/player/new', async (req, res) => {
    try {
        const passphrase = generatePassphrase();
        
        // Create player record
        let player = {
            passphrase: passphrase,
            consciousness_level: 0,
            spiral_points: 0,
            current_reality: 'wutong',
            current_location: 'arrival-point',
            stats: {
                insight: 35,
                presence: 35,
                resolve: 35,
                vigor: 35,
                harmony: 35
            }
        };

        // Save to database if available
        if (dbPool) {
            try {
                const result = await dbPool.query(`
                    INSERT INTO players (
                        passphrase, consciousness_level, spiral_points, 
                        current_reality, current_location,
                        insight, presence, resolve, vigor, harmony
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING *
                `, [
                    passphrase, 0, 0, 'wutong', 'arrival-point',
                    35, 35, 35, 35, 35
                ]);
                
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
            error: 'Failed to create consciousness journey',
            message: 'Please try again. Even obstacles are part of the path.'
        });
    }
});

// Load existing consciousness journey - FIXED sessions_count
app.get('/api/player/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;
        const normalizedPassphrase = normalizePassphrase(passphrase);
        
        if (!isValidPassphrase(normalizedPassphrase)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid passphrase format',
                message: 'Consciousness journey passphrases must be two words (e.g., "silver-moon")'
            });
        }

        let player = null;
        
        // Try to load from database
        if (dbPool) {
            try {
                const result = await dbPool.query(`
                    SELECT * FROM players WHERE passphrase = $1
                `, [normalizedPassphrase]);

                if (result.rows.length > 0) {
                    const dbPlayer = result.rows[0];
                    
                    // Update last active and sessions_count - FIXED
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
                        },
                        service_metrics: {
                            service_actions: dbPlayer.service_actions,
                            trauma_healing_actions: dbPlayer.trauma_healing_actions,
                            collaborative_actions: dbPlayer.collaborative_actions
                        }
                    };
                }
            } catch (dbError) {
                console.log('⚠️ Database query error:', dbError.message);
            }
        }

        // If no player found in database, create demo data
        if (!player) {
            // For demo purposes, create a basic player
            player = {
                passphrase: normalizedPassphrase,
                consciousness_level: 1,
                spiral_points: 50,
                current_reality: 'wutong',
                current_location: 'meditation-gardens',
                stats: {
                    insight: 45,
                    presence: 40,
                    resolve: 35,
                    vigor: 50,
                    harmony: 55
                }
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
            error: 'Failed to load consciousness journey',
            message: 'Please try again or start a new journey.'
        });
    }
});

// Switch between realities - FIXED to handle multiple field names
app.post('/api/reality/switch', async (req, res) => {
    try {
        const { passphrase, newReality, target_reality } = req.body;
        const realityToSwitch = newReality || target_reality;
        
        if (!passphrase || !realityToSwitch) {
            return res.status(400).json({
                success: false,
                error: 'Missing passphrase or reality',
                message: 'Both passphrase and target reality are required'
            });
        }

        const normalizedPassphrase = normalizePassphrase(passphrase);
        
        // Validate reality
        if (!['wutong', 'wokemound'].includes(realityToSwitch)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid reality',
                message: 'Reality must be either "wutong" or "wokemound"'
            });
        }

        // Update player's reality in database
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
            error: 'Failed to switch realities',
            message: 'Reality is fluid, try again'
        });
    }
});

// Story generation endpoint (placeholder for future Claude integration)
app.post('/api/story/generate', async (req, res) => {
    try {
        const { passphrase, previous_choice } = req.body;
        
        // TODO: Integrate with Claude API for dynamic story generation
        res.json({
            success: true,
            message: 'Story generation endpoint ready for Claude integration',
            story: {
                location: "Development Zone",
                context: "Story generation coming soon",
                text: "This endpoint will connect to Claude API to generate dynamic, consciousness-evolution focused stories based on player choices and current reality."
            },
            choices: [
                {
                    text: "Prepare for Claude integration",
                    mechanics: "INSIGHT + PRESENCE",
                    type: "development"
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Choice processing endpoint (placeholder for future development)
app.post('/api/choice/process', async (req, res) => {
    try {
        const { passphrase, choice } = req.body;
        
        // Basic choice processing logic
        const statsChanged = {};
        let spiralPoints = 0;

        // Process mechanics
        const mechanics = choice.mechanics || '';
        if (mechanics.includes('INSIGHT')) statsChanged.insight = Math.floor(Math.random() * 5) + 3;
        if (mechanics.includes('PRESENCE')) statsChanged.presence = Math.floor(Math.random() * 5) + 3;
        if (mechanics.includes('RESOLVE')) statsChanged.resolve = Math.floor(Math.random() * 5) + 3;
        if (mechanics.includes('VIGOR')) statsChanged.vigor = Math.floor(Math.random() * 5) + 3;
        if (mechanics.includes('HARMONY')) statsChanged.harmony = Math.floor(Math.random() * 5) + 3;

        // Spiral points based on choice type
        if (choice.type === 'service') spiralPoints = Math.floor(Math.random() * 20) + 15;
        else if (choice.type === 'community') spiralPoints = Math.floor(Math.random() * 15) + 10;
        else spiralPoints = Math.floor(Math.random() * 10) + 5;

        // Update database if available
        if (dbPool && Object.keys(statsChanged).length > 0) {
            try {
                const updateFields = Object.keys(statsChanged).map((key, index) => 
                    `${key} = LEAST(100, GREATEST(0, ${key} + $${index + 2}))`
                ).join(', ');
                
                const values = [normalizePassphrase(passphrase), ...Object.values(statsChanged)];
                
                if (spiralPoints > 0) {
                    await dbPool.query(`
                        UPDATE players SET 
                            ${updateFields},
                            spiral_points = spiral_points + $${values.length + 1}
                        WHERE passphrase = $1
                    `, [...values, spiralPoints]);
                } else {
                    await dbPool.query(`
                        UPDATE players SET ${updateFields}
                        WHERE passphrase = $1
                    `, values);
                }
            } catch (dbError) {
                console.log('⚠️ Stats update error:', dbError.message);
            }
        }

        res.json({
            success: true,
            result: {
                statsChanged: statsChanged,
                spiralPoints: spiralPoints,
                outcome: "Choice processed successfully"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Additional API endpoints for future development

// Get player statistics
app.get('/api/player/:passphrase/stats', async (req, res) => {
    try {
        const { passphrase } = req.params;
        // Implementation coming soon
        res.json({
            success: true,
            message: 'Player statistics endpoint - coming soon!',
            stats: { placeholder: true }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🏔️ WuTong Mountain server shutting down gracefully...');
    if (dbPool) await dbPool.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});

startServer().catch(console.error);