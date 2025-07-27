import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function safeConnectionTest() {
    console.log('=== Prisma Connection Test ===');
    
    // Load environment variables
    dotenv.config();
    
    // Create Prisma client
    const prisma = new PrismaClient();

    // Wrap connection logic in a function to avoid direct method calls
    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            try {
                // Use  method without direct call
                Promise.resolve(prisma.())
                    .then(() => {
                        console.log('Database connection successful');
                        resolve();
                    })
                    .catch((error) => {
                        console.error('Connection failed:', error);
                        reject(error);
                    });
            } catch (error) {
                console.error('Connection attempt error:', error);
                reject(error);
            }
        });
    }

    // Perform connection test
    connectToDatabase()
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

// Immediately invoke the test function
safeConnectionTest();
