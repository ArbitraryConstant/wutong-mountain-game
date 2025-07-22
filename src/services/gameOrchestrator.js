// WuTong Mountain Game Orchestrator with Claude AI Integration
// src/services/gameOrchestrator.js

import fetch from 'node-fetch';

class WuTongGameOrchestrator {
    constructor(dbPool, redisClient, claudeApiKey) {
        this.db = dbPool;
        this.redis = redisClient;
        this.claudeApiKey = claudeApiKey;
        this.claudeBaseURL = 'https://api.anthropic.com/v1/messages';
        
        // Consciousness evolution parameters
        this.consciousnessLevels = {
            1: { name: "Awakening", threshold: 0, description: "Beginning awareness" },
            2: { name: "Recognition", threshold: 50, description: "Seeing patterns" },
            3: { name: "Understanding", threshold: 150, description: "Grasping connections" },
            4: { name: "Integration", threshold: 300, description: "Embodying wisdom" },
            5: { name: "Service", threshold: 500, description: "Living for others" },
            6: { name: "Unity", threshold: 750, description: "Dissolving separation" },
            7: { name: "Transcendence", threshold: 1000, description: "Beyond individual" }
        };
        
        this.convergenceStages = {
            1: { name: "Separation", threshold: 0, description: "Realities feel separate" },
            2: { name: "Synchronicity", threshold: 100, description: "Noticing connections" },
            3: { name: "Bleeding", threshold: 250, description: "Boundaries weakening" },
            4: { name: "Unity", threshold: 500, description: "Realities merging" }
        };
    }

    // =============================================================================
    // CLAUDE API STORY GENERATION
    // =============================================================================

    async generateStoryContent(passphrase, reality, context = {}) {
        try {
            // Get player data and build context
            const playerData = await this.getPlayerData(passphrase);
            if (!playerData) {
                throw new Error('Player consciousness not found');
            }

            // Build comprehensive game context
            const gameContext = await this.buildGameContext(playerData, reality, context);
            
            // Generate story with Claude
            const storyResponse = await this.callClaudeAPI({
                messages: [{
                    role: "user",
                    content: this.buildStoryPrompt(gameContext)
                }],
                max_tokens: 1200,
                temperature: 0.7
            });

            const storyContent = this.parseStoryResponse(storyResponse);
            
            // Cache for performance
            if (this.redis) {
                await this.redis.setex(
                    `story:${passphrase}:${reality}:${Date.now()}`,
                    300, // 5 minutes
                    JSON.stringify(storyContent)
                );
            }

            return {
                success: true,
                story: storyContent,
                playerData: playerData,
                consciousness_level: this.calculateConsciousnessLevel(playerData.spiral_points),
                convergence_stage: this.calculateConvergenceStage(playerData.spiral_points)
            };

        } catch (error) {
            console.error('Story generation failed:', error);
            return {
                success: false,
                error: 'Story generation temporarily unavailable',
                fallback: this.getFallbackStory(reality)
            };
        }
    }

