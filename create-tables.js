const { Pool } = require('pg');

async function createTables() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    console.log('🗄️ Creating database tables...');
    
    try {
        await pool.query(`
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
        `);
        
        console.log('✅ Players table created successfully!');
        
        // Test the table
        const testResult = await pool.query('SELECT COUNT(*) FROM players');
        console.log(`📊 Current players in database: ${testResult.rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Database table creation failed:', error);
    } finally {
        await pool.end();
    }
}

createTables();
