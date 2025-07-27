import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

function debugPrismaSetup() {
    console.log('=== Prisma Low-Level Debugging ===');

    // Load environment variables
    dotenv.config();

    // Create Prisma client
    var prisma = new PrismaClient();

    // Perform connection test using direct promise
    Promise.resolve()
        .then(function() {
            // Directly call  without assignment
            return prisma.();
        })
        .then(function() {
            console.log('Database Connection:');
            console.log('Status: Successful');
            console.log('Host: ' + process.env.POSTGRES_HOST);
            console.log('Port: ' + process.env.POSTGRES_PORT);
            console.log('Database: ' + process.env.POSTGRES_DB);

            // Perform test query
            return prisma.SELECT 1 AS connection_test;
        })
        .then(function(result) {
            console.log('Connection Query Result:', JSON.stringify(result));
        })
        .catch(function(error) {
            console.error('Diagnostic Failed:', {
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
debugPrismaSetup();
