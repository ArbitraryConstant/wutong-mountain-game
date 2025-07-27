import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function runDatabaseTest() {
    console.log('=== Database Connection Test ===');
    
    // Load environment variables
    dotenv.config();
    
    // Create Prisma client
    const prisma = new PrismaClient();

    // Perform connection test using native Promise
    new Promise((resolve, reject) => {
        console.log('Attempting database connection...');
        
        // Explicitly use  method
        prisma.()
            .then(() => {
                console.log('Database connection successful');
                resolve();
            })
            .catch((error) => {
                console.error('Connection failed:', error);
                reject(error);
            });
    })
    .then(() => {
        // Perform a test query
        return prisma.SELECT 1 AS connection_test;
    })
    .then((result) => {
        console.log('Connection query result:', JSON.stringify(result));
    })
    .catch((error) => {
        console.error('Test failed:', {
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

// Run the test
runDatabaseTest();
