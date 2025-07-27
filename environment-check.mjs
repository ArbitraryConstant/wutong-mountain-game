import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

function environmentCheck() {
    console.log('=== Environment Configuration Check ===');

    // Manually read .env file
    try {
        var envPath = path.resolve(process.cwd(), '.env');
        var envContent = fs.readFileSync(envPath, 'utf8');
        
        console.log('Environment File Exists');
        console.log('File Size:', envContent.length + ' bytes');
        
        // Load environment variables
        dotenv.config();

        // Check specific variables
        var criticalVars = [
            'DATABASE_URL', 
            'POSTGRES_HOST', 
            'POSTGRES_PORT', 
            'POSTGRES_DB'
        ];

        console.log('\nCritical Environment Variables:');
        criticalVars.forEach(function(varName) {
            var value = process.env[varName];
            console.log(varName + ': ' + (value ? 'Set' : 'Not Set'));
        });
    } catch (error) {
        console.error('Environment check failed:', error.message);
    }
}

environmentCheck();
