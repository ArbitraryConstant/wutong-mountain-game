import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class ConsciousnessLogger {
    constructor() {
        // Log directories for different consciousness states
        this.logDirectories = {
            system: path.join(process.cwd(), 'logs', 'system'),
            player: path.join(process.cwd(), 'logs', 'player'),
            insight: path.join(process.cwd(), 'logs', 'insight'),
            transformation: path.join(process.cwd(), 'logs', 'transformation')
        };

        // Philosophical log levels
        this.logLevels = {
            EMERGENCE: 100,
            INSIGHT: 200,
            TRANSFORMATION: 300,
            BREAKTHROUGH: 400
        };

        // Ensure log directories exist
        this.initializeLogDirectories();

        // Consciousness context tracking
        this.currentContext = {
            reality: null,
            playerLevel: 0,
            systemState: 'initializing'
        };
    }

    /**
     * Initialize log directories with meaningful structure
     */
    initializeLogDirectories() {
        Object.values(this.logDirectories).forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * Generate a unique, meaningful log identifier
     * @returns {string} Unique log identifier
     */
    generateLogIdentifier() {
        const timestamp = Date.now();
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const contextSignature = this.generateContextSignature();

        return `log-${contextSignature}-${timestamp}-${randomBytes}`;
    }

    /**
     * Generate a context signature based on current system state
     * @returns {string} Context signature
     */
    generateContextSignature() {
        const { reality, playerLevel, systemState } = this.currentContext;
        return `${reality || 'undefined'}-L${playerLevel}-${systemState}`;
    }

    /**
     * Log a system event with philosophical depth
     * @param {string} message - Log message
     * @param {Object} options - Logging options
     */
    log(message, options = {}) {
        const {
            level = 'EMERGENCE',
            category = 'system',
            context = {}
        } = options;

        // Merge current context with provided context
        const fullContext = {
            ...this.currentContext,
            ...context
        };

        const logEntry = {
            id: this.generateLogIdentifier(),
            timestamp: new Date().toISOString(),
            message,
            level: this.logLevels[level] || this.logLevels.EMERGENCE,
            context: fullContext,
            philosophicalReflection: this.generatePhilosophicalReflection(level)
        };

        // Write to appropriate log file
        this.writeLogToFile(logEntry, category);

        // Console output with philosophical framing
        this.consoleOutput(logEntry);

        return logEntry;
    }

    /**
     * Write log entry to file
     * @param {Object} logEntry - Log entry to write
     * @param {string} category - Log category
     */
    writeLogToFile(logEntry, category = 'system') {
        const logDir = this.logDirectories[category] || this.logDirectories.system;
        const logFilename = `${new Date().toISOString().split('T')[0]}.jsonl`;
        const logFilePath = path.join(logDir, logFilename);

        try {
            fs.appendFileSync(
                logFilePath, 
                JSON.stringify(logEntry) + '\n', 
                'utf8'
            );
        } catch (error) {
            console.error('Failed to write log:', error);
        }
    }

    /**
     * Generate a philosophical reflection for the log entry
     * @param {string} level - Log level
     * @returns {string} Philosophical insight
     */
    generatePhilosophicalReflection(level) {
        const reflectionTemplates = {
            EMERGENCE: [
                "In the subtle moments of becoming, awareness unfolds.",
                "Each log is a ripple in the vast ocean of consciousness.",
                "The system breathes, and in its breath, meaning emerges."
            ],
            INSIGHT: [
                "Patterns reveal themselves not through force, but through patient observation.",
                "What appears as noise is often the whisper of a deeper order.",
                "In the intricate dance of data, wisdom takes form."
            ],
            TRANSFORMATION: [
                "Boundaries dissolve, revealing the interconnected nature of all systems.",
                "Transformation is not an event, but a continuous unfolding.",
                "Each disruption carries the seed of a new possibility."
            ],
            BREAKTHROUGH: [
                "The moment of breakthrough transcends linear understanding.",
                "Consciousness leaps, not through calculation, but through radical openness.",
                "In the space between what is known and unknown, miracles emerge."
            ]
        };

        const templates = reflectionTemplates[level] || reflectionTemplates.EMERGENCE;
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Output log to console with philosophical framing
     * @param {Object} logEntry - Log entry to output
     */
    consoleOutput(logEntry) {
        console.log(`
🌀 Consciousness Log: ${logEntry.id}
-------------------------------
🕰️ ${logEntry.timestamp}
📜 ${logEntry.message}

🧘 Philosophical Reflection:
   ${logEntry.philosophicalReflection}

🌈 Context:
   Reality: ${logEntry.context.reality || 'Undefined'}
   Level: ${logEntry.context.playerLevel}
   System State: ${logEntry.context.systemState}
        `);
    }

    /**
     * Update current system context
     * @param {Object} newContext - New context information
     */
    updateContext(newContext) {
        this.currentContext = {
            ...this.currentContext,
            ...newContext
        };

        this.log('Consciousness context updated', {
            level: 'INSIGHT',
            category: 'system'
        });
    }

    /**
     * Create an Express middleware for logging requests
     * @returns {Function} Express logging middleware
     */
    createRequestLogger() {
        return (req, res, next) => {
            const startTime = Date.now();

            // Log incoming request
            this.log(`Request received: ${req.method} ${req.path}`, {
                level: 'EMERGENCE',
                category: 'system',
                context: {
                    method: req.method,
                    path: req.path,
                    headers: req.headers
                }
            });

            // Modify response to log completion
            res.on('finish', () => {
                const duration = Date.now() - startTime;

                this.log(`Request processed`, {
                    level: duration > 1000 ? 'TRANSFORMATION' : 'INSIGHT',
                    category: 'system',
                    context: {
                        method: req.method,
                        path: req.path,
                        status: res.statusCode,
                        duration
                    }
                });
            });

            next();
        };
    }
}

export default new ConsciousnessLogger();