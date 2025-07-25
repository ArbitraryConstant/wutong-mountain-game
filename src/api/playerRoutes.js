// src/api/routes/playerRoutes.js
import express from 'express';
import { getDbPool } from '../../database/connections.js';
import { 
    generateUniquePassphrase, 
    validatePassphrase,
    generatePlayerIdentification 
} from '../../utils/passphraseGenerator.js';
import Logger from '../../utils/logger.js';

const router = express.Router();

/**
 * Create a new player
 * @route POST /api/player/new
 */
router.post('/new', async (req, res) => {
    try {
        const passphrase = generateUniquePassphrase();
        
        // Generate player identification
        const playerIdentification = generatePlayerIdentification(passphrase);

        // Default player initial state
        const player = {
            passphrase: passphrase,
            insight: 35,
            presence: 35,
            resolve: 35,
            vigor: 35,
            harmony: 35,
            spiral_points: 0,
            consciousness_level: 0,
            current_reality: 'wutong',
            current_location: 'arrival-point'
        };

        // Log player creation event
        Logger.gameEvent('player_created', {
            passphrase: playerIdentification.identificationHash,
            reality: player.current_reality
        });

        res.json({
            success: true,
            passphrase: passphrase,
            player: player,
            identification: playerIdentification,
            message: 'Welcome to your consciousness evolution journey!'
        });

    } catch (error) {
        // Log error
        Logger.error('Player creation failed', { error: error.message });

        res.status(500).json({
            success: false,
            error: 'Failed to create consciousness journey'
        });
    }
});

/**
 * Load existing player by passphrase
 * @route GET /api/player/:passphrase
 */
router.get('/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;

        // Validate passphrase format
        if (!validatePassphrase(passphrase)) {
            Logger.warn('Invalid passphrase format', { passphrase });
            return res.status(400).json({
                success: false,
                error: 'Invalid passphrase format'
            });
        }

        // Create demo player 
        const player = {
            passphrase: passphrase,
            insight: 35,
            presence: 35,
            resolve: 35,
            vigor: 35,
            harmony: 35,
            spiral_points: 0,
            consciousness_level: 0,
            current_reality: 'wutong',
            current_location: 'arrival-point'
        };

        // Log player retrieval
        Logger.gameEvent('player_retrieved', {
            passphrase: passphrase,
            reality: player.current_reality
        });

        res.json({
            success: true,
            player: player
        });

    } catch (error) {
        // Log error
        Logger.error('Player retrieval failed', { error: error.message });

        res.status(500).json({
            success: false,
            error: 'Failed to load consciousness journey'
        });
    }
});

export default router;
