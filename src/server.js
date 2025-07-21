const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Fix trust proxy for Railway
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    trustProxy: true
});
app.use('/api/', limiter);

// Database connections
let dbPool;

// FORCED DATABASE RECREATION FUNCTION
async function forceRecreateDatabase(pool) {
    console.log('🔥 FORCING DATABASE RECREATION...');
    
    const client = await pool.connect();
    try {
        // Check current schema
        console.log('📋 Checking current table...');
        try {
            const currentColumns = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                ORDER BY ordinal_position;
            `);
            console.log('Current columns:', currentColumns.rows.map(r => r.column_name));
        } catch (err) {
            console.log('⚠️ Table check error (may not exist):', err.message);
        }
        
        // FORCE DROP AND RECREATE
        console.log('🔥 DROPPING existing table completely...');
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        console.log('✅ Table dropped');
        
        console.log('🏗️ CREATING new table with ALL consciousness columns...');
        await client.query(`
            CREATE TABLE players (
                id SERIAL PRIMARY KEY,
                passphrase VARCHAR(100) UNIQUE NOT NULL,
                insight INTEGER DEFAULT 35,
                presence INTEGER DEFAULT 35,
                resolve INTEGER DEFAULT 35,
                vigor INTEGER DEFAULT 35,
                harmony INTEGER DEFAULT 35,
                current_reality VARCHAR(20) DEFAULT 'wutong',
                current_location VARCHAR(100) DEFAULT 'arrival-point',
                consciousness_level INTEGER DEFAULT 0,
                spiral_points INTEGER DEFAULT 0,
                sessions_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                last_active TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ NEW TABLE CREATED with ALL consciousness stats!');
        
        // Verify new schema
        const newColumns = await client.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        `);
        
        console.log('🔍 VERIFICATION - New table schema:');
        newColumns.rows.forEach(row => {
            const isConsciousnessStat = ['insight', 'presence', 'resolve', 'vigor', 'harmony'].includes(row.column_name);
            const marker = isConsciousnessStat ? '🧠' : '📋';
            console.log(`  ${marker} ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
        });
        
        // Test insert
        console.log('🧪 Testing with sample insert...');
        const testResult = await client.query(`
            INSERT INTO players (passphrase) 
            VALUES ('database-fix-test') 
            RETURNING id, insight, presence, resolve, vigor, harmony
        `);
        console.log('✅ TEST INSERT SUCCESSFUL:', testResult.rows[0]);
        
        // Clean up test
        await client.query(`DELETE FROM players WHERE passphrase = 'database-fix-test'`);
        console.log('✅ Test data cleaned up');
        
        console.log('🎉 DATABASE RECREATION COMPLETE!');
        
    } catch (error) {
        console.error('❌ Database recreation failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function initializeConnections() {
    try {
        const databaseUrl = process.env.DATABASE_URL;

        if (databaseUrl) {
            console.log('🔗 Database URL found');

            dbPool = new Pool({
                connectionString: databaseUrl,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });

            await dbPool.query('SELECT NOW()');
            console.log('✅ PostgreSQL connected');

            // FORCE DATABASE RECREATION
            await forceRecreateDatabase(dbPool);

        } else {
            console.log('❌ No DATABASE_URL found');
        }

    } catch (error) {
        console.error('❌ Connection initialization failed:', error);
    }
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: '🏔️ WuTong Mountain - Database Fixed!',
        services: {
            database: dbPool ? 'connected' : 'disconnected'
        }
    });
});

// Create new player journey - FIXED VERSION
app.post('/api/player/new', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({
                success: false,
                error: 'Database not available'
            });
        }

        const passphrase = req.body.passphrase || `consciousness-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log('🎮 Creating player with passphrase:', passphrase);

        const result = await dbPool.query(
            `INSERT INTO players (passphrase) VALUES ($1) RETURNING *`,
            [passphrase]
        );

        console.log('✅ Player created successfully:', result.rows[0]);

        res.json({
            success: true,
            passphrase: passphrase,
            message: '🏔️ Consciousness evolution journey initiated successfully!',
            player: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Player creation error:', error);
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

        res.json({
            success: true,
            player: result.rows[0]
        });

    } catch (error) {
        console.error('Player retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve consciousness data'
        });
    }
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🏔️ WuTong Mountain - Consciousness Evolution Gaming Platform',
        status: 'Database schema FIXED and operational!',
        database_status: dbPool ? 'Connected ✅' : 'Not connected ❌',
        endpoints: {
            health: '/health',
            new_player: 'POST /api/player/new',
            get_player: 'GET /api/player/:passphrase'
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
            console.log(`💾 Database: ${dbPool ? 'Connected and FIXED' : 'Not configured'}`);
            console.log('🎉 CONSCIOUSNESS EVOLUTION PLATFORM WITH FIXED DATABASE IS LIVE!');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer().catch(console.error);
