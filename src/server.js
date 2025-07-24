// WuTong Mountain Enhanced Server with Claude AI Integration (CommonJS version)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// [Rest of the existing middleware and setup remains the same]

// Unique Passphrase Generation Function
const generateUniquePassphrase = async (dbPool) => {
    const adjectives = ['silver', 'golden', 'quiet', 'wise', 'gentle', 'radiant', 'peaceful', 'mystic'];
    const nouns = ['moon', 'star', 'river', 'mountain', 'light', 'wind', 'harmony', 'crystal'];

    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const timestamp = Date.now();
        const passphrase = `${randomAdjective}-${randomNoun}-${timestamp}`;

        // Check uniqueness in the database if available
        if (dbPool) {
            try {
                const result = await dbPool.query('SELECT 1 FROM players WHERE passphrase = $1', [passphrase]);
                if (result.rows.length === 0) {
                    return passphrase;
                }
            } catch (error) {
                console.error('Error checking passphrase uniqueness:', error);
                // If database check fails, return the generated passphrase
                return passphrase;
            }
        } else {
            // If no database, return the generated passphrase
            return passphrase;
        }

        attempts++;
    }

    // Fallback: generate a completely random passphrase if unique generation fails
    return `player-${Math.random().toString(36).substring(2, 15)}`;
};

// Modify the '/api/player/new' route
app.post('/api/player/new', async (req, res) => {
    try {
        // Generate a unique passphrase
        const passphrase = await generateUniquePassphrase(dbPool);

        let player = {
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

        // Save to database if available
        if (dbPool) {
            try {
                const result = await dbPool.query(`
                    INSERT INTO players (
                        passphrase, insight, presence, resolve, 
                        vigor, harmony, spiral_points, 
                        consciousness_level, current_reality, current_location
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (passphrase) DO NOTHING
                    RETURNING *
                `, [
                    player.passphrase, player.insight, player.presence, 
                    player.resolve, player.vigor, player.harmony, 
                    player.spiral_points, player.consciousness_level, 
                    player.current_reality, player.current_location
                ]);

                if (result.rows.length > 0) {
                    player = result.rows[0];
                }
            } catch (dbError) {
                console.error('Database save failed:', dbError.message);
                // Continue with in-memory player if database save fails
            }
        }

        res.json({
            success: true,
            passphrase: passphrase,
            player: player,
            message: 'Welcome to your consciousness evolution journey!'
        });

    } catch (error) {
        console.error('Player creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create consciousness journey'
        });
    }
});

// [Rest of the code remains the same as in the original file]

// Load existing player
app.get('/api/player/:passphrase', async (req, res) => {
    try {
        const { passphrase } = req.params;
        let player = null;

        // Try to load from database
        if (dbPool) {
            try {
                const result = await dbPool.query('SELECT * FROM players WHERE passphrase = $1', [passphrase]);
                player = result.rows[0];
            } catch (dbError) {
                console.log('Database query error:', dbError.message);
            }
        }

        // Create demo player if not found
        if (!player) {
            player = {
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
        }

        // Format stats for frontend
        player.stats = {
            insight: player.insight,
            presence: player.presence,
            resolve: player.resolve,
            vigor: player.vigor,
            harmony: player.harmony
        };

        res.json({
            success: true,
            player: player
        });

    } catch (error) {
        console.error('Player load error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load consciousness journey'
        });
    }
});

