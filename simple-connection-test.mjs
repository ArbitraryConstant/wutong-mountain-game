import { PrismaClient } from '@prisma/client';

async function simpleConnectionTest() {
    const prisma = new PrismaClient();

    try {
        console.log('Starting connection test...');
        await prisma.();
        console.log('Connection successful');
        
        const result = await prisma.SELECT 1 AS connection_test;
        console.log('Query test passed:', result);
    } catch (error) {
        console.error('Connection test failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
    } finally {
        await prisma.();
    }
}

simpleConnectionTest().catch(console.error);
