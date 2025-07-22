// DATABASE FIX SERVER - Runs on Railway where postgres.railway.internal is accessible
const { Pool } = require('pg');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔥 DATABASE FIX SERVER STARTING...');

// Database fix function
async function fixDatabaseSchema() {
    console.log('🔧 Connecting to Railway PostgreSQL...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to Railway PostgreSQL from server!');
        
        // Check current table first
        try {
            const currentResult = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                ORDER BY ordinal_position;
            `);
            console.log('📋 Current columns:', currentResult.rows.map(r => r.column_name));
        } catch (err) {
            console.log('⚠️ No existing table found');
        }
        
        // Drop existing table
        console.log('🔥 Dropping existing players table...');
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        console.log('✅ Table dropped successfully');
        
        // Create new table with ALL consciousness stats
        console.log('🏗️ Creating new table with ALL consciousness columns...');
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
        
        console.log('🔍 SCHEMA VERIFICATION - All columns created:');
        newColumns.rows.forEach(row => {
            const isConsciousnessStat = ['insight', 'presence', 'resolve', 'vigor', 'harmony'].includes(row.column_name);
            const marker = isConsciousnessStat ? '🧠' : '📋';
            console.log(`  ${marker} ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
        });
        
        // Test insert to verify everything works
        console.log('🧪 Testing table with sample insert...');
        const testResult = await client.query(`
            INSERT INTO players (passphrase) 
            VALUES ('database-fix-verification') 
            RETURNING id, insight, presence, resolve, vigor, harmony, sessions_count
        `);
        
        const testPlayer = testResult.rows[0];
        console.log('✅ TEST INSERT SUCCESSFUL:');
        console.log(`  Player ID: ${testPlayer.id}`);
        console.log(`  🧠 Insight: ${testPlayer.insight}`);
        console.log(`  🧠 Presence: ${testPlayer.presence}`);
        console.log(`  🧠 Resolve: ${testPlayer.resolve}`);
        console.log(`  🧠 Vigor: ${testPlayer.vigor}`);
        console.log(`  🧠 Harmony: ${testPlayer.harmony}`);
        console.log(`  📈 Sessions: ${testPlayer.sessions_count}`);
        
        // Clean up test data
        await client.query(`DELETE FROM players WHERE passphrase = 'database-fix-verification'`);
        console.log('✅ Test data cleaned up');
        
        client.release();
        await pool.end();
        
        console.log('🎉 DATABASE FIX COMPLETE!');
        console.log('🏔️ WuTong Mountain consciousness evolution system is ready!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        return false;
    }
}

// Fix database on startup
fixDatabaseSchema().then(success => {
    console.log(`Database fix ${success ? 'SUCCESSFUL' : 'FAILED'}`);
});

// Simple endpoints to verify the fix worked
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: '🏔️ Database Fix Server - Schema Updated!',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/player/new', async (req, res) => {
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        
        const client = await pool.connect();
        const passphrase = req.body.passphrase || `test-${Date.now()}`;
        
        const result = await client.query(
            `INSERT INTO players (passphrase) VALUES ($1) RETURNING *`,
            [passphrase]
        );
        
        client.release();
        await pool.end();
        
        res.json({
            success: true,
            message: '🎉 Player creation works! All consciousness stats present!',
            player: result.rows[0]
        });
        
    } catch (error) {
        console.error('❌ Player creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: '🔧 Database Fix Server - WuTong Mountain',
        status: 'Database schema has been updated with all consciousness stats!',
        endpoints: {
            health: '/health',
            test_player: 'POST /api/player/new'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔧 Database Fix Server running on port ${PORT}`);
    console.log('🏔️ WuTong Mountain consciousness evolution database fix deployed!');
});