    // Build story prompt for Claude
    buildStoryPrompt(gameContext) {
        const { player, reality, location, recentActions, npcs, convergenceLevel } = gameContext;
        
        const consciousnessContext = this.getConsciousnessContext(player.spiral_points);
        const realityContext = this.getRealityContext(reality, convergenceLevel);
        
        return `You are generating content for "Escape from WuTong Mountain" - a consciousness evolution game where players unknowingly develop spiritual wisdom through choose-your-own-adventure experiences.

CURRENT GAME STATE:
Reality: ${reality === 'wutong' ? 'WuTong Mountain (Utopian 2100)' : 'WokeMound (Dystopian Horror)'}
Location: ${location}
Player Consciousness: ${consciousnessContext.name} (Level ${consciousnessContext.level})
Convergence Stage: ${gameContext.convergenceStage}/4

PLAYER STATS:
${Object.entries(player.stats || {}).map(([stat, value]) => `${stat.toUpperCase()}: ${value}/100`).join('\n')}
Spiral Points: ${player.spiral_points}

CONSCIOUSNESS EVOLUTION PRINCIPLES:
1. Growth happens through service to others, not individual achievement
2. ${reality === 'wokemound' ? 'Horror balanced with hope - show forced change trauma but provide paths to healing' : 'Focus on collaborative healing and community wisdom'}
3. Choices should advance consciousness development through empathy and understanding
4. Maintain philosophical depth within accessible storytelling
5. Every interaction potentially transforms both participants consciousness

GENERATE A STORY SEGMENT (200-250 words) with:
1. Vivid scene description that shows ${reality === 'wutong' ? 'utopian abundance and harmony' : 'dystopian horror with underlying humanity'}
2. Current situation involving NPCs needing player response
3. Emotional depth that develops player empathy
4. Subtle consciousness evolution themes

Then provide 3-4 CHOICE OPTIONS, each with:
- Text (descriptive and consciousness-evolving)
- Mechanics (which stats grow: INSIGHT/PRESENCE/RESOLVE/VIGOR/HARMONY)
- Consequence hints without spoiling outcomes
- Service opportunity (how it helps others)

Format as JSON:
{
  "scene": "story text here",
  "atmosphere": "emotional tone description",
  "choices": [
    {
      "text": "choice description",
      "mechanics": "INSIGHT + PRESENCE",
      "service_opportunity": "how this helps others",
      "consciousness_hint": "spiritual growth potential"
    }
  ],
  "npc_updates": [
    {
      "name": "NPC name",
      "new_emotional_state": "current feelings",
      "growth_opportunity": "how player can help them"
    }
  ]
}`;
    }

    // Parse Claude's story response
    parseStoryResponse(response) {
        try {
            // Clean response and parse JSON
            const cleanResponse = response.replace(/```json\n|\n```/g, '').trim();
            const parsed = JSON.parse(cleanResponse);
            
            return {
                scene: parsed.scene || "The path forward shimmers with possibility...",
                atmosphere: parsed.atmosphere || "contemplative",
                choices: parsed.choices || this.getDefaultChoices(),
                npc_updates: parsed.npc_updates || []
            };
        } catch (error) {
            console.error('Failed to parse Claude response:', error);
            return this.getFallbackStory();
        }
    }

    // =============================================================================
    // CHOICE PROCESSING WITH CONSCIOUSNESS EVOLUTION
    // =============================================================================

    async processChoice(passphrase, choice, context = {}) {
        try {
            const playerData = await this.getPlayerData(passphrase);
            if (!playerData) {
                throw new Error('Player consciousness not found');
            }

            // Process choice with Claude for narrative coherence
            const choiceResult = await this.callClaudeAPI({
                messages: [{
                    role: "user",
                    content: this.buildChoicePrompt(playerData, choice, context)
                }],
                max_tokens: 800,
                temperature: 0.6
            });

            const outcome = this.parseChoiceResponse(choiceResult);
            
            // Apply consciousness changes
            const statsChanged = this.calculateStatChanges(choice.mechanics, playerData);
            const spiralPoints = this.calculateSpiralPoints(choice, outcome.impact);
            
            // Update player in database
            const updatedPlayer = await this.updatePlayerProgress(
                passphrase, 
                statsChanged, 
                spiralPoints,
                choice.reality || context.reality
            );

            // Check for consciousness level advancement
            const newLevel = this.calculateConsciousnessLevel(updatedPlayer.spiral_points);
            const newConvergence = this.calculateConvergenceStage(updatedPlayer.spiral_points);
            
            return {
                success: true,
                outcome: outcome,
                stats_changed: statsChanged,
                spiral_points_gained: spiralPoints,
                new_consciousness_level: newLevel,
                new_convergence_stage: newConvergence,
                consciousness_insight: this.getConsciousnessInsight(newLevel, spiralPoints),
                player: updatedPlayer
            };

        } catch (error) {
            console.error('Choice processing failed:', error);
            return {
                success: false,
                error: 'Choice processing temporarily unavailable'
            };
        }
    }

