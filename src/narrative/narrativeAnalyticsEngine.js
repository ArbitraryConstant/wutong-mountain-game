import fs from 'fs';
import path from 'path';

class NarrativeAnalyticsEngine {
    constructor() {
        this.analyticsStorage = path.join(process.cwd(), 'storage', 'narrative-analytics');
        this.ensureStorageDirectoryExists();
    }

    /**
     * Ensure analytics storage directory exists
     */
    ensureStorageDirectoryExists() {
        if (!fs.existsSync(this.analyticsStorage)) {
            fs.mkdirSync(this.analyticsStorage, { recursive: true });
        }
    }

    /**
     * Analyze narrative patterns across realities
     * @param {Object} narrativeData 
     * @returns {Object} Comprehensive narrative analysis
     */
    analyzeNarrativePatterns(narrativeData) {
        return {
            realityComparison: this.compareRealities(narrativeData),
            archetypeEvolution: this.trackArchetypeEvolution(narrativeData),
            traumaTransformationTrends: this.analyzeTtraumaTransformation(narrativeData)
        };
    }

    /**
     * Compare narrative characteristics across realities
     * @param {Object} narrativeData 
     * @returns {Object} Reality comparison
     */
    compareRealities(narrativeData) {
        const { wutong, wokemound } = narrativeData;

        return {
            healingPotential: {
                wutong: this.calculateAverageHealingPotential(wutong),
                wokemound: this.calculateAverageHealingPotential(wokemound)
            },
            archetypeDistribution: {
                wutong: this.analyzeArchetypeDistribution(wutong),
                wokemound: this.analyzeArchetypeDistribution(wokemound)
            }
        };
    }

    /**
     * Calculate average healing potential
     * @param {Array} narratives 
     * @returns {number} Average healing potential
     */
    calculateAverageHealingPotential(narratives) {
        const potentials = narratives.map(n => n.healingPotential);
        return potentials.reduce((a, b) => a + b, 0) / potentials.length;
    }

    /**
     * Analyze archetype distribution
     * @param {Array} narratives 
     * @returns {Object} Archetype distribution
     */
    analyzeArchetypeDistribution(narratives) {
        const archetypeCounts = narratives.reduce((acc, narrative) => {
            const archetype = narrative.archetype?.type || 'UNKNOWN';
            acc[archetype] = (acc[archetype] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(archetypeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([archetype, count]) => ({ archetype, count }));
    }

    /**
     * Track archetype evolution over time
     * @param {Object} narrativeData 
     * @returns {Object} Archetype evolution trends
     */
    trackArchetypeEvolution(narrativeData) {
        const combinedNarratives = [
            ...narrativeData.wutong,
            ...narrativeData.wokemound
        ];

        // Group narratives by timestamp
        const timeSeriesArchetypes = combinedNarratives.reduce((acc, narrative) => {
            const timestamp = new Date(narrative.timestamp).toISOString().split('T')[0];
            if (!acc[timestamp]) {
                acc[timestamp] = {};
            }
            
            const archetype = narrative.archetype?.type || 'UNKNOWN';
            acc[timestamp][archetype] = (acc[timestamp][archetype] || 0) + 1;
            
            return acc;
        }, {});

        return {
            timeSeriesData: timeSeriesArchetypes,
            dominantTrends: this.identifyDominantArchetypeTrends(timeSeriesArchetypes)
        };
    }

    /**
     * Identify dominant archetype trends
     * @param {Object} timeSeriesData 
     * @returns {Array} Dominant archetype trends
     */
    identifyDominantArchetypeTrends(timeSeriesData) {
        return Object.entries(timeSeriesData)
            .map(([timestamp, archetypeCounts]) => ({
                timestamp,
                dominantArchetype: Object.entries(archetypeCounts)
                    .sort((a, b) => b[1] - a[1])[0][0]
            }));
    }

    /**
     * Analyze trauma transformation trends
     * @param {Object} narrativeData 
     * @returns {Object} Trauma transformation analysis
     */
    analyzeTtraumaTransformation(narrativeData) {
        const combinedNarratives = [
            ...narrativeData.wutong,
            ...narrativeData.wokemound
        ];

        // Calculate trauma transformation metrics
        const transformationMetrics = combinedNarratives.reduce((acc, narrative) => {
            const traumaPotential = narrative.collectiveResonance?.traumaTransmutation || 0;
            
            acc.totalNarratives++;
            acc.averageTraumaPotential += traumaPotential;
            
            if (traumaPotential > 0.5) {
                acc.highTraumaTransformationCount++;
            }
            
            return acc;
        }, {
            totalNarratives: 0,
            averageTraumaPotential: 0,
            highTraumaTransformationCount: 0
        });

        return {
            ...transformationMetrics,
            averageTraumaPotential: transformationMetrics.averageTraumaPotential / transformationMetrics.totalNarratives
        };
    }

    /**
     * Persist analytics report
     * @param {Object} analysisReport 
     */
    persistAnalyticsReport(analysisReport) {
        const filename = `narrative-analytics-${Date.now()}.json`;
        const filePath = path.join(this.analyticsStorage, filename);

        try {
            fs.writeFileSync(
                filePath, 
                JSON.stringify(analysisReport, null, 2),
                'utf8'
            );
        } catch (error) {
            console.error('Failed to persist analytics report:', error);
        }
    }
}

export default new NarrativeAnalyticsEngine();