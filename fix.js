const { Pool } = require('pg');

async function fixDatabase() {
    console.log('🔥 Starting database fix...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL');
        
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        console.log('✅ Table dropped');
        
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
        
        const testResult = await client.query(`
            INSERT INTO players (passphrase) VALUES ('test') 
            RETURNING insight, presence, resolve, vigor, harmony
        `);
        console.log('✅ TEST SUCCESS:', testResult.rows[0]);
        
        await client.query(`DELETE FROM players WHERE passphrase = 'test'`);
        client.release();
        await pool.end();
        
        console.log('🎉 DATABASE FIX COMPLETE!');
        
    } catch (error) {
        console.error('❌ Fix failed:', error);
    }
}

fixDatabase();
