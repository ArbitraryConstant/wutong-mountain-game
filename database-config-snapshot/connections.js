import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

class DatabaseConnection {
    constructor() {
        // Load environment variables
        dotenv.config();

        // Validate database URL
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set in the environment variables');
        }

        // Initialize Prisma client to null
        this.prisma = null;
    }

    // Utility method to handle Prisma errors
    _handlePrismaError(error) {
        console.error('Prisma Database Error:', {
            message: error && error.message ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            eventType: 'database_error'
        });
    }

    // Method to establish database connection
    async connect() {
        try {
            // Create Prisma client with configuration
            this.prisma = new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL
                    }
                },
                log: [
                    { level: 'query', emit: 'event' },
                    { level: 'error', emit: 'stdout' },
                    { level: 'info', emit: 'stdout' },
                    { level: 'warn', emit: 'stdout' }
                ]
            });

            // Set up error listener using separate method
            this.prisma.$on('error', this._handlePrismaError.bind(this));

            // Explicitly connect with a timeout
            await Promise.race([
                this.prisma.$connect(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Database connection timeout')), 10000)
                )
            ]);

            console.log('Database connection established successfully', {
                timestamp: new Date().toISOString(),
                connectionDetails: {
                    databaseUrl: this.maskConnectionString(process.env.DATABASE_URL)
                }
            });

            return this.prisma;
        } catch (error) {
            console.error('Failed to connect to the database:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    // Method to close database connection
    async disconnect() {
        if (this.prisma) {
            try {
                await this.prisma.$disconnect();
                console.log('Database connection closed', {
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error closing database connection:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }

    // Get Prisma client instance
    getPrismaClient() {
        if (!this.prisma) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.prisma;
    }

    // Utility method to mask sensitive connection string information
    maskConnectionString(url) {
        if (!url) return 'No URL provided';
        // Replace password in connection string with asterisks
        return url.replace(/:(.*?)@/, ':****@');
    }
}

// Export a singleton instance
export default new DatabaseConnection();