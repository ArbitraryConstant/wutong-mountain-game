const { Pool } = require('pg');

async function updateSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    console.log('🔧 Updating database schema...');

    try {
        // Add missing columns if they don't exist
        await pool.query(`
            ALTER TABLE players 
            ADD COLUMN IF NOT EXISTS current_reality VARCHAR(20) DEFAULT 'wutong',
            ADD COLUMN IF NOT EXISTS current_location VARCHAR(100) DEFAULT 'arrival-point',
            ADD COLUMN IF NOT EXISTS consciousness_level INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS spiral_points INTEGER DEFAULT 0;
        `);

        console.log('✅ Schema updated successfully!');

        // Show current table structure
        const structure = await pool.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            ORDER BY ordinal_position;
        `);

        console.log('📋 Current table structure:');
        structure.rows.forEach(row => {
            console.log(`  ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
        });

    } catch (error) {
        console.error('❌ Schema update failed:', error);
    } finally {
        await pool.end();
    }
}

updateSchema();
