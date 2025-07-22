const { Pool } = require('pg');
const express = require('express');
const app = express();

console.log('🔥 EMERGENCY DATABASE FIX STARTING...');

// Fix database immediately on startup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect().then(async (client) => {
    console.log('✅ EMERGENCY FIX: Connected to database');
    
    // Drop table completely
    await client.query('DROP TABLE IF EXISTS players CASCADE');
    console.log('✅ EMERGENCY FIX: Table dropped');
    
    // Create with ALL columns
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
    console.log('✅ EMERGENCY FIX: ALL consciousness stats added!');
    
    client.release();
}).catch(console.error);

app.use(express.json());
app.post('/api/player/new', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO players (passphrase) VALUES ($1) RETURNING *', [req.body.passphrase || 'test']);
    client.release();
    res.json({ success: true, player: result.rows[0] });
});

app.listen(process.env.PORT || 3000, () => console.log('🔧 Emergency fix server running'));
