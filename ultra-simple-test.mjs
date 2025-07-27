import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Attempting connection...');
        
        // Directly connect without additional method call
        await prisma.();
        
        console.log('Connection successful');
    } catch (error) {
        console.error('Connection error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });
    } finally {
        await prisma.();
    }
}

main().catch(console.error);
