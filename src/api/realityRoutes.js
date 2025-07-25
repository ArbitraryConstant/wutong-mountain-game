// src/api/routes/realityRoutes.js
import express from 'express';

const router = express.Router();

/**
 * Switch player's current reality
 * @route POST /api/reality/switch
 */
router.post('/switch', async (req, res) => {
    try {
        const { passphrase, target_reality } = req.body;

        // Validate input
        if (!passphrase || !target_reality || 
            !['wutong', 'wokemound'].includes(target_reality)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid passphrase or reality'
            });
        }

        res.json({
            success: true,
            new_reality: target_reality,
            message: Consciousness transferred to ,
            player: {
                current_reality: target_reality,
                current_location: 'arrival-point'
            }
        });

    } catch (error) {
        console.error('Reality switch error:', error);
        res.status(500).json({
            success: false,
            error: 'Reality transition temporarily unavailable'
        });
    }
});

/**
 * Get available realities
 * @route GET /api/reality/list
 */
router.get('/list', (req, res) => {
    res.json({
        success: true,
        realities: [
            {
                id: 'wutong',
                name: 'WuTong Mountain',
                description: 'A utopian realm of consciousness evolution in 2100',
                accessibility_level: 'open',
                recommended_consciousness_level: 3
            },
            {
                id: 'wokemound',
                name: 'WokeMound',
                description: 'A dystopian landscape of technological oppression',
                accessibility_level: 'challenging',
                recommended_consciousness_level: 5
            }
        ]
    });
});

export default router;
