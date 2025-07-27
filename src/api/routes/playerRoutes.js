import express from 'express';
import PassphraseGenerator from '../../utils/passphraseGenerator.js';
import prisma from '../../database/prisma.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        // Generate player identification
        const playerIdentification = PassphraseGenerator.generatePlayerIdentification();

        // Create player in the database
        const newPlayer = await prisma.playerProgression.create({
            data: {
                id: playerIdentification.id,
                passphrase: playerIdentification.passphrase,
                currentReality: playerIdentification.metadata.reality || 'WUTONG',
                spiralPoints: 0,
                consciousnessLevel: 1,
                lastActive: new Date()
            }
        });

        // Respond with player details
        res.status(201).json({
            message: 'Player created successfully',
            player: {
                id: newPlayer.id,
                passphrase: newPlayer.passphrase,
                currentReality: newPlayer.currentReality
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

export default router;
