import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function comprehensiveDiagnostic() {
    console.log('=== Comprehensive System Diagnostic ===');

    // Load environment variables
    dotenv.config();

    // System Information
    console.log('Node.js Version: ' + process.version);
    console.log('Platform: ' + process.platform);
    console.log('Architecture: ' + process.arch);

    // Create Prisma client
    const prisma = new PrismaClient();

    // Perform diagnostic using native Promise
    new Promise((resolve, reject) => {
        console.log('Attempting database connection...');
        
        // Direct connection method
        prisma.()
            .then(() => {
                console.log('Database Connection:');
                console.log('Status: Successful');
                console.log('Host: ' + process.env.POSTGRES_HOST);
                console.log('Port: ' + process.env.POSTGRES_PORT);
                console.log('Database: ' + process.env.POSTGRES_DB);
                resolve();
            })
            .catch((error) => {
                console.error('Connection Failed:', error);
                reject(error);
            });
    })
    .then(() => {
        // Perform test query
        return prisma.SELECT 1 AS connection_test;
    })
    .then((result) => {
        console.log('Connection Query Result:', JSON.stringify(result));
    })
    .catch((error) => {
        console.error('Diagnostic Failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
    })
    .finally(() => {
        // Ensure disconnection
        return prisma.();
    });
}

// Run the diagnostic
comprehensiveDiagnostic();
