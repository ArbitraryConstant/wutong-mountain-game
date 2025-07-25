// src/database/migrations/initialMigration.js
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pkg;

/**
 * Database Migration Utility for WuTong Mountain Game
 */
class DatabaseMigration {
    /**
     * Create a database connection pool
     * @returns {Pool} PostgreSQL connection pool
     */
    static createConnectionPool() {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' 
                ? { rejectUnauthorized: false } 
                : false
        });
    }

    /**
     * Create initial game tables
     */
    static async createTables() {
        const pool = this.createConnectionPool();
        
        try {
            const client = await pool.connect();

            try {
                // Begin transaction
                await client.query('BEGIN');

                // Players table
                await client.query(
                    CREATE TABLE IF NOT EXISTS players (
                        id SERIAL PRIMARY KEY,
                        passphrase VARCHAR(100) UNIQUE NOT NULL,
                        
                        insight INTEGER DEFAULT 35 CHECK (insight BETWEEN 0 AND 100),
                        presence INTEGER DEFAULT 35 CHECK (presence BETWEEN 0 AND 100),
                        resolve INTEGER DEFAULT 35 CHECK (resolve BETWEEN 0 AND 100),
                        vigor INTEGER DEFAULT 35 CHECK (vigor BETWEEN 0 AND 100),
                        harmony INTEGER DEFAULT 35 CHECK (harmony BETWEEN 0 AND 100),
                        
                        spiral_points INTEGER DEFAULT 0,
                        consciousness_level INTEGER DEFAULT 0,
                        
                        current_reality VARCHAR(20) DEFAULT 'wutong',
                        current_location VARCHAR(100) DEFAULT 'arrival-point',
                        
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        
                        total_choices_made INTEGER DEFAULT 0,
                        reality_switches INTEGER DEFAULT 0
                    )
                );

                // Player Choices History Table
                await client.query(
                    CREATE TABLE IF NOT EXISTS player_choices (
                        id SERIAL PRIMARY KEY,
                        player_passphrase VARCHAR(100) NOT NULL,
                        reality VARCHAR(20) NOT NULL,
                        choice_text TEXT NOT NULL,
                        choice_type VARCHAR(50),
                        impact_level VARCHAR(20),
                        spiral_points_gained INTEGER DEFAULT 0,
                        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        
                        FOREIGN KEY (player_passphrase) REFERENCES players(passphrase)
                    )
                );

                // Consciousness Milestones Table
                await client.query(
                    CREATE TABLE IF NOT EXISTS consciousness_milestones (
                        id SERIAL PRIMARY KEY,
                        player_passphrase VARCHAR(100) NOT NULL,
                        level INTEGER NOT NULL,
                        achievement_description TEXT,
                        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        
                        FOREIGN KEY (player_passphrase) REFERENCES players(passphrase)
                    )
                );

                // Commit transaction
                await client.query('COMMIT');
                console.log('✅ Database tables created successfully');
            } catch (error) {
                // Rollback transaction on error
                await client.query('ROLLBACK');
                console.error('❌ Error creating database tables:', error);
                throw error;
            } finally {
                // Release the client back to the pool
                client.release();
            }
        } catch (poolError) {
            console.error('❌ Database connection error:', poolError);
            throw poolError;
        } finally {
            // Close the pool
            await pool.end();
        }
    }

    /**
     * Seed initial data
     */
    static async seedInitialData() {
        const pool = this.createConnectionPool();
        
        try {
            const client = await pool.connect();

            try {
                // Begin transaction
                await client.query('BEGIN');

                // Seed consciousness level descriptions
                await client.query(
                    INSERT INTO consciousness_milestones 
                    (player_passphrase, level, achievement_description)
                    VALUES 
                    ('system', 1, 'Initial awakening - recognizing the journey begins'),
                    ('system', 2, 'First steps of questioning existing narratives'),
                    ('system', 3, 'Emerging understanding of interconnectedness'),
                    ('system', 4, 'Breaking through personal limitations'),
                    ('system', 5, 'Holistic integration of personal and collective growth'),
                    ('system', 6, 'Transcending individual perspective'),
                    ('system', 7, 'Unified consciousness - profound interconnectedness')
                    ON CONFLICT DO NOTHING
                );

                // Commit transaction
                await client.query('COMMIT');
                console.log('✅ Initial data seeded successfully');
            } catch (error) {
                // Rollback transaction on error
                await client.query('ROLLBACK');
                console.error('❌ Error seeding initial data:', error);
                throw error;
            } finally {
                // Release the client back to the pool
                client.release();
            }
        } catch (poolError) {
            console.error('❌ Database connection error:', poolError);
            throw poolError;
        } finally {
            // Close the pool
            await pool.end();
        }
    }

    /**
     * Run all migrations
     */
    static async runMigrations() {
        try {
            console.log('🚀 Starting database migrations...');
            
            await this.createTables();
            await this.seedInitialData();
            
            console.log('✨ All migrations completed successfully');
        } catch (error) {
            console.error('❌ Migration process failed:', error);
            process.exit(1);
        }
    }
}

// Allow direct execution for manual migrations
if (import.meta.url === ile://) {
    DatabaseMigration.runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

export default DatabaseMigration;
