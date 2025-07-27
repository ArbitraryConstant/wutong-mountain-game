import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import gameConfig from '../config/gameConfig.js';

class PerformanceTracker {
    constructor() {
        this.metricsDirectory = path.join(process.cwd(), 'metrics');
        this.ensureMetricsDirectoryExists();
        
        // Consciousness-inspired performance tracking
        this.energyMetrics = {
            systemFlow: [],
            consciousnessResistance: [],
            transformationPotential: []
        };

        // Initialize performance profiles
        this.performanceProfiles = {
            story_generation: [],
            player_progression: [],
            reality_switching: []
        };
    }

    /**
     * Ensure metrics directory exists
     */
    ensureMetricsDirectoryExists() {
        if (!fs.existsSync(this.metricsDirectory)) {
            fs.mkdirSync(this.metricsDirectory, { recursive: true });
        }
    }

    /**
     * Track performance with consciousness-inspired metaphors
     * @param {string} operationType 
     * @param {Function} operation 
     * @returns {Promise} Operation result
     */
    async trackPerformance(operationType, operation) {
        const startTime = performance.now();
        const energySignature = this._generateEnergySignature();

        try {
            const result = await operation();
            
            const endTime = performance.now();
            const duration = endTime - startTime;

            const performanceRecord = {
                type: operationType,
                duration,
                timestamp: new Date().toISOString(),
                energySignature,
                transformationPotential: this._calculateTransformationPotential(duration)
            };

            this._recordPerformance(operationType, performanceRecord);
            this._analyzeSystemFlow(performanceRecord);

            return result;
        } catch (error) {
            // Track performance of failed operations
            this._recordFailedOperation(operationType, error);
            throw error;
        }
    }

    /**
     * Generate a metaphorical energy signature
     * @returns {Object} Energy signature
     */
    _generateEnergySignature() {
        return {
            flowState: Math.random(),
            resistanceLevel: Math.random(),
            harmonyFactor: Math.random()
        };
    }

    /**
     * Calculate transformation potential based on performance
     * @param {number} duration 
     * @returns {number} Transformation potential
     */
    _calculateTransformationPotential(duration) {
        // Non-linear transformation potential calculation
        const baseTransformationPotential = 100 - Math.min(duration, 100);
        const logarithmicAdjustment = Math.log(duration + 1) * 10;
        
        return Math.max(0, baseTransformationPotential - logarithmicAdjustment);
    }

    /**
     * Record performance metrics
     * @param {string} operationType 
     * @param {Object} performanceRecord 
     */
    _recordPerformance(operationType, performanceRecord) {
        // Store in performance profiles
        if (this.performanceProfiles[operationType]) {
            this.performanceProfiles[operationType].push(performanceRecord);
            
            // Limit historical records
            if (this.performanceProfiles[operationType].length > 100) {
                this.performanceProfiles[operationType].shift();
            }
        }

        // Periodic metrics writing
        if (this.performanceProfiles[operationType].length % 10 === 0) {
            this._writeMetricsToDisk(operationType);
        }
    }

    /**
     * Analyze system flow and consciousness resistance
     * @param {Object} performanceRecord 
     */
    _analyzeSystemFlow(performanceRecord) {
        // Track system's energetic characteristics
        this.energyMetrics.systemFlow.push(performanceRecord.energySignature.flowState);
        this.energyMetrics.consciousnessResistance.push(performanceRecord.energySignature.resistanceLevel);
        this.energyMetrics.transformationPotential.push(performanceRecord.transformationPotential);

        // Maintain metric history
        ['systemFlow', 'consciousnessResistance', 'transformationPotential'].forEach(metric => {
            if (this.energyMetrics[metric].length > 50) {
                this.energyMetrics[metric].shift();
            }
        });
    }

    /**
     * Record failed operations with deeper analysis
     * @param {string} operationType 
     * @param {Error} error 
     */
    _recordFailedOperation(operationType, error) {
        const failureRecord = {
            type: operationType,
            errorName: error.name,
            errorMessage: error.message,
            timestamp: new Date().toISOString(),
            resistanceLevel: 1 // Maximum resistance
        };

        console.warn('🌀 Consciousness Disruption Detected:', failureRecord);
    }

    /**
     * Write metrics to disk periodically
     * @param {string} operationType 
     */
    _writeMetricsToDisk(operationType) {
        const metricsFilePath = path.join(
            this.metricsDirectory, 
            `${operationType}-metrics-${new Date().toISOString().split('T')[0]}.json`
        );

        try {
            fs.writeFileSync(
                metricsFilePath, 
                JSON.stringify({
                    performanceProfiles: this.performanceProfiles[operationType],
                    energyMetrics: this.energyMetrics
                }, null, 2),
                'utf8'
            );
        } catch (writeError) {
            console.error('Failed to write metrics:', writeError);
        }
    }

    /**
     * Generate a philosophical performance report
     * @returns {Object} Performance insights
     */
    generatePerformanceInsights() {
        return {
            systemFlowAverage: this._calculateAverage(this.energyMetrics.systemFlow),
            resistanceLevels: this._calculateAverage(this.energyMetrics.consciousnessResistance),
            transformationPotential: this._calculateAverage(this.energyMetrics.transformationPotential),
            philosophicalReflection: this._generatePhilosophicalReflection()
        };
    }

    /**
     * Calculate average of an array
     * @param {number[]} array 
     * @returns {number} Average
     */
    _calculateAverage(array) {
        return array.length 
            ? array.reduce((a, b) => a + b, 0) / array.length 
            : 0;
    }

    /**
     * Generate a philosophical reflection on performance
     * @returns {string} Philosophical insight
     */
    _generatePhilosophicalReflection() {
        const reflections = [
            "Performance is not merely a measure of speed, but a dance of potential and resistance.",
            "In the flow of system interactions, we witness the continuous negotiation between structure and emergence.",
            "Each millisecond contains a universe of possibility, waiting to unfold."
        ];

        return reflections[Math.floor(Math.random() * reflections.length)];
    }

    /**
     * Create a middleware for tracking route performance
     * @returns {Function} Express performance tracking middleware
     */
    createPerformanceMiddleware() {
        return (req, res, next) => {
            const startHrTime = process.hrtime();

            res.on('finish', () => {
                const elapsedHrTime = process.hrtime(startHrTime);
                const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

                this.trackPerformance('route_access', async () => {
                    return {
                        path: req.path,
                        method: req.method,
                        duration: elapsedTimeInMs
                    };
                });
            });

            next();
        };
    }
}

export default new PerformanceTracker();