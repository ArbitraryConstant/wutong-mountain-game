// WuTong Mountain Claude API Service
// src/services/claudeAPI.js

import { Anthropic } from '@anthropic-ai/sdk';

class WuTongClaudeAPI {
    constructor(apiKey) {
        if (!apiKey) {
            console.warn('⚠️ Claude API key not provided - using fallback responses');
            this.anthropic = null;
        } else {
            this.anthropic = new Anthropic({
                apiKey: apiKey
            });
        }
        
        this.rateLimiter = {
            requests: [],
            maxPerMinute: 50,
            maxPerHour: 1000
        };
    }

    // Check rate limits
    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const oneHourAgo = now - 3600000;

        // Clean old requests
        this.rateLimiter.requests = this.rateLimiter.requests.filter(
            time => time > oneHourAgo
        );

        const recentRequests = this.rateLimiter.requests.filter(
            time => time > oneMinuteAgo
        );

        return {
            canMakeRequest: recentRequests.length < this.rateLimiter.maxPerMinute &&
                           this.rateLimiter.requests.length < this.rateLimiter.maxPerHour,
            minuteCount: recentRequests.length,
            hourCount: this.rateLimiter.requests.length
        };
    }

    // Generate story content with consciousness context
    async generateStoryContent(gameContext) {
        const rateCheck = this.checkRateLimit();
        if (!rateCheck.canMakeRequest) {
            console.warn('Rate limit exceeded, using fallback');
            return this.getFallbackStory(gameContext.reality);
        }

        if (!this.anthropic) {
            return this.getFallbackStory(gameContext.reality);
        }

        try {
            this.rateLimiter.requests.push(Date.now());

            const prompt = this.buildStoryPrompt(gameContext);
            
            const response = await this.anthropic.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1200,
                temperature: 0.7,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            });

            return this.parseStoryResponse(response.content[0].text);
        } catch (error) {
            console.error('Claude API error:', error);
            return this.getFallbackStory(gameContext.reality);
        }
    }

    // Process player choice with consciousness evaluation
    async processChoice(playerData, choice, context) {
        const rateCheck = this.checkRateLimit();
        if (!rateCheck.canMakeRequest || !this.anthropic) {
            return this.getFallbackChoiceResult(choice);
        }

        try {
            this.rateLimiter.requests.push(Date.now());

            const prompt = this.buildChoicePrompt(playerData, choice, context);
            
            const response = await this.anthropic.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 800,
                temperature: 0.6,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            });

            return this.parseChoiceResponse(response.content[0].text);
        } catch (error) {
            console.error('Claude choice processing error:', error);
            return this.getFallbackChoiceResult(choice);
        }
    }

    // Build comprehensive story prompt
    buildStoryPrompt(gameContext) {
        const { player, reality, location, recentActions, npcs } = gameContext;
        
        return `Generate content for "Escape from WuTong Mountain" - a consciousness evolution game.

GAME STATE:
Reality: ${reality === 'wutong' ? 'WuTong Mountain (Utopian 2100)' : 'WokeMound (Dystopian Horror)'}
Location: ${location || 'unknown-area'}
Player Level: ${this.calculateLevel(player.spiral_points)}

PLAYER STATS: ${JSON.stringify(player.stats || {})}
SPIRAL POINTS: ${player.spiral_points || 0}

CONSCIOUSNESS PRINCIPLES:
1. Growth through service to others
2. ${reality === 'wokemound' ? 'Horror balanced with hope' : 'Healing through community'}
3. Choices advance spiritual development
4. Empathy over individual achievement

Generate a story segment (200-250 words) with current situation and 3-4 choices.

Format as JSON:
{
  "scene": "vivid description",
  "atmosphere": "emotional tone",
  "choices": [
    {
      "text": "choice description",
      "mechanics": "INSIGHT + PRESENCE",
      "service_opportunity": "how this helps others"
    }
  ]
}`;
    }

    // Parse Claude's story response
    parseStoryResponse(response) {
        try {
            const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            
            return {
                scene: parsed.scene || "The path forward beckons with possibility...",
                atmosphere: parsed.atmosphere || "contemplative",
                choices: parsed.choices || this.getDefaultChoices(),
                npc_updates: parsed.npc_updates || []
            };
        } catch (error) {
            console.error('Failed to parse story response:', error);
            return this.getFallbackStory();
        }
    }

    // Build choice processing prompt
    buildChoicePrompt(playerData, choice, context) {
        return `Process this consciousness evolution choice:

CHOICE: "${choice.text}"
MECHANICS: ${choice.mechanics}
REALITY: ${context.reality}
PLAYER LEVEL: ${this.calculateLevel(playerData.spiral_points)}

Generate outcome focusing on consciousness growth and service to others.

Format as JSON:
{
  "outcome": "what happens (150 words)",
  "consciousness_growth": "wisdom gained",
  "service_impact": "how this helped others",
  "impact": "minor/moderate/major/profound"
}`;
    }

    // Parse choice response
    parseChoiceResponse(response) {
        try {
            const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Failed to parse choice response:', error);
            return this.getFallbackChoiceResult();
        }
    }

    // Helper methods
    calculateLevel(spiralPoints) {
        if (spiralPoints >= 1000) return 7;
        if (spiralPoints >= 750) return 6;
        if (spiralPoints >= 500) return 5;
        if (spiralPoints >= 300) return 4;
        if (spiralPoints >= 150) return 3;
        if (spiralPoints >= 50) return 2;
        return 1;
    }

    getFallbackStory(reality = 'wutong') {
        if (reality === 'wutong') {
            return {
                scene: "You stand in the Harmony Gardens where crystalline towers catch the afternoon light. Community members gather in peaceful circles, sharing wisdom and supporting each other's growth.",
                atmosphere: "peaceful and nurturing",
                choices: [
                    {
                        text: "Join a wisdom circle to learn from others",
                        mechanics: "PRESENCE + HARMONY",
                        service_opportunity: "Support community learning"
                    },
                    {
                        text: "Offer to help someone struggling with meditation",
                        mechanics: "INSIGHT + PRESENCE",
                        service_opportunity: "Guide another's practice"
                    },
                    {
                        text: "Share your own experiences with the group",
                        mechanics: "HARMONY + RESOLVE",
                        service_opportunity: "Inspire others through vulnerability"
                    }
                ]
            };
        } else {
            return {
                scene: "The bio-luminescent corridors of WokeMound pulse with unnatural light. You hear distant screams from the transformation chambers, but also whispers of resistance and hope.",
                atmosphere: "tense but determined",
                choices: [
                    {
                        text: "Investigate the source of the screams to help",
                        mechanics: "RESOLVE + VIGOR",
                        service_opportunity: "Rescue others from forced change"
                    },
                    {
                        text: "Follow the whispers to find the resistance",
                        mechanics: "INSIGHT + PRESENCE",
                        service_opportunity: "Join collaborative efforts"
                    },
                    {
                        text: "Create a diversion to help others escape",
                        mechanics: "VIGOR + HARMONY",
                        service_opportunity: "Enable others' freedom"
                    }
                ]
            };
        }
    }

    getFallbackChoiceResult(choice) {
        return {
            outcome: `Your choice to "${choice.text}" ripples through the consciousness field, creating opportunities for growth and service that extend beyond what you can immediately see.`,
            consciousness_growth: "You gain deeper understanding of how individual actions serve collective evolution.",
            service_impact: "Your decision creates positive change in ways both seen and unseen.",
            impact: "moderate"
        };
    }

    getDefaultChoices() {
        return [
            {
                text: "Seek deeper understanding of the situation",
                mechanics: "INSIGHT + PRESENCE",
                service_opportunity: "Learn how to better help others"
            }
        ];
    }
}

export default WuTongClaudeAPI;