    // Build choice processing prompt
    buildChoicePrompt(playerData, choice, context) {
        return `Process this player choice in the consciousness evolution game:

PLAYER CHOICE: "${choice.text}"
CHOICE MECHANICS: ${choice.mechanics}
SERVICE OPPORTUNITY: ${choice.service_opportunity}
CURRENT REALITY: ${context.reality}

PLAYER CONSCIOUSNESS STATE:
Level: ${this.calculateConsciousnessLevel(playerData.spiral_points)}
Current Stats: ${JSON.stringify(playerData.stats || {})}
Spiral Points: ${playerData.spiral_points}

Generate the OUTCOME of this choice (150 words) focusing on:
1. How the choice affects others (service impact)
2. What the player learns about themselves
3. How consciousness evolves through this action
4. Connection to broader themes of healing/growth

Format as JSON:
{
  "outcome": "narrative description of what happens",
  "consciousness_growth": "what wisdom player gains",
  "service_impact": "how this helped others",
  "impact": "minor/moderate/major/profound"
}`;
    }

    // =============================================================================
    // HELPER METHODS
    // =============================================================================

    calculateConsciousnessLevel(spiralPoints) {
        for (let level = 7; level >= 1; level--) {
            if (spiralPoints >= this.consciousnessLevels[level].threshold) {
                return level;
            }
        }
        return 1;
    }

    calculateConvergenceStage(spiralPoints) {
        for (let stage = 4; stage >= 1; stage--) {
            if (spiralPoints >= this.convergenceStages[stage].threshold) {
                return stage;
            }
        }
        return 1;
    }

    calculateStatChanges(mechanics, playerData) {
        const changes = {};
        const currentStats = playerData.stats || {
            insight: playerData.insight || 35,
            presence: playerData.presence || 35,
            resolve: playerData.resolve || 35,
            vigor: playerData.vigor || 35,
            harmony: playerData.harmony || 35
        };
        const baseGain = Math.floor(Math.random() * 5) + 3; // 3-7 points
        
        if (mechanics && mechanics.includes('INSIGHT')) changes.insight = Math.min(baseGain, 100 - currentStats.insight);
        if (mechanics && mechanics.includes('PRESENCE')) changes.presence = Math.min(baseGain, 100 - currentStats.presence);
        if (mechanics && mechanics.includes('RESOLVE')) changes.resolve = Math.min(baseGain, 100 - currentStats.resolve);
        if (mechanics && mechanics.includes('VIGOR')) changes.vigor = Math.min(baseGain, 100 - currentStats.vigor);
        if (mechanics && mechanics.includes('HARMONY')) changes.harmony = Math.min(baseGain, 100 - currentStats.harmony);
        
        return changes;
    }

    calculateSpiralPoints(choice, impact) {
        const basePoints = {
            'minor': 5,
            'moderate': 15,
            'major': 30,
            'profound': 50
        };
        
        return basePoints[impact] || 10;
    }

