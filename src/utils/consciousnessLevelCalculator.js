import gameConfig from '../config/gameConfig.js';

class ConsciousnessLevelCalculator {
    constructor() {
        this.config = gameConfig.consciousnessLevels;
        this.mechanics = gameConfig.mechanics;
    }

    /**
     * Calculate consciousness level based on spiral points
     * @param {number} spiralPoints - Accumulated points of spiritual growth
     * @returns {Object} Detailed consciousness level information
     */
    calculateLevel(spiralPoints) {
        // Deep philosophical mapping of points to consciousness levels
        const level = this.config.findLast(
            lvl => spiralPoints >= lvl.spiralPointsRequired
        ) || this.config[0];

        return {
            level: level.level,
            name: level.name,
            description: level.description,
            progress: this._calculateLevelProgress(spiralPoints, level),
            statBonus: this._calculateStatBonus(level, spiralPoints)
        };
    }

    /**
     * Calculate progress within current level
     * @param {number} spiralPoints 
     * @param {Object} currentLevel 
     * @returns {Object} Progress details
     */
    _calculateLevelProgress(spiralPoints, currentLevel) {
        const nextLevel = this.config.find(
            lvl => lvl.level === currentLevel.level + 1
        );

        return {
            currentPoints: spiralPoints,
            pointsToNextLevel: nextLevel 
                ? nextLevel.spiralPointsRequired - spiralPoints 
                : 0,
            percentToNextLevel: nextLevel 
                ? Math.min(
                    100, 
                    (spiralPoints / nextLevel.spiralPointsRequired) * 100
                ) 
                : 100
        };
    }

    /**
     * Calculate stat bonuses based on consciousness level
     * @param {Object} level 
     * @param {number} spiralPoints 
     * @returns {Object} Stat bonuses
     */
    _calculateStatBonus(level, spiralPoints) {
        const baseBonus = level.statBonus || {};
        
        // Implement a non-linear bonus scaling
        const bonusMultiplier = Math.log(spiralPoints + 1) / 10;
        
        return Object.fromEntries(
            Object.entries(baseBonus).map(([stat, bonus]) => [
                stat, 
                Math.min(
                    this.mechanics.maxStats, 
                    Math.floor(bonus * (1 + bonusMultiplier))
                )
            ])
        );
    }

    /**
     * Philosophical method to transform experience into growth
     * @param {Object} playerExperience 
     * @returns {Object} Transformed consciousness insights
     */
    transformExperience(playerExperience) {
        const insights = {
            challenges: playerExperience.challenges || [],
            choices: playerExperience.choices || [],
            serviceActions: playerExperience.serviceActions || []
        };

        // Philosophical mapping of experiences to deeper understanding
        return {
            spiritualGrowth: this._mapExperiencesToGrowth(insights),
            potentialTransformations: this._identifyTransformativePotential(insights)
        };
    }

    /**
     * Map experiences to spiritual growth potential
     * @param {Object} insights 
     * @returns {number} Spiritual growth points
     */
    _mapExperiencesToGrowth(insights) {
        // Complex non-linear mapping of experiences to growth
        return insights.serviceActions.length * 10 + 
               insights.challenges.length * 15 + 
               insights.choices.filter(choice => choice.type === 'service').length * 20;
    }

    /**
     * Identify potential for consciousness transformation
     * @param {Object} insights 
     * @returns {Array} Transformative opportunities
     */
    _identifyTransformativePotential(insights) {
        return insights.challenges
            .filter(challenge => challenge.outcome === 'overcome')
            .map(challenge => ({
                type: 'breakthrough',
                description: `Transcended ${challenge.type} through understanding`,
                growthPotential: 25
            }));
    }

    /**
     * Generate a philosophical reflection based on player's journey
     * @param {Object} playerJourney 
     * @returns {string} Profound narrative reflection
     */
    generateJourneyReflection(playerJourney) {
        const level = this.calculateLevel(playerJourney.spiralPoints);
        
        const reflectionTemplates = [
            `In the depths of ${level.name}, you realize that true growth emerges not from conquering external challenges, but from understanding the intricate web of consciousness that connects all experiences.`,
            `Your journey through ${level.name} reveals that each choice is a ripple, expanding far beyond the immediate moment, touching realms of existence yet unseen.`,
            `The path of ${level.name} teaches that transformation is not a destination, but a continuous unfolding of awareness.`
        ];

        return reflectionTemplates[
            Math.floor(Math.random() * reflectionTemplates.length)
        ];
    }
}

export default new ConsciousnessLevelCalculator();