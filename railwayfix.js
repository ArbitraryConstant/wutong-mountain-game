const { Pool } = require('pg');
new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}).connect().then(async (client) => {
  console.log('🔥 Fixing database...');
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
  console.log('✅ FIXED! All consciousness stats added!');
  client.release();
  process.exit(0);
}).catch(console.error);
