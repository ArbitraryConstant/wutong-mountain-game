const { Pool } = require('pg');

async function initDatabase() {
    console.log('🗄️ Initializing WuTong Mountain database...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const schema = `
        -- WuTong Mountain Database Schema
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
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT NOW(),
            last_active TIMESTAMP DEFAULT NOW(),
            sessions_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS community_choices (
            id SERIAL PRIMARY KEY,
            creator_passphrase VARCHAR(100) NOT NULL,
            original_text TEXT NOT NULL,
            processed_text TEXT NOT NULL,
            quality_rating INTEGER DEFAULT 3,
            spiral_points_bonus INTEGER DEFAULT 5,
            consciousness_alignment TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            used_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS dream_sharing_sessions (
            id SERIAL PRIMARY KEY,
            helper_passphrase VARCHAR(100) NOT NULL,
            dreamer_id VARCHAR(100) NOT NULL,
            session_data JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            completed BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS story_generations (
            id SERIAL PRIMARY KEY,
            passphrase VARCHAR(100) NOT NULL,
            reality VARCHAR(20) NOT NULL,
            content_type VARCHAR(50) NOT NULL,
            success BOOLEAN NOT NULL,
            generated_at TIMESTAMP DEFAULT NOW()
        );

        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_players_passphrase ON players(passphrase);
        CREATE INDEX IF NOT EXISTS idx_community_choices_creator ON community_choices(creator_passphrase);
        CREATE INDEX IF NOT EXISTS idx_dream_sharing_helper ON dream_sharing_sessions(helper_passphrase);
        CREATE INDEX IF NOT EXISTS idx_story_generations_passphrase ON story_generations(passphrase);
    `;

    try {
        await pool.query(schema);
        console.log('✅ Database tables created successfully!');
        
        // Test by querying the tables
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('players', 'community_choices', 'dream_sharing_sessions', 'story_generations')
            ORDER BY table_name;
        `);
        
        console.log('📋 Created tables:', result.rows.map(row => row.table_name));
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

initDatabase().catch(console.error);
