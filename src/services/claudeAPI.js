import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import gameConfig from '../config/gameConfig.js';

class ClaudeAIService {
    constructor() {
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.baseURL = 'https://api.anthropic.com/v1/messages';
        
        // Configure rate limiting
        this.rateLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 10, // limit each IP to 10 requests per windowMs
            message: 'Too many requests to Claude AI, please try again later'
        });

        // Consciousness evolution prompt engineering templates
        this.promptTemplates = {
            storyGeneration: {
                wutong: [
                    "Generate a narrative that explores collective healing and technological harmony.",
                    "Craft a story segment revealing the interconnectedness of consciousness.",
                    "Create a scenario that transforms systemic trauma through empathy and understanding."
                ],
                wokemound: [
                    "Develop a narrative that exposes the psychological mechanisms of technological oppression.",
                    "Craft a story revealing resistance through subtle, non-violent means.",
                    "Generate a scenario that demonstrates human resilience against systemic dehumanization."
                ]
            },
            choiceProcessing: [
                "Analyze the deeper spiritual and psychological implications of this choice.",
                "Explore the ripple effects of individual action on collective consciousness.",
                "Reveal the hidden transformative potential within this moment of decision."
            ]
        };
    }

    async generateStory(context) {
        const { 
            reality, 
            playerLevel, 
            previousChoices = [], 
            playerStats 
        } = context;

        const prompt = this._constructAdvancedPrompt(
            reality, 
            playerLevel, 
            previousChoices, 
            playerStats
        );

        try {
            const response = await this._callClaudeAPI(prompt);
            return this._processStoryResponse(response);
        } catch (error) {
            console.error('Claude AI Story Generation Error:', error);
            return this._generateFallbackStory(reality, playerLevel);
        }
    }

    _constructAdvancedPrompt(reality, playerLevel, previousChoices, playerStats) {
        const randomTemplate = this._getRandomTemplate(reality);
        
        return `
CONSCIOUSNESS EVOLUTION NARRATIVE GENERATION

Game: Escape from WuTong Mountain
Reality: ${reality}
Player Level: ${playerLevel}

PHILOSOPHICAL PRINCIPLES:
- Transformation through understanding
- Non-violent resistance
- Collective healing
- Systemic empathy

CONTEXT:
${randomTemplate}

Player Statistics:
${JSON.stringify(playerStats)}

Previous Narrative Choices:
${JSON.stringify(previousChoices)}

GENERATION INSTRUCTIONS:
1. Create a 250-word narrative segment
2. Embed 3-4 meaningful choices
3. Each choice should have:
   - Philosophical implication
   - Potential for consciousness growth
   - Subtle systemic challenge

OUTPUT FORMAT (STRICT JSON):
{
  "location": "Evocative scene name",
  "text": "Narrative segment exploring consciousness",
  "choices": [
    {
      "text": "Choice description",
      "type": "service/resistance/learning",
      "philosophicalImplication": "Deeper meaning"
    }
  ]
}
`;
    }

    async _callClaudeAPI(prompt) {
        if (!this.apiKey) {
            throw new Error('Claude API Key not configured');
        }

        const requestBody = {
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                    'Anthropic-Version': '2023-06-01'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Claude API response error: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.content[0].text;
        } catch (error) {
            console.error('Claude API Call Error:', error);
            throw error;
        }
    }

    _processStoryResponse(responseText) {
        try {
            // Advanced parsing with multiple fallback strategies
            const cleanedText = responseText
                .replace(/```json\n?|\n?```/g, '')
                .trim();
            
            return JSON.parse(cleanedText);
        } catch (parseError) {
            console.warn('Claude response parsing failed. Using fallback.');
            return this._generateFallbackStory();
        }
    }

    _generateFallbackStory(reality = 'wutong', playerLevel = 1) {
        const baseStories = {
            wutong: {
                location: "Healing Sanctuary",
                text: "In the tranquil Healing Sanctuary, consciousness workers gather to process collective trauma...",
                choices: [
                    {
                        text: "Offer empathetic listening",
                        type: "service",
                        philosophicalImplication: "Healing through presence"
                    }
                ]
            },
            wokemound: {
                location: "Resistance Network",
                text: "Amidst the oppressive technological landscape, whispers of resistance emerge...",
                choices: [
                    {
                        text: "Investigate subtle resistance methods",
                        type: "resistance",
                        philosophicalImplication: "Transformation through understanding"
                    }
                ]
            }
        };

        return baseStories[reality] || baseStories.wutong;
    }

    _getRandomTemplate(reality) {
        const templates = this.promptTemplates.storyGeneration[reality];
        return templates[Math.floor(Math.random() * templates.length)];
    }
}

export default new ClaudeAIService();