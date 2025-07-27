import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Attempting to connect to the database...');
        await prisma.();
        console.log('Database connection successful!');
        
        // Try a simple query to verify connectivity
        const result = await prisma.SELECT 1 AS test;
        console.log('Query test successful:', result);
    } catch (error) {
        console.error('Database connection error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
    } finally {
        await prisma.();
    }
}

testDatabaseConnection();
