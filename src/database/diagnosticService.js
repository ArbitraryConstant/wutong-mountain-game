import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

class DatabaseDiagnosticService {
    constructor() {
        // Load environment variables
        dotenv.config();
        this.prisma = new PrismaClient();
    }

    /**
     * Comprehensive database health check
     * Reflects the game's core philosophy of understanding through careful observation
     */
    async performHealthCheck() {
        const diagnosticResults = {
            timestamp: new Date().toISOString(),
            systemHealth: {
                database: {
                    status: 'unknown',
                    message: 'Initiating consciousness probe...'
                },
                metrics: {}
            }
        };

        try {
            // Measure connection time
            const startTime = Date.now();

            // Parallel diagnostic checks
            const [
                playerCount, 
                storyFragmentCount, 
                latestPlayer
            ] = await Promise.all([
                this.prisma.playerProgression.count(),
                this.prisma.storyFragment.count(),
                this.prisma.playerProgression.findFirst({
                    orderBy: { lastActive: 'desc' }
                })
            ]);

            const connectionTime = Date.now() - startTime;

            // Populate diagnostic results
            diagnosticResults.systemHealth = {
                database: {
                    status: 'healthy',
                    message: 'Consciousness pathways stable',
                    connectionTimeMs: connectionTime
                },
                metrics: {
                    totalPlayers: playerCount,
                    totalStoryFragments: storyFragmentCount,
                    lastActivePlayer: latestPlayer 
                        ? {
                            id: latestPlayer.id,
                            lastActive: latestPlayer.lastActive,
                            currentReality: latestPlayer.currentReality
                        } 
                        : null
                }
            };

            return diagnosticResults;
        } catch (error) {
            diagnosticResults.systemHealth.database = {
                status: 'critical',
                message: 'Consciousness disruption detected',
                errorDetails: {
                    name: error.name,
                    message: error.message
                }
            };

            return diagnosticResults;
        } finally {
            await this.prisma.();
        }
    }

    /**
     * Retrieves the current state of consciousness evolution
     */
    async getConsciousnessEvolutionState() {
        try {
            const playerStats = await this.prisma.playerProgression.aggregate({
                _avg: {
                    spiralPoints: true,
                    consciousnessLevel: true
                },
                _max: {
                    spiralPoints: true,
                    consciousnessLevel: true
                }
            });

            return {
                averageConsciousnessLevel: playerStats._avg.consciousnessLevel,
                averageSpiralPoints: playerStats._avg.spiralPoints,
                highestConsciousnessLevel: playerStats._max.consciousnessLevel,
                highestSpiralPoints: playerStats._max.spiralPoints
            };
        } catch (error) {
            console.error('Consciousness state retrieval failed:', error);
            throw error;
        } finally {
            await this.prisma.();
        }
    }
}

export default new DatabaseDiagnosticService();
