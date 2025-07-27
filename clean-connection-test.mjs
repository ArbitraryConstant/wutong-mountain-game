import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function connectionTest() {
    // Create Prisma client
    const prisma = new PrismaClient({
        log: ['error', 'warn']
    });

    try {
        console.log('Attempting database connection...');
        
        // Connect to the database
        await prisma.();
        
        console.log('Database connection successful');

        // Perform a simple query
        const result = await prisma.SELECT 1 AS connection_test;
        console.log('Connection query result:', result);

        // Additional diagnostic information
        console.log('\nConnection Details:');
        console.log('Database Host:', process.env.POSTGRES_HOST);
        console.log('Database Port:', process.env.POSTGRES_PORT);
        console.log('Database Name:', process.env.POSTGRES_DB);
    } catch (error) {
        console.error('Connection test failed:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });
    } finally {
        // Always disconnect
        await prisma.();
    }
}

// Run the connection test
connectionTest().catch(console.error);
