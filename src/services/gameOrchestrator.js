// WuTong Mountain Game Orchestrator
// src/services/gameOrchestrator.js

const WuTongClaudeAPI = require('./claudeAPI');

class GameOrchestrator {
    constructor(dbPool, redisClient, claudeApiKey) {
        this.db = dbPool;
        this.redis = redisClient;
        this.claude = new WuTongClaudeAPI(claudeApiKey);
        this.convergenceThresholds = [0, 25, 75, 150, 300]; // Spiral points needed for each convergence level
    }

    // =============================================================================
    // STORY GENERATION ORCHESTRATION
    // =============================================================================

    async generateStoryContent(passphrase, reality) {
        try {
            // Get player context
            const playerData = await this.getPlayerData(passphrase);
            if (!playerData) {
                throw new Error('Player not found');
            }

            // Build game context for Claude
            const gameContext = await this.buildGameContext(playerData, reality);

            // Generate story content using Claude
            const storyContent = await this.claude.generateStoryContent(gameContext);

            // Cache the story content
            if (this.redis) {
                await this.redis.setex(
                    `story:${passphrase}:${reality}`, 
                    300, // 5 minutes
                    JSON.stringify(storyContent)
                );
            }

            return {
                success: true,
                content: storyContent,
                playerData: playerData,
                consciousness_level: this.calculateConsciousnessLevel(playerData.spiral_points),
                convergence_stage: this.calculateConvergenceStage(playerData.spiral_points)
            };

        } catch (error) {
            console.error('Story generation failed:', error);
            return {
                success: false,
                error: 'Story generation temporarily unavailable',
                content: this.claude.getBackupStory({ currentReality: reality })
            };
        }
    }

    // =============================================================================
    // CHOICE PROCESSING ORCHESTRATION
    // =============================================================================

    async processChoice(passphrase, choiceData) {
        try {
            const playerData = await this.getPlayerData(passphrase);
            if (!playerData) {
                throw new Error('Player not found');
            }

            // Roll for success
            const rollResult = this.rollForSuccess(choiceData, playerData);

            // Build choice context
            const choiceContext = {
                choiceData,
                playerStats: {
                    insight: playerData.insight,
                    presence: playerData.presence,
                    resolve: playerData.resolve,
                    vigor: playerData.vigor,
                    harmony: playerData.harmony
                },
                rollResult,
                currentReality: playerData.current_reality,
                consciousnessLevel: this.calculateConsciousnessLevel(playerData.spiral_points)
            };

            // Process choice with Claude
            const choiceResult = await this.claude.processChoice(choiceContext);

            // Update player data
            await this.updatePlayerAfterChoice(passphrase, choiceResult, rollResult);

            // Record the choice in external memory
            await this.recordChoiceInMemory(passphrase, choiceData, choiceResult);

            return {
                success: true,
                result: choiceResult,
                rollDetails: rollResult,
                newPlayerData: await this.getPlayerData(passphrase)
            };

        } catch (error) {
            console.error('Choice processing failed:', error);
            return {
                success: false,
                error: 'Choice processing temporarily unavailable',
                result: this.claude.getBackupChoiceResult({ choiceData })
            };
        }
    }

    // =============================================================================
    // REALITY SWITCHING ORCHESTRATION
    // =============================================================================

    async switchReality(passphrase, targetReality) {
        try {
            const playerData = await this.getPlayerData(passphrase);
            if (!playerData) {
                throw new Error('Player not found');
            }

            const previousReality = playerData.current_reality;
            
            // Build transition context
            const transitionContext = {
                fromReality: previousReality,
                toReality: targetReality,
                convergenceLevel: this.calculateConvergenceStage(playerData.spiral_points),
                playerStats: {
                    insight: playerData.insight,
                    presence: playerData.presence,
                    resolve: playerData.resolve,
                    vigor: playerData.vigor,
                    harmony: playerData.harmony
                },
                recentExperiences: await this.getRecentExperiences(passphrase)
            };

            // Generate transition content with Claude
            const transitionResult = await this.claude.generateRealityTransition(transitionContext);

            // Update player reality
            await this.db.query(
                `UPDATE players SET 
                    current_reality = $1, 
                    sessions_count = sessions_count + 1,
                    insight = LEAST(100, insight + $2),
                    presence = LEAST(100, presence + $3),
                    resolve = LEAST(100, resolve + $4),
                    vigor = LEAST(100, vigor + $5),
                    harmony = LEAST(100, harmony + $6),
                    last_active = NOW()
                WHERE passphrase = $7`,
                [
                    targetReality,
                    transitionResult.stat_adjustments.insight,
                    transitionResult.stat_adjustments.presence,
                    transitionResult.stat_adjustments.resolve,
                    transitionResult.stat_adjustments.vigor,
                    transitionResult.stat_adjustments.harmony,
                    passphrase
                ]
            );

            return {
                success: true,
                transition: transitionResult,
                previousReality,
                newReality: targetReality,
                convergenceStage: this.calculateConvergenceStage(playerData.spiral_points)
            };

        } catch (error) {
            console.error('Reality switch failed:', error);
            return {
                success: false,
                error: 'Reality transition temporarily unavailable'
            };
        }
    }

