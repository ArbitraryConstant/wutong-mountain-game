// src/config/gameConfig.js

/**
 * Comprehensive game configuration management
 */
export default {
    // Core Game Settings
    game: {
        name: 'Escape from WuTong Mountain',
        version: '2.1.0',
        environment: process.env.NODE_ENV || 'development'
    },

    // Reality Configurations
    realities: {
        wutong: {
            id: 'wutong',
            name: 'WuTong Mountain',
            description: 'A utopian realm of consciousness evolution in 2100',
            accessibility_level: 'open',
            recommended_consciousness_level: 3,
            starting_stats: {
                insight: 35,
                presence: 35,
                resolve: 35,
                vigor: 35,
                harmony: 35
            }
        },
        wokemound: {
            id: 'wokemound',
            name: 'WokeMound',
            description: 'A dystopian landscape of technological oppression',
            accessibility_level: 'challenging',
            recommended_consciousness_level: 5,
            starting_stats: {
                insight: 30,
                presence: 30,
                resolve: 40,
                vigor: 35,
                harmony: 30
            }
        }
    },

    // Consciousness Progression Levels
    consciousnessLevels: [
        {
            level: 1,
            name: 'Awakening',
            description: 'Initial awareness of personal journey',
            spiralPointsRequired: 0,
            statBonus: {
                insight: 5,
                presence: 5
            }
        },
        {
            level: 2,
            name: 'Exploration',
            description: 'Beginning to question existing narratives',
            spiralPointsRequired: 50,
            statBonus: {
                resolve: 10,
                insight: 10
            }
        },
        {
            level: 3,
            name: 'Emergence',
            description: 'Developing deeper self-understanding',
            spiralPointsRequired: 150,
            statBonus: {
                harmony: 15,
                presence: 15
            }
        }
    ],

    // Game Mechanics Configuration
    mechanics: {
        maxStats: 100,
        minStats: 0,
        spiralPointMultipliers: {
            service: 1.5,
            leadership: 1.3,
            learning: 1.2,
            exploration: 1.1
        }
    },

    // Feature Flags
    features: {
        storyGeneration: true,
        realitySwitching: true,
        playerCreation: true,
        debugMode: process.env.NODE_ENV !== 'production'
    },

    // Performance Tracking Configuration
    performance: {
        slowQueryThreshold: 500, // ms
        requestTimeoutThreshold: 5000 // ms
    }
};
