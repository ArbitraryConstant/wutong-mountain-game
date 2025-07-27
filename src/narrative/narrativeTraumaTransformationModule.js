import fs from 'fs';
import path from 'path';

class NarrativeTraumaTransformationModule {
    constructor() {
        this.traumaArchive = path.join(process.cwd(), 'storage', 'trauma-transformation');
        this.ensureTraumaArchiveExists();
    }

    /**
     * Ensure trauma archive directory exists
     */
    ensureTraumaArchiveExists() {
        if (!fs.existsSync(this.traumaArchive)) {
            fs.mkdirSync(this.traumaArchive, { recursive: true });
        }
    }

    /**
     * Transform collective trauma through narrative
     * @param {Object} narrativeExperience 
     * @returns {Object} Trauma transformation result
     */
    transformTrauma(narrativeExperience) {
        const traumaSignature = this.extractTraumaSignature(narrativeExperience);
        const transformationPotential = this.calculateTransformationPotential(traumaSignature);
        
        const transformationResult = {
            originalTrauma: traumaSignature,
            transformationPotential,
            healingNarrative: this.generateHealingNarrative(transformationPotential),
            collectiveInsight: this.generateCollectiveInsight(traumaSignature)
        };

        this.persistTraumaTransformation(transformationResult);

        return transformationResult;
    }

    /**
     * Extract trauma signature from narrative experience
     * @param {Object} narrativeExperience 
     * @returns {Object} Trauma signature
     */
    extractTraumaSignature(narrativeExperience) {
        return {
            reality: narrativeExperience.story.reality,
            archetype: narrativeExperience.story.archetype?.type,
            traumaEcho: narrativeExperience.story.nightmareEcho,
            playerLevel: narrativeExperience.playerContext?.level,
            timestamp: Date.now()
        };
    }

    /**
     * Calculate transformation potential
     * @param {Object} traumaSignature 
     * @returns {number} Transformation potential
     */
    calculateTransformationPotential(traumaSignature) {
        const baseFactors = {
            wutong: 0.7,
            wokemound: 0.5
        };

        const archetypeMultipliers = {
            AWAKENING: 1.2,
            HEALING: 1.5,
            RESISTANCE: 1.3,
            EMERGENCE: 1.4
        };

        const realityFactor = baseFactors[traumaSignature.reality] || 0.6;
        const archetypeFactor = archetypeMultipliers[traumaSignature.archetype] || 1;

        return Math.min(
            1, 
            realityFactor * archetypeFactor * (traumaSignature.playerLevel / 10)
        );
    }

    /**
     * Generate healing narrative
     * @param {number} transformationPotential 
     * @returns {string} Healing narrative
     */
    generateHealingNarrative(transformationPotential) {
        const healingTemplates = [
            "The wound becomes a portal of understanding...",
            "Collective pain transforms into collective wisdom...",
            "Suffering dissolves, revealing the underlying interconnectedness...",
            "Trauma's edges soften, becoming a landscape of potential..."
        ];

        const intensityModifiers = [
            "Whispers of transformation emerge...",
            "A profound shift ripples through consciousness...",
            "The very fabric of reality begins to heal...",
            "Healing cascades beyond individual experience..."
        ];

        // Select template based on transformation potential
        const baseTemplate = healingTemplates[
            Math.floor(transformationPotential * healingTemplates.length)
        ];

        const intensityModifier = intensityModifiers[
            Math.floor(transformationPotential * intensityModifiers.length)
        ];

        return `${intensityModifier} ${baseTemplate}`;
    }

    /**
     * Generate collective insight
     * @param {Object} traumaSignature 
     * @returns {Object} Collective insight
     */
    generateCollectiveInsight(traumaSignature) {
        const insightTemplates = {
            wutong: [
                "Compassion emerges as the deepest form of systemic transformation.",
                "Collective healing transcends individual boundaries.",
                "Understanding becomes the most powerful act of resistance."
            ],
            wokemound: [
                "Resistance is the first whisper of liberation.",
                "Systemic trauma can be metabolized into collective wisdom.",
                "Every oppressive structure contains the seeds of its own transformation."
            ]
        };

        return {
            insight: this.selectRandomInsight(insightTemplates[traumaSignature.reality]),
            archetypeReflection: this.generateArchetypeReflection(traumaSignature.archetype)
        };
    }

