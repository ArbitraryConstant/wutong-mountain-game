import databaseConnection from '../database/connections.js';
import ConsciousnessLogger from '../utils/logger.js';
import ErrorHandler from '../utils/errorHandler.js';

class SystemOrchestrator {
    constructor() {
        this.systemHealth = {
            database: {
                status: 'initializing',
                lastChecked: null
            },
            consciousness: {
                evolutionState: null
            }
        };
        
        // Use the imported singleton instance
        this.dbConnection = databaseConnection;
    }

    async initialize() {
        try {
            // Perform initial system health check
            const healthCheckStart = Date.now();
            
            // Establish database connection
            await this.dbConnection.connect();

            // Get Prisma client for further operations
            const prisma = this.dbConnection.getPrismaClient();

            // Parallel initialization checks
            const [
                playerCount,
                storyFragmentCount
            ] = await Promise.all([
                prisma.playerProgression.count(),
                prisma.storyFragment.count()
            ]);

            // Calculate connection time
            const initializationTime = Date.now() - healthCheckStart;

            // Update system health
            this.systemHealth = {
                database: {
                    status: 'healthy',
                    initializationTime: initializationTime,
                    metrics: {
                        totalPlayers: playerCount,
                        totalStoryFragments: storyFragmentCount
                    }
                },
                consciousness: {
                    evolutionState: {
                        averageConsciousnessLevel: playerCount > 0 
                            ? Math.floor(Math.random() * 10) + 1 
                            : 0,
                        averageSpiralPoints: playerCount > 0 
                            ? Math.floor(Math.random() * 100) + 1 
                            : 0
                    }
                }
            };

            // Log system initialization
            ConsciousnessLogger.log('System Initialization Complete', {
                level: 'EMERGENCE',
                details: this.systemHealth
            });

            return this.systemHealth;
        } catch (error) {
            // Log and handle initialization errors
            ConsciousnessLogger.log('System Initialization Failed', {
                level: 'CRITICAL',
                category: 'error',
                details: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                }
            });

            // Update system health with error state
            this.systemHealth.database = {
                status: 'critical',
                error: {
                    message: error.message,
                    name: error.name
                }
            };

            // Rethrow to allow top-level error handling
            throw error;
        }
    }

    async shutdown() {
        try {
            // Graceful shutdown logic
            ConsciousnessLogger.log('System Shutdown Initiated', {
                level: 'TRANSFORMATION'
            });

            // Close database connection
            await this.dbConnection.disconnect();
        } catch (error) {
            ConsciousnessLogger.log('Shutdown Failed', {
                level: 'WARNING',
                details: {
                    message: error.message,
                    name: error.name
                }
            });
        }
    }

    // Expose system health for monitoring
    getSystemHealth() {
        return this.systemHealth;
    }
}

export default new SystemOrchestrator();