    // =============================================================================
    // DREAM SHARING ORCHESTRATION
    // =============================================================================

    async initiateDreamSharing(helperPassphrase, dreamerId) {
        try {
            const helperData = await this.getPlayerData(helperPassphrase);
            if (!helperData) {
                throw new Error('Helper not found');
            }

            // Check if helper has dream sharing capability
            const consciousnessLevel = this.calculateConsciousnessLevel(helperData.spiral_points);
            if (consciousnessLevel < 2) {
                return {
                    success: false,
                    error: 'Dream sharing requires Consciousness Level 2 (Recognition)',
                    currentLevel: consciousnessLevel
                };
            }

            // Get dreamer profile (or generate one)
            const dreamerProfile = await this.getDreamerProfile(dreamerId);

            // Generate dream sharing session
            const dreamSession = await this.claude.generateDreamSharingSession(
                dreamerProfile, 
                {
                    insight: helperData.insight,
                    presence: helperData.presence,
                    resolve: helperData.resolve,
                    vigor: helperData.vigor,
                    harmony: helperData.harmony
                }
            );

            // Record dream sharing in database
            await this.recordDreamSharing(helperPassphrase, dreamerId, dreamSession);

            return {
                success: true,
                session: dreamSession,
                dreamerProfile,
                helperLevel: consciousnessLevel
            };

        } catch (error) {
            console.error('Dream sharing initiation failed:', error);
            return {
                success: false,
                error: 'Dream sharing session could not be initiated'
            };
        }
    }

    // =============================================================================
    // PLAYER CHOICE CREATION & MODERATION
    // =============================================================================

