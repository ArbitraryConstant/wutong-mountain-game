-- WuTong Mountain Database Schema Fix - Manual SQL
-- Run these commands in Railway PostgreSQL

-- Check current table structure
\d players

-- Drop the broken table completely
DROP TABLE IF EXISTS players CASCADE;

-- Create the complete table with ALL consciousness stats
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
);

-- Verify the new table structure
\d players

-- Test insert to make sure it works
INSERT INTO players (passphrase) VALUES ('test-manual-fix') RETURNING *;

-- Clean up test data
DELETE FROM players WHERE passphrase = 'test-manual-fix';

-- Exit
\q