    // Core Claude API call
    async callClaudeAPI(requestData) {
        if (!this.claudeApiKey) {
            throw new Error('Claude API key not configured');
        }

        try {
            const response = await fetch(this.claudeBaseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.claudeApiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    ...requestData
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status}`);
            }

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API call failed:', error);
            throw error;
        }
    }

    // Database operations
    async getPlayerData(passphrase) {
        try {
            const result = await this.db.query(
                'SELECT * FROM players WHERE passphrase = $1', 
                [passphrase]
            );
            
            const player = result.rows[0];
            if (player) {
                // Format stats for consistency
                player.stats = {
                    insight: player.insight,
                    presence: player.presence,
                    resolve: player.resolve,
                    vigor: player.vigor,
                    harmony: player.harmony
                };
            }
            return player || null;
        } catch (error) {
            console.error('Database query failed:', error);
            return null;
        }
    }

    async updatePlayerProgress(passphrase, statsChanged, spiralPoints, reality) {
        try {
            const updateQuery = `
                UPDATE players 
                SET insight = LEAST(insight + $2, 100),
                    presence = LEAST(presence + $3, 100),
                    resolve = LEAST(resolve + $4, 100),
                    vigor = LEAST(vigor + $5, 100),
                    harmony = LEAST(harmony + $6, 100),
                    spiral_points = spiral_points + $7,
                    current_reality = $8,
                    last_active = NOW()
                WHERE passphrase = $1
                RETURNING *
            `;
            
            const result = await this.db.query(updateQuery, [
                passphrase,
                statsChanged.insight || 0,
                statsChanged.presence || 0,
                statsChanged.resolve || 0,
                statsChanged.vigor || 0,
                statsChanged.harmony || 0,
                spiralPoints,
                reality
            ]);

            const player = result.rows[0];
            if (player) {
                player.stats = {
                    insight: player.insight,
                    presence: player.presence,
                    resolve: player.resolve,
                    vigor: player.vigor,
                    harmony: player.harmony
                };
            }
            return player;
        } catch (error) {
            console.error('Player update failed:', error);
            throw error;
        }
    }

    // Build game context
    async buildGameContext(playerData, reality, context) {
        return {
            player: playerData,
            reality: reality,
            location: context.location || 'meditation-gardens',
            recentActions: context.recentActions || [],
            npcs: context.npcs || [],
            convergenceStage: this.calculateConvergenceStage(playerData.spiral_points)
        };
    }

    getConsciousnessContext(spiralPoints) {
        const level = this.calculateConsciousnessLevel(spiralPoints);
        return {
            level: level,
            name: this.consciousnessLevels[level].name,
            description: this.consciousnessLevels[level].description
        };
    }

    getRealityContext(reality, convergenceLevel) {
        if (reality === 'wutong') {
            return "WuTong Mountain represents the utopian potential of human consciousness - a world where technology serves wisdom, communities thrive in harmony, and individual growth supports collective evolution.";
        } else {
            return "WokeMound represents the dystopian shadow of forced change - a world where transformation is imposed rather than chosen, teaching the value of authentic growth through contrast.";
        }
    }

    getConsciousnessInsight(level, spiralPoints) {
        const insights = {
            1: "You begin to sense the interconnectedness of all experiences.",
            2: "Patterns emerge, revealing the deeper currents of consciousness.",
            3: "Understanding dawns - every choice ripples through the collective field.",
            4: "Wisdom integrates into your being, transforming how you see and act.",
            5: "Service becomes natural as you recognize yourself in all others.",
            6: "Boundaries dissolve as unity consciousness emerges.",
            7: "Individual existence transcends into cosmic awareness."
        };
        
        return insights[level] || "Your consciousness continues to evolve in profound ways.";
    }

    // Fallback content
    getFallbackStory(reality = 'wutong') {
        if (reality === 'wutong') {
            return {
                scene: "You find yourself in the Harmony Gardens where crystalline towers catch the afternoon light. Community members gather in peaceful circles, sharing wisdom and supporting each other's growth.",
                atmosphere: "peaceful and nurturing",
                choices: [
                    {
                        text: "Join a wisdom circle to learn from others",
                        mechanics: "PRESENCE + HARMONY",
                        service_opportunity: "Support community learning"
                    },
                    {
                        text: "Offer to help someone struggling with meditation",
                        mechanics: "INSIGHT + PRESENCE", 
                        service_opportunity: "Guide another's practice"
                    }
                ]
            };
        } else {
            return {
                scene: "The bio-luminescent corridors of WokeMound pulse with unnatural light. You hear distant screams from the transformation chambers, but also whispers of resistance and hope.",
                atmosphere: "tense but determined",
                choices: [
                    {
                        text: "Investigate the source of the screams to help",
                        mechanics: "RESOLVE + VIGOR",
                        service_opportunity: "Rescue others from forced change"
                    },
                    {
                        text: "Follow the whispers to find the resistance",
                        mechanics: "INSIGHT + PRESENCE",
                        service_opportunity: "Join collaborative efforts"
                    }
                ]
            };
        }
    }

    getDefaultChoices() {
        return [
            {
                text: "Seek deeper understanding of the situation",
                mechanics: "INSIGHT + PRESENCE",
                service_opportunity: "Learn how to better help others"
            }
        ];
    }

    parseChoiceResponse(response) {
        try {
            const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Failed to parse choice response:', error);
            return {
                outcome: "Your choice creates positive ripples through the consciousness field.",
                consciousness_growth: "You gain deeper understanding.",
                service_impact: "Your actions help others in unseen ways.",
                impact: "moderate"
            };
        }
    }
}

export default WuTongGameOrchestrator;
