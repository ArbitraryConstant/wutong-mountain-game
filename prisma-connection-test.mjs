import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runConnectionTest() {
    const prisma = new PrismaClient();

    try {
        console.log('=== Prisma Connection Test ===');
        
        console.log('Attempting to connect to the database...');
        
        // Explicit connection without any additional method calls
        await prisma.();
        
        console.log('Database connection successful');
        
        // Simple query test
        console.log('Running connection verification query...');
        const result = await prisma.SELECT 1 AS connection_test;
        console.log('Connection query result:', JSON.stringify(result));
        
        // Database details
        console.log('\nDatabase Connection Details:');
        console.log('Host:', process.env.POSTGRES_HOST);
        console.log('Port:', process.env.POSTGRES_PORT);
        console.log('Database:', process.env.POSTGRES_DB);
    } catch (error) {
        console.error('Connection test failed:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });
    } finally {
        // Ensure disconnection
        await prisma.();
    }
}

// Immediately invoke the async function
runConnectionTest();
