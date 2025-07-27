import prisma from './src/database/prisma.js';

async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');

        // Attempt a simple, safe database operation
        const playerCount = await prisma.playerProgression.count();

        console.log(Successfully connected to database.);
        console.log(Total players: );
    } catch (error) {
        console.error('Database connection test failed:', error);
        
        // Log more detailed error information
        console.error('Error Details:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Full Error:', error);
    } finally {
        // Always disconnect to prevent connection leaks
        await prisma.();
    }
}

testDatabaseConnection().catch(console.error);
