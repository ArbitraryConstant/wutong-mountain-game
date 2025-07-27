import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

function comprehensiveDiagnostic() {
    console.log('=== Comprehensive System Diagnostic ===');

    // Load environment variables
    dotenv.config();

    // System Information
    console.log('Node.js Version:', process.version);
    console.log('Platform:', process.platform);
    console.log('Architecture:', process.arch);

    // Prisma Client Information
    function getPrismaClientInfo() {
        try {
            const prismaPackagePath = path.join(
                path.dirname(require.resolve('@prisma/client')), 
                'package.json'
            );
            const prismaPackage = require(prismaPackagePath);
            return prismaPackage.version;
        } catch (error) {
            console.error('Could not read Prisma package version:', error);
            return 'Unknown';
        }
    }
    console.log('Prisma Client Version:', getPrismaClientInfo());

    // Create Prisma client
    const prisma = new PrismaClient();

    // Connection and diagnostic function
    function performDatabaseDiagnostic() {
        return new Promise((resolve, reject) => {
            try {
                // Attempt connection
                Promise.resolve(prisma.())
                    .then(() => {
                        console.log('\nDatabase Connection:');
                        console.log('Status: Successful');
                        console.log('Host:', process.env.POSTGRES_HOST);
                        console.log('Port:', process.env.POSTGRES_PORT);
                        console.log('Database:', process.env.POSTGRES_DB);

                        // Perform test query
                        return prisma.SELECT 1 AS connection_test;
                    })
                    .then((result) => {
                        console.log('Connection Query Result:', JSON.stringify(result));
                        resolve();
                    })
                    .catch((error) => {
                        console.error('Diagnostic Failed:', {
                            message: error.message,
                            name: error.name,
                            code: error.code
                        });
                        reject(error);
                    });
            } catch (error) {
                console.error('Diagnostic setup error:', error);
                reject(error);
            }
        });
    }

    // Run diagnostic and ensure disconnection
    performDatabaseDiagnostic()
        .finally(() => {
            return prisma.();
        });
}

// Immediately invoke the diagnostic function
comprehensiveDiagnostic();
