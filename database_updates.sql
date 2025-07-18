﻿-- WuTong Mountain Database Schema Updates for Claude Integration
-- Run this in your Railway PostgreSQL database

-- Community choices table
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

-- Dream sharing sessions table
CREATE TABLE IF NOT EXISTS dream_sharing_sessions (
    id SERIAL PRIMARY KEY,
    helper_passphrase VARCHAR(100) NOT NULL,
    dreamer_id VARCHAR(100) NOT NULL,
    session_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE
);

-- Story generations log (for debugging/analytics)
CREATE TABLE IF NOT EXISTS story_generations (
    id SERIAL PRIMARY KEY,
    passphrase VARCHAR(100) NOT NULL,
    reality VARCHAR(20) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_choices_creator ON community_choices(creator_passphrase);
CREATE INDEX IF NOT EXISTS idx_dream_sharing_helper ON dream_sharing_sessions(helper_passphrase);
CREATE INDEX IF NOT EXISTS idx_story_generations_passphrase ON story_generations(passphrase);
