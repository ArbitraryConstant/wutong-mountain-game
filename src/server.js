// src/server.js
import express from 'express';
import cors from 'cors';
import prisma from './database/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WuTong Mountain Game Server is running',
    timestamp: new Date().toISOString()
  });
});

// Player Creation Route
app.post('/players', async (req, res) => {
  try {
    const { passphrase } = req.body;
    
    // Check if passphrase already exists
    const existingPlayer = await prisma.findPlayerByPassphrase(passphrase);
    if (existingPlayer) {
      return res.status(400).json({ 
        error: 'Passphrase already in use',
        message: 'Each consciousness journey requires a unique key'
      });
    }

    // Create new player progression
    const newPlayer = await prisma.createPlayerProgression({
      passphrase,
      currentReality: 'WUTONG',
      spiralPoints: 0,
      consciousnessLevel: 1
    });

    res.status(201).json({
      message: 'Consciousness evolution journey initiated',
      player: {
        id: newPlayer.id,
        passphrase: newPlayer.passphrase,
        currentReality: newPlayer.currentReality,
        spiralPoints: newPlayer.spiralPoints,
        consciousnessLevel: newPlayer.consciousnessLevel
      }
    });
  } catch (error) {
    console.error('Player creation error:', error);
    res.status(500).json({ 
      error: 'Consciousness transfer disrupted', 
      message: 'The membrane between realities is unstable' 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`?? WuTong Mountain Game Server running on port ${PORT}`);
  console.log(`?? Consciousness evolution is now possible...`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed.');
  process.exit(0);
});
