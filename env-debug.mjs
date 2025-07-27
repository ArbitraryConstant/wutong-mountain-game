import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

function debugEnvironment() {
    console.log('=== Environment Debug ===');
    
    // Explicitly load .env file
    const envPath = path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envPath });

    // Database-related variables to check
    const databaseVars = [
        'DATABASE_URL', 
        'POSTGRES_HOST', 
        'POSTGRES_PORT', 
        'POSTGRES_DB', 
        'POSTGRES_USER'
    ];

    console.log('Environment Variables:');
    databaseVars.forEach(function(varName) {
        var value = process.env[varName];
        console.log(varName + ': ' + (value ? value.replace(/:(.*?)@/, ':****@') : 'Not set'));
    });
}

debugEnvironment();
