import { PrismaClient } from '@prisma/client';

async function simpleTest() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Attempting connection...');
        await prisma.();
        console.log('Connection successful');
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await prisma.();
    }
}

simpleTest();
