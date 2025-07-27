import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Colorful console logging utility
const ConsoleColors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgRed: "\x1b[31m",
    FgBlue: "\x1b[34m"
};

// Validation function for database connection URL
function validateDatabaseURL(url) {
    try {
        const parsedUrl = new URL(url);
        const checks = {
            protocol: parsedUrl.protocol === 'postgresql:',
            hasCredentials: parsedUrl.username && parsedUrl.password,
            hasHost: parsedUrl.hostname,
            hasPort: parsedUrl.port,
            hasPath: parsedUrl.pathname && parsedUrl.pathname !== '/'
        };

        return {
            isValid: Object.values(checks).every(Boolean),
            details: checks
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message
        };
    }
}

// Main verification function
function verifyEnvironment() {
    console.log(ConsoleColors.Bright + '🌈 WuTong Mountain Environment Verification 🌈' + ConsoleColors.Reset);
    console.log('-------------------------------------------');

    // Basic environment checks
    console.log(ConsoleColors.FgBlue + 'Basic Environment:' + ConsoleColors.Reset);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || ConsoleColors.FgYellow + 'Not Set' + ConsoleColors.Reset}`);

    // Database Configuration Verification
    console.log('\n' + ConsoleColors.FgBlue + 'Database Configuration:' + ConsoleColors.Reset);

    // Validate DATABASE_URL
    const databaseUrlValidation = validateDatabaseURL(process.env.DATABASE_URL);
    console.log('Database URL: ' +
        (databaseUrlValidation.isValid
            ? ConsoleColors.FgGreen + '✓ Valid' + ConsoleColors.Reset
            : ConsoleColors.FgRed + '✗ Invalid' + ConsoleColors.Reset
        )
    );

    // Detailed database configuration
    console.log('\nDatabase Connection Details:');
    console.log(`Host: ${process.env.POSTGRES_HOST}`);
    console.log(`Port: ${process.env.POSTGRES_PORT}`);
    console.log(`Database: ${process.env.POSTGRES_DB}`);
    console.log(`User: ${process.env.POSTGRES_USER}`);

    // Detailed URL validation
    if (!databaseUrlValidation.isValid) {
        console.log(ConsoleColors.FgRed + '\nDatabase URL Validation Errors:' + ConsoleColors.Reset);
        Object.entries(databaseUrlValidation.details || {}).forEach(([key, value]) => {
            console.log(`- ${key}: ${value ? '✓' : '✗'}`);
        });
    }

    // Security and Sensitivity Check
    console.log('\n' + ConsoleColors.FgBlue + 'Security Considerations:' + ConsoleColors.Reset);
    const sensitiveVars = [
        'CLAUDE_API_KEY',
        'JWT_SECRET',
        'ENCRYPTION_KEY',
        'API_SECRET_KEY'
    ];

    sensitiveVars.forEach(varName => {
        const value = process.env[varName];
        console.log(`${varName}: ${value ? ConsoleColors.FgYellow + 'Sensitive Variable Detected' + ConsoleColors.Reset : ConsoleColors.FgGreen + 'Not Set' + ConsoleColors.Reset}`);
    });

    // Feature Flags
    console.log('\n' + ConsoleColors.FgBlue + 'Feature Flags:' + ConsoleColors.Reset);
    const featureFlags = [
        'FEATURE_NARRATIVE_ANALYTICS_ENABLED',
        'FEATURE_TRAUMA_TRANSFORMATION_ENABLED',
        'FEATURE_COLLECTIVE_MEMORY_ENABLED'
    ];

    featureFlags.forEach(flag => {
        console.log(`${flag}: ${process.env[flag] || ConsoleColors.FgYellow + 'Not Configured' + ConsoleColors.Reset}`);
    });

    console.log('\n' + ConsoleColors.Bright + '🌟 Environment Verification Complete 🌟' + ConsoleColors.Reset);
}

// Run the verification
verifyEnvironment();