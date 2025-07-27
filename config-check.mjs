import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

function configCheck() {
    console.log('=== Configuration Check ===');

    // Load environment variables
    dotenv.config();

    // Check package.json
    try {
        var packagePath = path.join(process.cwd(), 'package.json');
        var packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        console.log('Project Name: ' + packageContent.name);
        console.log('Node Engine Requirement: ' + (packageContent.engines?.node || 'Not specified'));
    } catch (error) {
        console.error('Package.json read error:', error.message);
    }

    // Check Prisma schema
    try {
        var schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
        var schemaContent = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('\nPrisma Schema:');
        var providerMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
        console.log('Provider: ' + (providerMatch ? providerMatch[1] : 'Not found'));
    } catch (error) {
        console.error('Schema file read error:', error.message);
    }

    // Environment variables check
    console.log('\nCritical Environment Variables:');
    var criticalVars = [
        'DATABASE_URL', 
        'POSTGRES_HOST', 
        'POSTGRES_PORT', 
        'POSTGRES_DB'
    ];

    criticalVars.forEach(function(varName) {
        var value = process.env[varName];
        console.log(varName + ': ' + (value ? 'Set' : 'Not Set'));
    });
}

// Immediately invoke the function
configCheck();