    /**
     * Select random insight
     * @param {string[]} insights 
     * @returns {string} Selected insight
     */
    selectRandomInsight(insights) {
        return insights[Math.floor(Math.random() * insights.length)];
    }

    /**
     * Generate archetype-specific reflection
     * @param {string} archetypeType 
     * @returns {string} Archetype reflection
     */
    generateArchetypeReflection(archetypeType) {
        const archetypeReflections = {
            AWAKENING: "The first step of transformation is recognizing the possibility of change.",
            HEALING: "Healing is not about erasing the wound, but about understanding its wisdom.",
            RESISTANCE: "True liberation begins with reimagining what's possible.",
            EMERGENCE: "New worlds are born in the spaces between what is and what could be."
        };

        return archetypeReflections[archetypeType] || 
            "Every experience carries the potential for profound transformation.";
    }

    /**
     * Persist trauma transformation
     * @param {Object} transformationResult 
     */
    persistTraumaTransformation(transformationResult) {
        const filename = `trauma-transformation-${Date.now()}.json`;
        const filePath = path.join(this.traumaArchive, filename);

        try {
            fs.writeFileSync(
                filePath, 
                JSON.stringify(transformationResult, null, 2),
                'utf8'
            );
        } catch (error) {
            console.error('Failed to persist trauma transformation:', error);
        }
    }

    /**
     * Analyze collective trauma patterns
     * @param {Array} transformationResults 
     * @returns {Object} Collective trauma analysis
     */
    analyzeCollectiveTraumaPatterns(transformationResults) {
        const analysis = {
            totalTransformations: transformationResults.length,
            transformationPotentialDistribution: this.calculateTransformationDistribution(transformationResults),
            archetypeTransformationTrends: this.analyzeArchetypeTransformationTrends(transformationResults),
            realityComparison: this.compareRealityTransformations(transformationResults)
        };

        return analysis;
    }

    /**
     * Calculate transformation potential distribution
     * @param {Array} transformationResults 
     * @returns {Object} Distribution analysis
     */
    calculateTransformationDistribution(transformationResults) {
        const potentials = transformationResults.map(r => r.transformationPotential);
        
        return {
            min: Math.min(...potentials),
            max: Math.max(...potentials),
            average: potentials.reduce((a, b) => a + b, 0) / potentials.length,
            highTransformationCount: potentials.filter(p => p > 0.7).length
        };
    }

    /**
     * Analyze archetype transformation trends
     * @param {Array} transformationResults 
     * @returns {Object} Archetype transformation trends
     */
    analyzeArchetypeTransformationTrends(transformationResults) {
        const archetypeTransformations = transformationResults.reduce((acc, result) => {
            const archetype = result.originalTrauma.archetype;
            if (!acc[archetype]) {
                acc[archetype] = {
                    count: 0,
                    totalPotential: 0
                };
            }
            acc[archetype].count++;
            acc[archetype].totalPotential += result.transformationPotential;
            return acc;
        }, {});

        return Object.entries(archetypeTransformations).map(([archetype, data]) => ({
            archetype,
            count: data.count,
            averageTransformationPotential: data.totalPotential / data.count
        })).sort((a, b) => b.averageTransformationPotential - a.averageTransformationPotential);
    }

    /**
     * Compare transformation across realities
     * @param {Array} transformationResults 
     * @returns {Object} Reality transformation comparison
     */
    compareRealityTransformations(transformationResults) {
        const realityAnalysis = transformationResults.reduce((acc, result) => {
            const reality = result.originalTrauma.reality;
            if (!acc[reality]) {
                acc[reality] = {
                    count: 0,
                    totalPotential: 0
                };
            }
            acc[reality].count++;
            acc[reality].totalPotential += result.transformationPotential;
            return acc;
        }, {});

        return Object.entries(realityAnalysis).map(([reality, data]) => ({
            reality,
            count: data.count,
            averageTransformationPotential: data.totalPotential / data.count
        })).sort((a, b) => b.averageTransformationPotential - a.averageTransformationPotential);
    }
}

export default new NarrativeTraumaTransformationModule();