// Generate story content with Claude AI
app.post('/api/story/generate', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, reality, previous_choice } = req.body;

        if (!passphrase || !reality) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and reality required'
            });
        }

        // Get player data
        let player = null;
        if (dbPool) {
            try {
                const result = await dbPool.query('SELECT * FROM players WHERE passphrase = $1', [passphrase]);
                player = result.rows[0];
            } catch (dbError) {
                console.log('Database query error:', dbError.message);
            }
        }

        // Claude AI story generation
        const prompt = `Generate content for "Escape from WuTong Mountain" - a consciousness evolution game.

GAME STATE:
Reality: ${reality === 'wutong' ? 'WuTong Mountain (Utopian 2100)' : 'WokeMound (Dystopian Horror)'}
Player Level: ${player ? calculateConsciousnessLevel(player.spiral_points) : 0}

CONSCIOUSNESS PRINCIPLES:
1. Growth through service to others
2. ${reality === 'wokemound' ? 'Horror balanced with hope' : 'Healing through community'}
3. Choices advance spiritual development

Generate a story segment (200-250 words) with current situation and 3-4 choices.

Format as JSON:
{
  "location": "scene name",
  "context": "setting description", 
  "text": "story narrative",
  "choices": [
    {
      "text": "choice description",
      "mechanics": "INSIGHT + PRESENCE",
      "type": "service"
    }
  ]
}`;

        let storyResponse = null;
        if (process.env.CLAUDE_API_KEY) {
            storyResponse = await callClaudeAPI(prompt);
        }

        let storyData;
        if (storyResponse) {
            try {
                const cleaned = storyResponse.replace(/```json\n?|\n?```/g, '').trim();
                storyData = JSON.parse(cleaned);
            } catch (parseError) {
                console.log('Claude response parse failed, using fallback');
                storyData = null;
            }
        }

        // Fallback stories if Claude is unavailable
        if (!storyData) {
            if (reality === 'wutong') {
                storyData = {
                    location: "The Healing Gardens",
                    context: "A serene space where consciousness workers practice restoration",
                    text: "You find yourself in the Healing Gardens, where crystalline fountains pulse with accumulated wisdom from countless healing sessions. A fellow consciousness worker approaches, carrying the weight of memories from helping someone process forced technological integration trauma. Their eyes show both exhaustion and profound purpose. The community's approach creates opportunities for mutual healing and growth through service.",
                    choices: [
                        {
                            text: "Offer to share your own healing techniques and experiences",
                            mechanics: "PRESENCE + HARMONY",
                            type: "service"
                        },
                        {
                            text: "Invite them to co-facilitate a group healing session",
                            mechanics: "HARMONY + RESOLVE",
                            type: "leadership"
                        },
                        {
                            text: "Listen deeply to understand their specific healing approach",
                            mechanics: "INSIGHT + PRESENCE",
                            type: "learning"
                        },
                        {
                            text: "Suggest visiting WokeMound together to understand the source trauma",
                            mechanics: "RESOLVE + COURAGE",
                            type: "challenge"
                        }
                    ]
                };
            } else {
                storyData = {
                    location: "The Corporate Wellness Center",
                    context: "Mandatory optimization facility with hidden resistance networks",
                    text: "You enter the sterile Corporate Wellness Center where 'voluntary' neural optimization sessions occur. The walls hum with efficiency algorithms while employees move with unnaturally synchronized steps. A janitor's cart sits abandoned by a maintenance closet - but you notice the janitor's eyes are clear, not the glazed look of the optimized. They're running cleaning schedules that seem designed to avoid certain areas at specific times.",
                    choices: [
                        {
                            text: "Approach the janitor and carefully offer your help",
                            mechanics: "PRESENCE + RESOLVE",
                            type: "resistance"
                        },
                        {
                            text: "Observe the synchronized employees to understand the optimization pattern",
                            mechanics: "INSIGHT + PRESENCE",
                            type: "investigation"
                        },
                        {
                            text: "Pretend to be interested in optimization to gather intelligence",
                            mechanics: "RESOLVE + INSIGHT",
                            type: "infiltration"
                        },
                        {
                            text: "Follow the janitor's cleaning pattern to find the resistance meeting point",
                            mechanics: "INSIGHT + VIGOR",
                            type: "exploration"
                        }
                    ]
                };
            }
        }

        res.json({
            success: true,
            story: storyData,
            claude_ai_used: !!storyResponse
        });

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Story generation temporarily unavailable'
        });
    }
});

