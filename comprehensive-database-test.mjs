import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

async function runComprehensiveDiagnostics() {
    console.log('Starting Comprehensive Database Diagnostics');
    console.log('Node.js Version:', process.version);
    
    const prisma = new PrismaClient({
        log: ['error', 'warn']
    });

    try {
        // Environment Check
        console.log('Environment Variables:');
        console.log('DATABASE_URL:', 
            process.env.DATABASE_URL 
                ? process.env.DATABASE_URL.replace(/:(.*?)@/, ':****@')
                : 'Not set'
        );

        // Connection Attempt
        console.log('\nAttempting to connect to the database...');
        const connectStart = Date.now();
        
        // Correct connection method
        await prisma.();
        
        console.log(Database connection successful (ms));

        // Query Verification
        console.log('\nRunning connectivity test query...');
        const queryStart = Date.now();
        const result = await prisma.SELECT 1 AS test;
        console.log(Query test successful (ms));
        console.log('Query Result:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('\n? Diagnostic Failed:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
    } finally {
        try {
            await prisma.();
            console.log('\n? Database connection closed');
        } catch (disconnectError) {
            console.error('Error closing database connection:', disconnectError);
        }
    }
}

runComprehensiveDiagnostics().catch(console.error);
