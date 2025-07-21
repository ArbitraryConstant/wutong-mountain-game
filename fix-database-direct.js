// Direct Database Fix Script for WuTong Mountain
const { Pool } = require('pg');

async function fixDatabase() {
    console.log('🔧 STARTING DATABASE FIX...');
    
    // Get the DATABASE_URL from Railway environment
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found in environment');
        process.exit(1);
    }
    
    console.log('✅ Found DATABASE_URL');
    
    const pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to Railway PostgreSQL');
        
        // First, let's see what columns currently exist
        console.log('\n📋 Checking current table structure...');
        try {
            const currentColumns = await client.query(`
                SELECT column_name, data_type, column_default 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                ORDER BY ordinal_position;
            `);
            
            console.log('Current columns:');
            currentColumns.rows.forEach(row => {
                console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
            });
        } catch (err) {
            console.log('⚠️ Table may not exist yet:', err.message);
        }
        
        // Drop and recreate the table with correct schema
        console.log('\n🔄 Dropping existing table...');
        await client.query('DROP TABLE IF EXISTS players CASCADE');
        console.log('✅ Table dropped');
        
        // Create the complete table with ALL required columns
        console.log('\n🏗️ Creating new table with complete schema...');
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
        console.log('✅ New table created with ALL consciousness stats!');
        
        // Verify the new schema
        console.log('\n🔍 Verifying new table structure...');
        const newColumns = await client.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        `);
        
        console.log('\n✅ NEW TABLE SCHEMA VERIFIED:');
        newColumns.rows.forEach(row => {
            const isConsciousnessStat = ['insight', 'presence', 'resolve', 'vigor', 'harmony'].includes(row.column_name);
            const marker = isConsciousnessStat ? '🧠' : '📋';
            console.log(`  ${marker} ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
        });
        
        // Test insert to make sure everything works
        console.log('\n🧪 Testing table with sample insert...');
        const testResult = await client.query(`
            INSERT INTO players (passphrase) 
            VALUES ('test-database-fix') 
            RETURNING id, passphrase, insight, presence, resolve, vigor, harmony, sessions_count
        `);
        
        console.log('✅ TEST INSERT SUCCESSFUL:');
        console.log('  Player ID:', testResult.rows[0].id);
        console.log('  Passphrase:', testResult.rows[0].passphrase);
        console.log('  Insight:', testResult.rows[0].insight);
        console.log('  Presence:', testResult.rows[0].presence);
        console.log('  Resolve:', testResult.rows[0].resolve);
        console.log('  Vigor:', testResult.rows[0].vigor);
        console.log('  Harmony:', testResult.rows[0].harmony);
        console.log('  Sessions:', testResult.rows[0].sessions_count);
        
        // Clean up test data
        await client.query(`DELETE FROM players WHERE passphrase = 'test-database-fix'`);
        console.log('✅ Test data cleaned up');
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 DATABASE SCHEMA FIX COMPLETE!');
        console.log('🏔️ WuTong Mountain consciousness evolution system is ready!');
        
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        process.exit(1);
    }
}

// Run the fix
fixDatabase().catch(console.error);
