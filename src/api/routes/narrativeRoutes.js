import express from 'express';
import NarrativeIntegrationService from '../../narrative/narrativeIntegrationService.js';
import NarrativeAnalyticsEngine from '../../narrative/narrativeAnalyticsEngine.js';
import NarrativeTraumaTransformationModule from '../../narrative/narrativeTraumaTransformationModule.js';

const router = express.Router();

/**
 * Generate integrated narrative experience
 */
router.post('/generate', async (req, res) => {
    try {
        const { playerContext } = req.body;

        // Generate integrated narrative
        const integratedNarrative = await NarrativeIntegrationService.generateIntegratedNarrative(playerContext);

        // Transform trauma if applicable
        const traumaTransformation = NarrativeTraumaTransformationModule.transformTrauma(integratedNarrative);

        res.json({
            success: true,
            narrative: integratedNarrative,
            traumaTransformation
        });
    } catch (error) {
        console.error('Narrative generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate narrative experience'
        });
    }
});

/**
 * Get collective narrative insights
 */
router.get('/insights/:reality', (req, res) => {
    try {
        const { reality } = req.params;

        // Generate collective narrative insights
        const collectiveInsights = NarrativeIntegrationService.generateCollectiveNarrativeInsights(reality);

        // Perform advanced analytics
        const analyticsReport = NarrativeAnalyticsEngine.analyzeNarrativePatterns({
            [reality]: collectiveInsights.narratives
        });

        res.json({
            success: true,
            collectiveInsights,
            analyticsReport
        });
    } catch (error) {
        console.error('Narrative insights error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate narrative insights'
        });
    }
});

/**
 * Analyze trauma transformation
 */
router.get('/trauma-analysis', (req, res) => {
    try {
        // Retrieve recent trauma transformations
        const recentTransformations = this.retrieveRecentTraumaTransformations();

        // Analyze collective trauma patterns
        const traumaAnalysis = NarrativeTraumaTransformationModule.analyzeCollectiveTraumaPatterns(
            recentTransformations
        );

        res.json({
            success: true,
            traumaAnalysis
        });
    } catch (error) {
        console.error('Trauma analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze trauma transformations'
        });
    }
});

export default router;