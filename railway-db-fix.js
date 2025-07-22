// Railway Shell Database Fix Script
const { Pool } = require('pg');

async function fixDatabase() {
    console.log('🔥 Starting database fix in Railway shell...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to Railway PostgreSQL');
        
        // Check current table
        console.log('📋 Checking current table structure...');
        try {
            const currentColumns = await client.query(
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                ORDER BY ordinal_position;
            );
            console.log('Current columns:', currentColumns.rows.map(r => r.column_name));
        } catch (err) {
            console.log('⚠️ Table check error:', err.message);
        }
        
        // Drop existing table
        console.log('🔥 Dropping existing players table...');
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        console.log('✅ Table dropped');
        
        // Create new table with ALL consciousness stats
        console.log('🏗️ Creating new table with consciousness stats...');
        await client.query(
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
        );
        console.log('✅ NEW TABLE CREATED with ALL consciousness stats!');
        
        // Verify new schema
        const newColumns = await client.query(
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        );
        
        console.log('🔍 NEW SCHEMA VERIFICATION:');
        newColumns.rows.forEach(row => {
            const isConsciousnessStat = ['insight', 'presence', 'resolve', 'vigor', 'harmony'].includes(row.column_name);
            const marker = isConsciousnessStat ? '🧠' : '📋';
            console.log(  \ \: \ (default: \));
        });
        
        // Test insert
        console.log('🧪 Testing with sample insert...');
        const testResult = await client.query(
            INSERT INTO players (passphrase) 
            VALUES ('test-railway-shell-fix') 
            RETURNING id, insight, presence, resolve, vigor, harmony, sessions_count
        );
        
        console.log('✅ TEST INSERT SUCCESSFUL:');
        const testPlayer = testResult.rows[0];
        console.log('  Player ID:', testPlayer.id);
        console.log('  🧠 Insight:', testPlayer.insight);
        console.log('  🧠 Presence:', testPlayer.presence);
        console.log('  🧠 Resolve:', testPlayer.resolve);
        console.log('  🧠 Vigor:', testPlayer.vigor);
        console.log('  🧠 Harmony:', testPlayer.harmony);
        console.log('  📈 Sessions:', testPlayer.sessions_count);
        
        // Clean up test
        await client.query(DELETE FROM players WHERE passphrase = 'test-railway-shell-fix');
        console.log('✅ Test data cleaned up');
        
        client.release();
        await pool.end();
        
        console.log('🎉 DATABASE FIX COMPLETE!');
        console.log('🏔️ WuTong Mountain consciousness evolution system ready!');
        
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        process.exit(1);
    }
}

fixDatabase();
