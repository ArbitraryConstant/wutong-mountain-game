const { Pool } = require('pg');

async function fixDatabaseSchema() {
    console.log('🔧 EMERGENCY DATABASE SCHEMA FIX STARTING...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const client = await pool.connect();
        
        console.log('✅ Connected to database');
        
        // First, let's see what columns exist
        const columnsResult = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        `);
        
        console.log('📋 Current columns:', columnsResult.rows);
        
        // Drop and recreate the table with correct schema
        console.log('🔄 Dropping and recreating players table...');
        
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        
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
        
        console.log('✅ Players table recreated with ALL columns!');
        
        // Verify the new schema
        const newColumnsResult = await client.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        `);
        
        console.log('✅ NEW SCHEMA VERIFIED:');
        newColumnsResult.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
        });
        
        client.release();
        await pool.end();
        
        console.log('🎉 DATABASE SCHEMA FIX COMPLETE!');
        
    } catch (error) {
        console.error('❌ Schema fix failed:', error);
        process.exit(1);
    }
}

fixDatabaseSchema();
