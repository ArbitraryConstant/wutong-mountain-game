import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function connectionTest() {
    // Create Prisma client
    const prisma = new PrismaClient();

    try {
        console.log('Attempting database connection...');
        
        // Connect to the database
        await prisma.();
        
        console.log('Database connection successful');

        // Perform a simple query
        const result = await prisma.SELECT 1 AS connection_test;
        console.log('Connection query result:', JSON.stringify(result));
    } catch (error) {
        console.error('Connection test failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
    } finally {
        // Always disconnect
        await prisma.();
    }
}

// Immediately invoked async function
(async () => {
    try {
        await connectionTest();
    } catch (error) {
        console.error('Unhandled error:', error);
    }
})();
