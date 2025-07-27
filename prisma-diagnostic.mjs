import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function diagnosticCheck() {
    console.log('=== Prisma Diagnostic Check ===');
    console.log('Node.js Version:', process.version);
    console.log('Prisma Client Version:', require('@prisma/client/package.json').version);
    
    const prisma = new PrismaClient({
        log: ['error', 'warn']
    });

    try {
        console.log('\nAttempting database connection...');
        const connectionStart = Date.now();
        
        // Attempt connection using 
        await prisma.();
        
        const connectionTime = Date.now() - connectionStart;
        console.log(Connection successful (ms));

        // Test basic query
        console.log('\nRunning test query...');
        const queryStart = Date.now();
        const testResult = await prisma.SELECT 1 AS test;
        const queryTime = Date.now() - queryStart;
        
        console.log(Query executed successfully (ms));
        console.log('Test Query Result:', JSON.stringify(testResult));

        // Print database connection details
        console.log('\nDatabase Connection Details:');
        console.log('Database URL:', process.env.DATABASE_URL 
            ? process.env.DATABASE_URL.replace(/:(.*?)@/, ':****@')
            : 'No DATABASE_URL found'
        );

    } catch (error) {
        console.error('\n? Diagnostic Failed:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });
    } finally {
        try {
            await prisma.();
        } catch (disconnectError) {
            console.error('Disconnect error:', disconnectError);
        }
    }
}

diagnosticCheck().catch(console.error);
