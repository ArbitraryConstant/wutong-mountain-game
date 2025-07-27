import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function connectionTest() {
    console.log('=== Prisma Connection Test ===');
    
    // Load environment variables
    dotenv.config();
    
    // Create Prisma client
    var prisma = new PrismaClient();
    
    // Perform connection test using promise chain
    Promise.resolve()
        .then(function() {
            // Directly call 
            return prisma.();
        })
        .then(function() {
            console.log('Database connection successful');
            
            // Perform test query
            return prisma.SELECT 1 AS connection_test;
        })
        .then(function(result) {
            console.log('Connection query result:', JSON.stringify(result));
        })
        .catch(function(error) {
            console.error('Connection test failed:', {
                message: error.message,
                name: error.name,
                code: error.code
            });
        })
        .finally(function() {
            // Ensure disconnection
            return prisma.();
        });
}

// Immediately invoke the function
connectionTest();
