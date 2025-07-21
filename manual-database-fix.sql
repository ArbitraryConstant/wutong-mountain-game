-- WuTong Mountain Database Schema Fix
-- Copy and paste these commands into the Railway PostgreSQL console

-- First, let's see what we have
\d players

-- Drop the existing table and recreate with correct schema
DROP TABLE IF EXISTS players CASCADE;

-- Create the complete table with ALL columns
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

-- Verify the new schema
\d players

-- Test insert to make sure it works
INSERT INTO players (passphrase) VALUES ('test-manual-fix') RETURNING *;

-- Clean up test data
DELETE FROM players WHERE passphrase = 'test-manual-fix';

-- Exit the database connection
\q
