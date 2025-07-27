import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function checkImports() {
    console.log('=== Module Import Check ===');
    
    try {
        console.log('Prisma Client imported successfully');
        console.log('Prisma Client type:', typeof PrismaClient);
        
        console.log('\nEnvironment Variables:');
        dotenv.config();
        
        var databaseVars = [
            'DATABASE_URL', 
            'POSTGRES_HOST', 
            'POSTGRES_PORT', 
            'POSTGRES_DB'
        ];
        
        for (var i = 0; i < databaseVars.length; i++) {
            var varName = databaseVars[i];
            var value = process.env[varName];
            console.log(varName + ': ' + (value ? value.replace(/:(.*?)@/, ':****@') : 'Not set'));
        }
    } catch (error) {
        console.error('Import or configuration error:', error);
    }
}

checkImports();
