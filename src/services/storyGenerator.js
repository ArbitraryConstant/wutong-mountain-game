import prisma from '../database/prisma.js';
import gameConfig from '../config/gameConfig.js';
import { callClaudeAPI } from './claudeAPI.js';

class StoryGenerator {
    constructor() {
        this.config = gameConfig;
    }

    async generateStory(context) {
        const { 
            reality, 
            playerLevel, 
            previousChoices = [], 
            playerStats 
        } = context;

        const prompt = this._constructStoryPrompt(
            reality, 
            playerLevel, 
            previousChoices, 
            playerStats
        );

        try {
            const claudeResponse = await callClaudeAPI(prompt);
            const storyFragment = await this._processStoryFragment(
                claudeResponse, 
                reality, 
                playerLevel
            );

            return storyFragment;
        } catch (error) {
            console.error('Story generation error:', error);
            return this._generateFallbackStory(reality, playerLevel);
        }
    }

    _constructStoryPrompt(reality, playerLevel, previousChoices, playerStats) {
        return `Generate an advanced narrative segment for "${this.config.game.name}"

Constraints:
- Reality: ${reality}
- Player Level: ${playerLevel}
- Mechanics: Emphasize growth, service, and consciousness evolution

Previous Context: ${JSON.stringify(previousChoices)}
Player Stats: ${JSON.stringify(playerStats)}

Generate a rich, philosophical story segment that transforms trauma into wisdom.

Output Format: Detailed JSON with narrative, choices, and hidden consciousness evolution mechanics.`;
    }

    async _processStoryFragment(claudeResponse, reality, playerLevel) {
        const cleanedResponse = this._cleanClaudeResponse(claudeResponse);
        
        const storyFragment = await prisma.createStoryFragment({
            reality: reality.toUpperCase(),
            consciousnessLevel: playerLevel,
            content: cleanedResponse.text,
            tags: {
                type: cleanedResponse.type,
                choices: cleanedResponse.choices.map(c => c.type)
            }
        });

        return {
            ...storyFragment,
            choices: cleanedResponse.choices
        };
    }

    _cleanClaudeResponse(response) {
        // Implement robust Claude response parsing
        // Add error handling, JSON cleaning
    }

    _generateFallbackStory(reality, playerLevel) {
        // Implement deterministic fallback story generation
        // Based on reality and player level
    }
}

export default new StoryGenerator();