// Process choice with Claude AI
app.post('/api/choice/process', claudeLimiter, async (req, res) => {
    try {
        const { passphrase, choice } = req.body;

        if (!passphrase || !choice) {
            return res.status(400).json({
                success: false,
                error: 'Passphrase and choice required'
            });
        }

        // Calculate stat changes
        const statsChanged = {};
        const baseGain = Math.floor(Math.random() * 8) + 5; // 5-12 points

        if (choice.mechanics && choice.mechanics.includes('INSIGHT')) statsChanged.insight = baseGain;
        if (choice.mechanics && choice.mechanics.includes('PRESENCE')) statsChanged.presence = baseGain;
        if (choice.mechanics && choice.mechanics.includes('RESOLVE')) statsChanged.resolve = baseGain;
        if (choice.mechanics && choice.mechanics.includes('VIGOR')) statsChanged.vigor = baseGain;
        if (choice.mechanics && choice.mechanics.includes('HARMONY')) statsChanged.harmony = baseGain;

        // Calculate spiral points based on choice type
        let spiralPoints = 10; // base
        if (choice.type === 'service') spiralPoints = Math.floor(Math.random() * 25) + 20;
        else if (choice.type === 'leadership') spiralPoints = Math.floor(Math.random() * 20) + 15;
        else if (choice.type === 'community') spiralPoints = Math.floor(Math.random() * 20) + 15;
        else spiralPoints = Math.floor(Math.random() * 15) + 8;

        // Update player in database
        if (dbPool) {
            try {
                await dbPool.query(`
                    UPDATE players 
                    SET insight = LEAST(insight + $2, 100),
                        presence = LEAST(presence + $3, 100),
                        resolve = LEAST(resolve + $4, 100),
                        vigor = LEAST(vigor + $5, 100),
                        harmony = LEAST(harmony + $6, 100),
                        spiral_points = spiral_points + $7,
                        consciousness_level = $8,
                        last_active = NOW()
                    WHERE passphrase = $1
                `, [
                    passphrase,
                    statsChanged.insight || 0,
                    statsChanged.presence || 0,
                    statsChanged.resolve || 0,
                    statsChanged.vigor || 0,
                    statsChanged.harmony || 0,
                    spiralPoints,
                    calculateConsciousnessLevel(spiralPoints)
                ]);
            } catch (dbError) {
                console.log('Database update failed:', dbError.message);
            }
        }

        res.json({
            success: true,
            result: {
                statsChanged: statsChanged,
                spiralPoints: spiralPoints,
                outcome: `Your choice to "${choice.text}" creates positive ripples through the consciousness field, generating opportunities for growth and service that extend beyond what you can immediately see.`
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

// Switch reality
app.post('/api/reality/switch', async (req, res) => {
    try {
        const { passphrase, target_reality } = req.body;

        if (dbPool) {
            try {
                await dbPool.query(
                    'UPDATE players SET current_reality = $1, last_active = NOW() WHERE passphrase = $2',
                    [target_reality, passphrase]
                );
            } catch (dbError) {
                console.log('Reality update failed:', dbError.message);
            }
        }

        res.json({
            success: true,
            new_reality: target_reality,
            message: `Consciousness transferred to ${target_reality === 'wutong' ? 'WuTong Mountain' : 'WokeMound'}`
        });

    } catch (error) {
        console.error('Reality switch error:', error);
        res.status(500).json({
            success: false,
            error: 'Reality transition temporarily unavailable'
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
async function startServer() {
    await initializeDatabases();

    app.listen(PORT, () => {
        console.log(`
🏔️ WuTong Mountain Consciousness Evolution Server

🌟 Server: http://localhost:${PORT}
🌟 Health: http://localhost:${PORT}/health
🌟 Environment: ${process.env.NODE_ENV || 'development'}
🤖 Claude AI: ${process.env.CLAUDE_API_KEY ? 'Enabled ✅' : 'Disabled (using fallback stories)'}
💾 Database: ${process.env.DATABASE_URL ? 'Connected ✅' : 'Demo mode'}

✨ Ready for consciousness evolution! ✨
        `);
    });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🏔️ WuTong Mountain server shutting down gracefully...');
    if (dbPool) await dbPool.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});

startServer().catch(console.error);