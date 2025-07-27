import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

async function diagnosticPrismaConnection() {
    // Load environment variables
    dotenv.config();

    console.log('Initializing Prisma Diagnostic');
    console.log('Node.js Version: ' + process.version);

    try {
        // Create Prisma Client
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });

        console.log('Database URL: ' + (process.env.DATABASE_URL || 'Not configured'));

        // Attempt to check player count
        const playerCount = await prisma.playerProgression.count();
        
        console.log('Database Connection Successful');
        console.log('Total Players: ' + playerCount);

    } catch (error) {
        console.error('Database Connection Failed');
        console.error('Error Name: ' + error.name);
        console.error('Error Message: ' + error.message);
        
        if (error.code) {
            console.error('Error Code: ' + error.code);
        }
    }
}

// Run the diagnostic
diagnosticPrismaConnection()
    .catch(error => {
        console.error('Unhandled Error: ' + error);
        process.exit(1);
    });
