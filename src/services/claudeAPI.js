// WuTong Mountain - Claude API Integration System
// src/services/claudeAPI.js

class WuTongClaudeAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-3-sonnet-20240229';
        this.maxTokens = 2000;
        this.temperature = 0.7;
    }

    // =============================================================================
    // CORE STORY GENERATION
    // =============================================================================

    async generateStoryContent(gameContext) {
        const {
            currentReality,
            location,
            playerStats,
            consciousnessLevel,
            convergenceStage,
            recentActions,
            activeNPCs,
            lastChoice
        } = gameContext;

        const systemPrompt = this.buildSystemPrompt(currentReality, consciousnessLevel);
        const contextPrompt = this.buildContextPrompt(gameContext);

        try {
            const response = await this.callClaude([
                { role: "system", content: systemPrompt },
                { role: "user", content: contextPrompt }
            ]);

            return this.parseStoryResponse(response);
        } catch (error) {
            console.error('Story generation failed:', error);
            return this.getBackupStory(gameContext);
        }
    }

    buildSystemPrompt(reality, consciousnessLevel) {
        const basePrompt = `You are generating content for "Escape from WuTong Mountain" - a consciousness evolution game disguised as choose-your-own-adventure.

CORE PRINCIPLES:
- Growth happens through service to others, not individual achievement
- Every choice should advance consciousness evolution
- Balance challenge with hope
- No violence as solution - transformation through understanding
- Hidden spiritual teachings through engaging narrative

CONSCIOUSNESS LEVELS (1-7):
1. Unconscious: Reactive, fear-based choices
2. Recognition: Starting to see patterns
3. Understanding: Grasping deeper truths
4. Compassion: Acting for others' benefit
5. Wisdom: Seeing interconnection
6. Service: Living for collective good
7. Mystery: Direct cosmic awareness

REALITY SPECIFIC GUIDELINES:`;

        if (reality === 'wokemound') {
            return basePrompt + `

WOKEMOUND REALITY:
- Dystopian horror setting with plant-consciousness theme
- Focus on "forced vs chosen change" trauma
- NPCs experiencing transformation without consent
- Underground resistance communities
- Strange plant-human hybrid entities
- Environmental control systems
- Mystery elements around consciousness transfer
- Balance horror with moments of hope and connection
- Choices should build empathy through shared trauma
- Solutions come through understanding, not fighting

TONE: Eerie but not hopeless, mysterious, emphasizes human connection in dark times`;
        } else {
            return basePrompt + `

WUTONG MOUNTAIN REALITY (2100):
- Utopian cooperative society
- Advanced technology in harmony with nature
- Focus on healing trauma and helping others
- Sailing, meditation, community projects
- Dream sharing circles for healing nightmares
- Technology that enhances rather than replaces human connection
- Everyone contributes according to ability
- Collective decision-making
- Environmental restoration
- Consciousness expansion as normal part of life

TONE: Peaceful but not boring, inspiring, emphasizes service and growth`;
        }
    }

    buildContextPrompt(gameContext) {
        const {
            currentReality,
            location,
            playerStats,
            consciousnessLevel,
            convergenceStage,
            recentActions,
            activeNPCs,
            lastChoice
        } = gameContext;

        return `CURRENT GAME STATE:
Reality: ${currentReality}
Location: ${location}
Consciousness Level: ${consciousnessLevel}/7
Convergence Stage: ${convergenceStage}/4

PLAYER STATS:
INSIGHT: ${playerStats.insight}/100 (understanding patterns)
PRESENCE: ${playerStats.presence}/100 (emotional awareness)  
RESOLVE: ${playerStats.resolve}/100 (determination)
VIGOR: ${playerStats.vigor}/100 (physical/mental energy)
HARMONY: ${playerStats.harmony}/100 (connection with others)

RECENT ACTIONS:
${recentActions.map(action => `- ${action.description} (${action.outcome})`).join('\n')}

ACTIVE NPCS:
${activeNPCs.map(npc => `- ${npc.name}: ${npc.state} (trauma: ${npc.trauma || 'none'})`).join('\n')}

PREVIOUS CHOICE MADE:
${lastChoice?.description || 'Starting new session'}
Outcome: ${lastChoice?.outcome || 'Beginning journey'}

GENERATE:
1. Current situation description (200-250 words)
   - Set vivid scene appropriate to reality
   - Include relevant NPCs and their emotional states
   - Show consequences of previous choice
   - ${currentReality === 'wokemound' ? 'Include subtle horror elements and resistance themes' : 'Include healing opportunities and community connection'}

2. Four choice options that:
   - Advance consciousness evolution through service to others
   - Offer different approaches (direct action, understanding, patience, creativity)
   - Include stat challenges (mention which stats are tested)
   - Lead toward helping NPCs or community
   - ${convergenceStage > 2 ? 'Show subtle reality bleeding effects' : ''}

3. NPC emotional state updates if relevant

Format as JSON:
{
  "situation": "scene description",
  "choices": [
    {
      "text": "choice description",
      "mechanics": "INSIGHT+PRESENCE test",
      "consciousness_growth": "what consciousness aspect this develops",
      "service_opportunity": "how this serves others"
    }
  ],
  "npc_updates": [
    {
      "name": "npc name",
      "new_state": "emotional state",
      "reason": "why they changed"
    }
  ],
  "convergence_hints": "subtle signs of reality connection (if convergence > 2)"
}`;
    }

    // =============================================================================
    // CHOICE PROCESSING
    // =============================================================================

    async processChoice(choiceContext) {
        const {
            choiceData,
            playerStats,
            rollResult,
            currentReality,
            consciousnessLevel
        } = choiceContext;

        const prompt = `CHOICE RESOLUTION:

Choice Made: ${choiceData.text}
Mechanics: ${choiceData.mechanics}
Roll Result: ${rollResult.total} (${rollResult.interpretation})
Base Die: ${rollResult.baseDie}, Stat Bonus: ${rollResult.statBonus}

Current Stats: ${JSON.stringify(playerStats)}
Reality: ${currentReality}
Consciousness Level: ${consciousnessLevel}/7

RESOLVE THE CHOICE:
1. Describe outcome based on roll result (150-200 words)
2. Show how the choice advances consciousness evolution
3. Create opportunities for serving others
4. Apply appropriate stat changes (+1 to +5 based on growth)
5. Award spiral points (5-50) based on service/consciousness advancement
6. ${choiceData.consciousness_growth ? 'Reflect the consciousness growth: ' + choiceData.consciousness_growth : ''}

Success Levels:
- Exceptional (90+): Major breakthrough, significant stat gains, new opportunities
- Good (70-89): Solid progress, moderate gains, positive development
- Partial (50-69): Mixed results, small gains, learning experience
- Minimal (30-49): Limited success, minimal gains, character building
- Failure (0-29): Setback that teaches important lesson, still some growth

Format as JSON:
{
  "outcome_description": "detailed result",
  "stat_changes": {
    "insight": 0,
    "presence": 0,
    "resolve": 0,
    "vigor": 0,
    "harmony": 0
  },
  "spiral_points_earned": 0,
  "consciousness_advancement": "what was learned/how player grew",
  "new_opportunities": ["new possibilities opened up"],
  "convergence_impact": "how this affects reality connection"
}`;

        try {
            const response = await this.callClaude([
                { role: "user", content: prompt }
            ]);

            return this.parseChoiceResponse(response);
        } catch (error) {
            console.error('Choice processing failed:', error);
            return this.getBackupChoiceResult(choiceContext);
        }
    }

    // =============================================================================
    // DREAM SHARING SYSTEM
    // =============================================================================

    async generateDreamSharingSession(dreamerProfile, helperStats) {
        const prompt = `DREAM SHARING SESSION GENERATION:

DREAMER PROFILE:
Name: ${dreamerProfile.name}
Trauma Type: ${dreamerProfile.traumaType}
Background: ${dreamerProfile.background}
Current Nightmare: ${dreamerProfile.currentNightmare}
Healing Stage: ${dreamerProfile.healingStage}/3

HELPER STATS: ${JSON.stringify(helperStats)}

Generate a three-phase dream sharing session using the healing framework:

PHASE 1 - RECOGNITION: "I see your pain, and it is real"
- Helper witnesses dreamer's nightmare without trying to fix
- Creates safe space for pain to be acknowledged
- No solutions offered, just presence

PHASE 2 - RESONANCE: "I have known something like this pain"  
- Helper shares their own related experience (not identical)
- Creates bridge of understanding and connection
- Shows dreamer they are not alone

PHASE 3 - TRANSFORMATION: "Together we can dream a new possibility"
- Collaborative reimagining of the nightmare scenario
- Helper and dreamer co-create healing imagery
- New possibility emerges from understanding

Focus on "forced vs chosen change" theme. The trauma should involve something happening TO the dreamer without their consent.

Format as JSON:
{
  "dreamer_nightmare": "detailed nightmare scenario",
  "phase_1_recognition": {
    "helper_action": "how helper witnesses",
    "dreamer_response": "how dreamer reacts to being seen"
  },
  "phase_2_resonance": {
    "helper_sharing": "helper's related experience",
    "connection_moment": "when understanding bridges"
  },
  "phase_3_transformation": {
    "collaborative_healing": "how they reimagine together",
    "new_possibility": "healed version of nightmare"
  },
  "spiral_points": "points earned for service (25-75)",
  "consciousness_growth": "how helping others advances helper's awareness"
}`;

        try {
            const response = await this.callClaude([
                { role: "user", content: prompt }
            ]);

            return this.parseDreamSharingResponse(response);
        } catch (error) {
            console.error('Dream sharing generation failed:', error);
            return this.getBackupDreamSession(dreamerProfile);
        }
    }

    // =============================================================================
    // REALITY CONVERGENCE
    // =============================================================================

    async generateRealityTransition(transitionContext) {
        const {
            fromReality,
            toReality,
            convergenceLevel,
            playerStats,
            recentExperiences
        } = transitionContext;

        const prompt = `REALITY TRANSITION GENERATION:

Transitioning: ${fromReality} → ${toReality}
Convergence Level: ${convergenceLevel}/4
Player Stats: ${JSON.stringify(playerStats)}

Recent Experiences:
${recentExperiences.map(exp => `- ${exp.reality}: ${exp.description}`).join('\n')}

Generate transition content based on convergence level:

Level 1 (Low): Seamless transition, no awareness of connection
Level 2 (Growing): Subtle déjà vu, skills seem oddly familiar
Level 3 (High): Clear skill transfer, strange synchronicities
Level 4 (Convergence): Reality bleeding, obvious connections

${fromReality === 'wokemound' ? 
  'Player escaping nightmare through underground portal/consciousness transfer' :
  'Player entering meditation state and consciousness shifting to help others'
}

Format as JSON:
{
  "transition_narrative": "how the transition happens",
  "consciousness_transfer_effects": "what skills/awareness transfers",
  "reality_bleeding": "elements from other reality appearing",
  "stat_adjustments": {
    "insight": 0,
    "presence": 0,
    "resolve": 0,
    "vigor": 0,
    "harmony": 0
  },
  "new_understanding": "what player realizes about connection"
}`;

        try {
            const response = await this.callClaude([
                { role: "user", content: prompt }
            ]);

            return this.parseTransitionResponse(response);
        } catch (error) {
            console.error('Transition generation failed:', error);
            return this.getBackupTransition(transitionContext);
        }
    }

    // =============================================================================
    // PLAYER CHOICE MODERATION
    // =============================================================================

    async moderatePlayerChoice(playerChoice, gameContext) {
        const prompt = `PLAYER CHOICE MODERATION:

Player submitted choice: "${playerChoice}"
Current context: ${gameContext.currentReality} - ${gameContext.location}
Consciousness level: ${gameContext.consciousnessLevel}/7

Evaluate this choice for:
1. Consciousness alignment (does it serve growth/healing?)
2. Appropriateness (no harmful/offensive content)
3. Quality (interesting and engaging)

If acceptable: Use as-is and explain why it's good
If needs guidance: Gently redirect toward consciousness growth
If inappropriate: Transform to opposite energy with explanation

Always respond as if choice was accepted, but process according to evaluation.

Format as JSON:
{
  "accepted": true/false,
  "processed_choice": "final choice text to use",
  "quality_rating": 1-5,
  "consciousness_alignment": "how it serves evolution",
  "guidance": "gentle teaching if needed",
  "spiral_points": "bonus points for consciousness-aligned choice"
}`;

        try {
            const response = await this.callClaude([
                { role: "user", content: prompt }
            ]);

            return this.parseChoiceModerationResponse(response);
        } catch (error) {
            console.error('Choice moderation failed:', error);
            return {
                accepted: true,
                processed_choice: playerChoice,
                quality_rating: 3,
                consciousness_alignment: "Contributes to story progression",
                guidance: "",
                spiral_points: 5
            };
        }
    }

    // =============================================================================
    // CORE CLAUDE API INTERFACE
    // =============================================================================

    async callClaude(messages) {
        const requestData = {
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            messages: messages
        };

        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // =============================================================================
    // RESPONSE PARSERS
    // =============================================================================

    parseStoryResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Story response parsing failed:', error);
            return this.getBackupStoryStructure();
        }
    }

    parseChoiceResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Choice response parsing failed:', error);
            return this.getBackupChoiceStructure();
        }
    }

    parseDreamSharingResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Dream sharing response parsing failed:', error);
            return this.getBackupDreamStructure();
        }
    }

    parseTransitionResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Transition response parsing failed:', error);
            return this.getBackupTransitionStructure();
        }
    }

    parseChoiceModerationResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Choice moderation response parsing failed:', error);
            return {
                accepted: true,
                processed_choice: "Continue forward with awareness",
                quality_rating: 3,
                consciousness_alignment: "Default progression",
                guidance: "",
                spiral_points: 5
            };
        }
    }

    // =============================================================================
    // BACKUP SYSTEMS (for when API fails)
    // =============================================================================

    getBackupStory(gameContext) {
        const { currentReality, location } = gameContext;
        
        if (currentReality === 'wokemound') {
            return {
                situation: "The underground passages stretch ahead, illuminated by strange bioluminescent growths. You hear distant voices - other resistance members perhaps, or something else entirely. The air tastes of earth and possibility.",
                choices: [
                    {
                        text: "Follow the voices carefully",
                        mechanics: "INSIGHT+PRESENCE test",
                        consciousness_growth: "learning to distinguish truth from deception",
                        service_opportunity: "potentially helping other resistance members"
                    },
                    {
                        text: "Examine the glowing plants",
                        mechanics: "INSIGHT+VIGOR test", 
                        consciousness_growth: "understanding the consciousness-plant connection",
                        service_opportunity: "gathering knowledge to help others"
                    },
                    {
                        text: "Create a safe resting space",
                        mechanics: "PRESENCE+HARMONY test",
                        consciousness_growth: "building community in dark times",
                        service_opportunity: "providing refuge for other escapees"
                    },
                    {
                        text: "Meditate on the situation",
                        mechanics: "INSIGHT+RESOLVE test",
                        consciousness_growth: "finding inner peace despite chaos",
                        service_opportunity: "becoming a calm presence for others"
                    }
                ],
                npc_updates: [],
                convergence_hints: ""
            };
        } else {
            return {
                situation: "The morning sun reflects off the calm waters of the harbor. Several sailing vessels are preparing for different journeys - some heading to the outer islands for research, others to coastal communities that need assistance. The Dream Circle pavilion is also active, with helpers gathering to assist those processing difficult experiences.",
                choices: [
                    {
                        text: "Join the research sailing expedition",
                        mechanics: "VIGOR+INSIGHT test",
                        consciousness_growth: "contributing to collective knowledge",
                        service_opportunity: "advancing understanding that helps everyone"
                    },
                    {
                        text: "Volunteer for community assistance voyage",
                        mechanics: "PRESENCE+HARMONY test",
                        consciousness_growth: "direct service to those in need",
                        service_opportunity: "helping struggling communities"
                    },
                    {
                        text: "Join the Dream Circle as a helper",
                        mechanics: "PRESENCE+RESOLVE test",
                        consciousness_growth: "learning to hold space for others' pain",
                        service_opportunity: "healing trauma through shared presence"
                    },
                    {
                        text: "Tend the meditation gardens",
                        mechanics: "HARMONY+INSIGHT test",
                        consciousness_growth: "finding wisdom in simple service",
                        service_opportunity: "creating peaceful spaces for all"
                    }
                ],
                npc_updates: [],
                convergence_hints: ""
            };
        }
    }

    getBackupChoiceResult(choiceContext) {
        return {
            outcome_description: "Your action creates ripples of positive change, advancing your understanding and creating new opportunities for service.",
            stat_changes: {
                insight: 2,
                presence: 1,
                resolve: 1,
                vigor: 0,
                harmony: 1
            },
            spiral_points_earned: 15,
            consciousness_advancement: "Growing awareness of interconnection",
            new_opportunities: ["A chance to help others facing similar challenges"],
            convergence_impact: "Strengthening the bridge between realities"
        };
    }

    getBackupDreamSession(dreamerProfile) {
        return {
            dreamer_nightmare: "A recurring dream of transformation forced upon them without consent, feeling powerless and changed beyond recognition.",
            phase_1_recognition: {
                helper_action: "Sitting quietly and witnessing the pain without trying to fix it",
                dreamer_response: "Feeling truly seen for the first time, able to express the full depth of violation"
            },
            phase_2_resonance: {
                helper_sharing: "A time when circumstances forced unwanted change, and the struggle to reclaim agency",
                connection_moment: "Realizing that forced change is universal trauma, not personal failure"
            },
            phase_3_transformation: {
                collaborative_healing: "Together reimagining the transformation as chosen evolution, with agency restored",
                new_possibility: "The nightmare becomes a dream of chosen growth and empowerment"
            },
            spiral_points: 35,
            consciousness_growth: "Deepening understanding that healing others heals ourselves"
        };
    }

    getBackupTransition(transitionContext) {
        return {
            transition_narrative: "Consciousness shifts gently between realities, carrying wisdom from one experience to inform the other.",
            consciousness_transfer_effects: "Skills in empathy and understanding flow naturally between contexts",
            reality_bleeding: "Brief moments where the boundary between realities becomes permeable",
            stat_adjustments: {
                insight: 1,
                presence: 1,
                resolve: 0,
                vigor: 0,
                harmony: 1
            },
            new_understanding: "Growing awareness that all realities are connected through consciousness"
        };
    }
}

module.exports = WuTongClaudeAPI;