    async addPlayerChoice(passphrase, choiceText, gameContext) {
        try {
            // Moderate the choice with Claude
            const moderationResult = await this.claude.moderatePlayerChoice(choiceText, gameContext);

            if (moderationResult.accepted) {
                // Add to global choice pool
                await this.db.query(
                    `INSERT INTO community_choices (
                        creator_passphrase, original_text, processed_text, 
                        quality_rating, spiral_points_bonus, consciousness_alignment
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        passphrase,
                        choiceText,
                        moderationResult.processed_choice,
                        moderationResult.quality_rating,
                        moderationResult.spiral_points,
                        moderationResult.consciousness_alignment
                    ]
                );

                // Award bonus spiral points to creator
                await this.awardSpiralPoints(passphrase, moderationResult.spiral_points);

                return {
                    success: true,
                    message: "Your choice has been added to the collective story!",
                    processed_choice: moderationResult.processed_choice,
                    points_earned: moderationResult.spiral_points,
                    guidance: moderationResult.guidance
                };
            } else {
                return {
                    success: false,
                    message: "Choice needs refinement for consciousness alignment",
                    suggested_choice: moderationResult.processed_choice,
                    guidance: moderationResult.guidance
                };
            }

        } catch (error) {
            console.error('Choice moderation failed:', error);
            return {
                success: false,
                error: 'Choice moderation temporarily unavailable'
            };
        }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    async buildGameContext(playerData, reality) {
        const recentActions = await this.getRecentActions(playerData.passphrase);
        const activeNPCs = await this.getActiveNPCs(reality);
        const lastChoice = await this.getLastChoice(playerData.passphrase);

        return {
            currentReality: reality,
            location: playerData.current_location || this.getDefaultLocation(reality),
            playerStats: {
                insight: playerData.insight,
                presence: playerData.presence,
                resolve: playerData.resolve,
                vigor: playerData.vigor,
                harmony: playerData.harmony
            },
            consciousnessLevel: this.calculateConsciousnessLevel(playerData.spiral_points),
            convergenceStage: this.calculateConvergenceStage(playerData.spiral_points),
            recentActions,
            activeNPCs,
            lastChoice
        };
    }

    async getPlayerData(passphrase) {
        const result = await this.db.query(
            'SELECT * FROM players WHERE passphrase = $1',
            [passphrase]
        );
        return result.rows[0] || null;
    }

    async updatePlayerAfterChoice(passphrase, choiceResult, rollResult) {
        const { stat_changes, spiral_points_earned } = choiceResult;

        await this.db.query(
            `UPDATE players SET 
                insight = LEAST(100, insight + $1),
                presence = LEAST(100, presence + $2),
                resolve = LEAST(100, resolve + $3),
                vigor = LEAST(100, vigor + $4),
                harmony = LEAST(100, harmony + $5),
                spiral_points = spiral_points + $6,
                last_active = NOW()
            WHERE passphrase = $7`,
            [
                stat_changes.insight,
                stat_changes.presence,
                stat_changes.resolve,
                stat_changes.vigor,
                stat_changes.harmony,
                spiral_points_earned,
                passphrase
            ]
        );
    }

    rollForSuccess(choiceData, playerData) {
        const baseDie = Math.floor(Math.random() * 100) + 1;
        const relevantStats = this.parseStatsFromChoice(choiceData.mechanics);
        const statBonus = relevantStats.reduce((sum, stat) => sum + playerData[stat], 0);
        
        const total = baseDie + statBonus;
        
        let interpretation;
        if (total >= 90) interpretation = "Exceptional Success";
        else if (total >= 70) interpretation = "Good Success";
        else if (total >= 50) interpretation = "Partial Success";
        else if (total >= 30) interpretation = "Minimal Success";
        else interpretation = "Failure";

        return { baseDie, statBonus, total, interpretation };
    }

    parseStatsFromChoice(mechanicsString) {
        const statMap = {
            'INSIGHT': 'insight',
            'PRESENCE': 'presence',
            'RESOLVE': 'resolve',
            'VIGOR': 'vigor',
            'HARMONY': 'harmony'
        };

        const stats = [];
        Object.keys(statMap).forEach(key => {
            if (mechanicsString.includes(key)) {
                stats.push(statMap[key]);
            }
        });

        return stats;
    }

    calculateConsciousnessLevel(spiralPoints) {
        if (spiralPoints < 25) return 1; // Unconscious
        if (spiralPoints < 75) return 2; // Recognition
        if (spiralPoints < 150) return 3; // Understanding
        if (spiralPoints < 300) return 4; // Compassion
        if (spiralPoints < 500) return 5; // Wisdom
        if (spiralPoints < 750) return 6; // Service
        return 7; // Mystery
    }

    calculateConvergenceStage(spiralPoints) {
        if (spiralPoints < 50) return 1; // No awareness
        if (spiralPoints < 150) return 2; // Growing transfer
        if (spiralPoints < 300) return 3; // High transfer
        return 4; // Convergence
    }

    async recordChoiceInMemory(passphrase, choiceData, choiceResult) {
        // This would record the choice in external memory system
        const memoryData = {
            timestamp: new Date().toISOString(),
            passphrase,
            choice: choiceData.text,
            outcome: choiceResult.outcome_description,
            spiral_points: choiceResult.spiral_points_earned,
            consciousness_growth: choiceResult.consciousness_advancement
        };

        // For now, just log it - you can implement external memory later
        console.log('Memory recorded:', memoryData);
    }

    async getRecentActions(passphrase) {
        // Placeholder - implement based on your memory system
        return [
            { description: "Helped resistance member", outcome: "Built trust" },
            { description: "Explored consciousness link", outcome: "Gained insight" }
        ];
    }

    async getActiveNPCs(reality) {
        // Placeholder - implement based on your NPC system
        if (reality === 'wokemound') {
            return [
                { name: "Elena", state: "anxious", trauma: "forced_tech_enhancement" },
                { name: "Marcus", state: "determined", trauma: "identity_erasure" }
            ];
        } else {
            return [
                { name: "Aria", state: "peaceful", trauma: "none" },
                { name: "Chen", state: "contemplative", trauma: "healing" }
            ];
        }
    }

    async getLastChoice(passphrase) {
        // Placeholder - implement based on your choice history
        return {
            description: "Chose to help others",
            outcome: "Created positive change"
        };
    }

    getDefaultLocation(reality) {
        return reality === 'wokemound' ? 'underground-tunnels' : 'harbor-pavilion';
    }

    async getDreamerProfile(dreamerId) {
        // Generate or retrieve dreamer profile
        return {
            name: `Dreamer-${dreamerId}`,
            traumaType: "forced_transformation",
            background: "Unwilling participant in consciousness experiments",
            currentNightmare: "Being changed against their will",
            healingStage: 1
        };
    }

    async recordDreamSharing(helperPassphrase, dreamerId, dreamSession) {
        // Record dream sharing session in database
        await this.db.query(
            `INSERT INTO dream_sharing_sessions (
                helper_passphrase, dreamer_id, session_data, created_at
            ) VALUES ($1, $2, $3, NOW())`,
            [helperPassphrase, dreamerId, JSON.stringify(dreamSession)]
        );
    }

    async awardSpiralPoints(passphrase, points) {
        await this.db.query(
            'UPDATE players SET spiral_points = spiral_points + $1 WHERE passphrase = $2',
            [points, passphrase]
        );
    }

    async getRecentExperiences(passphrase) {
        // Placeholder - implement based on your experience tracking
        return [
            { reality: 'wokemound', description: 'Survived underground escape' },
            { reality: 'wutong', description: 'Helped in meditation gardens' }
        ];
    }
}

module.exports = GameOrchestrator;
