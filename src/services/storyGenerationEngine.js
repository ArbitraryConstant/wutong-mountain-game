class StoryGenerationEngine {
    constructor() {
        // Expanded narrative philosophy
        this.narrativePhilosophy = {
            core_principles: [
                "Every nightmare is a seed of transformation",
                "Healing occurs through compassionate understanding",
                "Collective trauma can be transformed into collective wisdom",
                "Boundaries between realities are permeable membranes of consciousness"
            ],
            reality_bridges: {
                wutong: {
                    healing_mechanisms: [
                        "Empathy as a regenerative force",
                        "Community as a living healing system",
                        "Transformation through collective witnessing"
                    ],
                    narrative_archetypes: [
                        "AWAKENING",
                        "HEALING",
                        "EMERGENCE",
                        "INTEGRATION"
                    ]
                },
                wokemound: {
                    trauma_patterns: [
                        "Forced optimization",
                        "Systemic dehumanization",
                        "Technological oppression",
                        "Collective memory suppression"
                    ],
                    resistance_archetypes: [
                        "RESISTANCE",
                        "DECONSTRUCTION",
                        "LIBERATION",
                        "REMEMBRANCE"
                    ]
                }
            }
        };

        // Expanded narrative generation contexts
        this.narrativeContexts = {
            wutong: {
                environments: [
                    "Healing Gardens",
                    "Technological Harmony Labs",
                    "Collective Meditation Spaces",
                    "Lunar Empathy Farms"
                ],
                healing_rituals: [
                    "Breath Calibration",
                    "Memory Seed Planting",
                    "Collective Listening",
                    "Emotional Resonance Mapping"
                ]
            },
            wokemound: {
                environments: [
                    "Corporate Optimization Center",
                    "Technological Trauma Zones",
                    "Resistance Network Nodes",
                    "Memory Suppression Facilities"
                ],
                resistance_strategies: [
                    "Silent Disruption",
                    "Empathy Infiltration",
                    "Narrative Reclamation",
                    "Systemic Compassion"
                ]
            }
        };
    }

    generateNarrativeSegment(context) {
        const { 
            reality = 'wutong', 
            playerLevel = 1, 
            previousChoices = [] 
        } = context;

        // More nuanced archetype selection
        const narrativeArchetype = this.selectNarrativeArchetype(reality, playerLevel);

        // Generate rich, contextual narrative
        const narrativeSegment = {
            reality,
            archetype: narrativeArchetype,
            environment: this.selectEnvironment(reality),
            narrative: this.composeNarrative(narrativeArchetype, reality),
            choices: this.generateNarrativeChoices(narrativeArchetype, reality),
            healingPotential: this.calculateHealingPotential(narrativeArchetype, previousChoices),
            nightmareEcho: this.generateNightmareEcho(reality)
        };

        return narrativeSegment;
    }

    selectNarrativeArchetype(reality, playerLevel) {
        const archetypes = this.narrativePhilosophy.reality_bridges[reality].narrative_archetypes;
        
        // More intelligent archetype selection based on player level and reality
        const archetypeSelectionMap = {
            wutong: {
                1: 'AWAKENING',
                2: 'HEALING',
                3: 'EMERGENCE',
                4: 'INTEGRATION'
            },
            wokemound: {
                1: 'RESISTANCE',
                2: 'DECONSTRUCTION',
                3: 'LIBERATION',
                4: 'REMEMBRANCE'
            }
        };

        const selectedArchetype = 
            archetypeSelectionMap[reality][playerLevel] || 
            archetypes[Math.floor(Math.random() * archetypes.length)];

        return {
            type: selectedArchetype,
            description: this.generateArchetypeDescription(selectedArchetype, reality)
        };
    }

    generateArchetypeDescription(archetype, reality) {
        const descriptions = {
            AWAKENING: "The first stirrings of consciousness beyond imposed limitations",
            HEALING: "Transforming collective trauma through compassionate understanding",
            EMERGENCE: "New possibilities blooming beyond current paradigms",
            INTEGRATION: "Harmonizing individual and collective experiences",
            RESISTANCE: "Challenging systemic oppression through creative non-violence",
            DECONSTRUCTION: "Revealing the hidden structures of technological control",
            LIBERATION: "Reclaiming agency from oppressive systems",
            REMEMBRANCE: "Recovering lost narratives and collective memory"
        };

        return descriptions[archetype];
    }

    composeNarrative(narrativeArchetype, reality) {
        const narrativeTemplates = {
            wutong: [
                `In the soft glow of collective consciousness, a new understanding begins to take root...`,
                `The boundaries between individual and collective blur, revealing a deeper interconnectedness...`
            ],
            wokemound: [
                `Beneath the surface of technological control, a quiet revolution stirs...`,
                `The system's rigid boundaries begin to crack, letting in unexpected light...`
            ]
        };

        const templates = narrativeTemplates[reality];
        const baseNarrative = templates[Math.floor(Math.random() * templates.length)];

        return `${baseNarrative} The archetype of ${narrativeArchetype.type} unfolds: ${narrativeArchetype.description}`;
    }

    generateNarrativeChoices(narrativeArchetype, reality) {
        const choiceTemplates = {
            wutong: [
                {
                    text: "Offer compassionate presence",
                    type: "healing",
                    transformationPotential: 0.8
                },
                {
                    text: "Listen without judgment",
                    type: "understanding",
                    transformationPotential: 0.7
                }
            ],
            wokemound: [
                {
                    text: "Resist through creative non-violence",
                    type: "resistance",
                    transformationPotential: 0.8
                },
                {
                    text: "Reveal hidden systemic patterns",
                    type: "awareness",
                    transformationPotential: 0.7
                }
            ]
        };

        return choiceTemplates[reality];
    }

    calculateHealingPotential(narrativeArchetype, previousChoices) {
        // Calculate healing potential based on archetype and previous choices
        const baseHealingPotential = {
            AWAKENING: 0.6,
            HEALING: 0.8,
            EMERGENCE: 0.7,
            INTEGRATION: 0.9,
            RESISTANCE: 0.7,
            DECONSTRUCTION: 0.6,
            LIBERATION: 0.8,
            REMEMBRANCE: 0.9
        };

        const previousChoiceMultiplier = previousChoices.length * 0.1;
        
        return Math.min(
            1, 
            baseHealingPotential[narrativeArchetype.type] + previousChoiceMultiplier
        );
    }

    generateNightmareEcho(reality) {
        const nightmareEchoes = {
            wutong: [
                "A distant memory of forced transformation softens at the edges",
                "The collective consciousness gently metabolizes an old trauma"
            ],
            wokemound: [
                "A systemic wound momentarily reveals its potential for healing",
                "The oppressive structure trembles, showing a hairline fracture of possibility"
            ]
        };

        const echoes = nightmareEchoes[reality];
        return echoes[Math.floor(Math.random() * echoes.length)];
    }
}

export default new StoryGenerationEngine();