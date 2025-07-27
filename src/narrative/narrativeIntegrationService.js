import StoryGenerationEngine from '../services/storyGenerationEngine.js';
import NarrativeResonanceEngine from '../services/narrativeResonanceEngine.js';
import GameMechanicsRuleset from '../config/gameMechanicsRuleset.js';
import ConsciousnessAuthenticator from '../auth/consciousnessAuthenticator.js';

class NarrativeIntegrationService {
    constructor() {
        this.storyEngine = StoryGenerationEngine;
        this.resonanceEngine = NarrativeResonanceEngine;
        this.gameMechanics = GameMechanicsRuleset;
        this.authenticator = ConsciousnessAuthenticator;

        // Collective narrative memory
        this.collectiveNarrativeMemory = {
            wutong: [],
            wokemound: []
        };
    }

    /**
     * Generate integrated narrative experience
     * @param {Object} playerContext 
     * @returns {Object} Integrated narrative segment
     */
    async generateIntegratedNarrative(playerContext) {
        // Authenticate player's narrative access
        const playerIdentity = await this.authenticator.validateNarrativeAccess(playerContext);

        // Generate story segment
        const storySegment = this.storyEngine.generateNarrativeSegment({
            reality: playerContext.reality,
            playerLevel: playerContext.level
        });

        // Generate quantum narrative ecosystem
        const quantumNarrative = this.resonanceEngine.generateNarrativeSegment({
            reality: playerContext.reality,
            playerLevel: playerContext.level,
            previousExperiences: playerContext.previousExperiences
        });

        // Integrate game mechanics
        const mechanicsIntegration = this.gameMechanics.calculateNarrativeImpact(
            storySegment, 
            quantumNarrative
        );

        // Create integrated narrative experience
        const integratedNarrative = {
            story: storySegment,
            quantumNarrative: quantumNarrative,
            mechanicsImpact: mechanicsIntegration,
            playerIdentity: playerIdentity
        };

        // Update collective narrative memory
        this.updateCollectiveNarrativeMemory(integratedNarrative);

        return integratedNarrative;
    }

    /**
     * Update collective narrative memory
     * @param {Object} narrativeExperience 
     */
    updateCollectiveNarrativeMemory(narrativeExperience) {
        const { story } = narrativeExperience;
        
        this.collectiveNarrativeMemory[story.reality].push({
            timestamp: Date.now(),
            archetype: story.archetype,
            healingPotential: story.healingPotential
        });

        // Limit memory size
        if (this.collectiveNarrativeMemory[story.reality].length > 1000) {
            this.collectiveNarrativeMemory[story.reality].shift();
        }
    }

    /**
     * Generate collective narrative insights
     * @param {string} reality 
     * @returns {Object} Collective narrative report
     */
    generateCollectiveNarrativeInsights(reality) {
        const narratives = this.collectiveNarrativeMemory[reality];

        return {
            totalNarratives: narratives.length,
            dominantArchetypes: this.calculateDominantArchetypes(narratives),
            healingTrends: this.analyzeHealingTrends(narratives)
        };
    }

    /**
     * Calculate dominant narrative archetypes
     * @param {Array} narratives 
     * @returns {Object} Archetype distribution
     */
    calculateDominantArchetypes(narratives) {
        const archetypeCount = narratives.reduce((acc, narrative) => {
            const archetype = narrative.archetype?.type || 'UNKNOWN';
            acc[archetype] = (acc[archetype] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(archetypeCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([archetype, count]) => ({ archetype, count }));
    }

    /**
     * Analyze healing trends
     * @param {Array} narratives 
     * @returns {Object} Healing trend analysis
     */
    analyzeHealingTrends(narratives) {
        const healingPotentials = narratives.map(n => n.healingPotential);
        
        return {
            averageHealingPotential: this.calculateAverage(healingPotentials),
            healingPotentialDistribution: this.calculateDistribution(healingPotentials)
        };
    }

    /**
     * Calculate average
     * @param {Array} values 
     * @returns {number} Average value
     */
    calculateAverage(values) {
        return values.length 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0;
    }

    /**
     * Calculate distribution of values
     * @param {Array} values 
     * @returns {Object} Distribution analysis
     */
    calculateDistribution(values) {
        const sorted = [...values].sort((a, b) => a - b);
        return {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            median: sorted[Math.floor(sorted.length / 2)]
        };
    }
}

export default new NarrativeIntegrationService();