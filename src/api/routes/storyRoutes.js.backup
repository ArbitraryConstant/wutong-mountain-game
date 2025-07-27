// src/api/routes/storyRoutes.js
import express from 'express';

const router = express.Router();

/**
 * Generate story content
 * @route POST /api/story/generate
 */
router.post('/generate', async (req, res) => {
    try {
        const { passphrase, reality } = req.body;

        if (!passphrase || !reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and reality are required'
            });
        }

        // Placeholder story generation
        const storyData = reality === 'wutong' 
            ? {
                location: "The Healing Gardens",
                context: "A serene space where consciousness workers practice restoration",
                text: "You find yourself in the Healing Gardens, where crystalline fountains pulse with accumulated wisdom. A fellow consciousness worker approaches, carrying the weight of memories from helping someone process technological integration trauma.",
                choices: [
                    {
                        text: "Offer to share your healing techniques",
                        mechanics: "PRESENCE + HARMONY",
                        type: "service"
                    },
                    {
                        text: "Listen deeply to understand their approach",
                        mechanics: "INSIGHT + PRESENCE",
                        type: "learning"
                    }
                ]
            }
            : {
                location: "Corporate Wellness Center",
                context: "A sterile facility with hidden resistance networks",
                text: "You enter the Corporate Wellness Center where 'voluntary' neural optimization sessions occur. The walls hum with efficiency algorithms while employees move with unnaturally synchronized steps.",
                choices: [
                    {
                        text: "Observe the synchronized employees",
                        mechanics: "INSIGHT + PRESENCE",
                        type: "investigation"
                    },
                    {
                        text: "Look for signs of resistance",
                        mechanics: "RESOLVE + INSIGHT",
                        type: "exploration"
                    }
                ]
            };

        res.json({
            success: true,
            story: storyData,
            claude_ai_used: false // Placeholder
        });

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Story generation temporarily unavailable'
        });
    }
});

/**
 * Process player choice
 * @route POST /api/story/choice
 */
router.post('/choice', async (req, res) => {
    try {
        const { passphrase, choice } = req.body;

        if (!passphrase || !choice) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and choice are required'
            });
        }

        // Simulate choice processing
        const statsChanged = {
            insight: Math.floor(Math.random() * 5) + 1,
            presence: Math.floor(Math.random() * 5) + 1
        };

        const spiralPoints = Math.floor(Math.random() * 15) + 5;

        res.json({
            success: true,
            result: {
                statsChanged,
                spiralPoints,
                outcome: Your choice to "" creates subtle shifts in your consciousness.
            }
        });

    } catch (error) {
        console.error('Choice processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Choice processing temporarily unavailable'
        });
    }
});

export default router;
