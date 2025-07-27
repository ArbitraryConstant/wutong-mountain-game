import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

async function testDatabaseConnection() {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error']
    });
    
    try {
        console.log('Attempting to connect to the database...');
        
        // Correct connection method
        await prisma.();
        
        console.log('Database connection successful!');
        
        // Try a simple query to verify connectivity
        const result = await prisma.SELECT 1 AS test;
        console.log('Query test successful:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Database connection error:', {
            message: error.message,
            code: error.code,
            name: error.name,
            fullError: error
        });
    } finally {
        try {
            await prisma.();
            console.log('Database connection closed');
        } catch (disconnectError) {
            console.error('Error closing database connection:', disconnectError);
        }
    }
}

testDatabaseConnection().catch(console.error);
