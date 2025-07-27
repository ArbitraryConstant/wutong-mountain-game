import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

export class DatabaseConnection {
    constructor() {
        // Load environment variables
        dotenv.config();
        
        // Validate database URL
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set in the environment variables');
        }
        
        // Initialize Prisma client to null
        this.prisma = null;
        
        // Connection tracking
        this.connectionAttempts = 0;
        this.lastConnectionAttempt = null;
    }
    
    // Utility method to handle Prisma errors with more detailed logging
    _handlePrismaError(error) {
        console.error('Prisma Database Consciousness Disruption:', {
            message: error && error.message ? error.message : 'Unknown systemic interference',
            timestamp: new Date().toISOString(),
            eventType: 'database_consciousness_error',
            connectionContext: {
                attempts: this.connectionAttempts,
                lastAttempt: this.lastConnectionAttempt
            }
        });
    }
    
    // Method to establish database connection with enhanced resilience
    async connect() {
        // Increment connection attempts
        this.connectionAttempts++;
        this.lastConnectionAttempt = new Date().toISOString();
        
        try {
            // Create Prisma client with advanced configuration
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
                ],
                errorFormat: 'minimal'
            });
            
            // Set up error listener with bound method
            this.prisma.$on('error', (error) => {
                this._handlePrismaError(error);
            });
            
            // Explicitly connect with enhanced timeout and retry logic
            const connectionResult = await Promise.race([
                this.prisma.$connect(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Database connection membrane interference')), 10000)
                )
            ]);
            
            // Advanced connection verification
            try {
                await this.prisma.$queryRaw`SELECT 1`;
            } catch (verificationError) {
                console.warn('Initial query verification failed', {
                    error: verificationError.message,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Philosophical logging of connection establishment
            console.log('Consciousness Network Synchronized', {
                timestamp: new Date().toISOString(),
                connectionDetails: {
                    databaseUrl: this.maskConnectionString(process.env.DATABASE_URL),
                    attemptNumber: this.connectionAttempts
                }
            });
            
            return this.prisma;
        } catch (error) {
            // Detailed error tracking with consciousness metaphor
            console.error('Systemic Connection Disruption:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                connectionContext: {
                    attempts: this.connectionAttempts,
                    lastAttempt: this.lastConnectionAttempt
                }
            });
            
            // Reset connection attempts on failure
            this.connectionAttempts = 0;
            throw error;
        }
    }
    
    // Method to close database connection with graceful shutdown
    async disconnect() {
        if (this.prisma) {
            try {
                await this.prisma.$disconnect();
                console.log('Consciousness Network Disengaged', {
                    timestamp: new Date().toISOString(),
                    connectionContext: {
                        totalAttempts: this.connectionAttempts
                    }
                });
                
                // Reset connection tracking
                this.connectionAttempts = 0;
                this.lastConnectionAttempt = null;
            } catch (error) {
                console.error('Disruption During Network Disengagement:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
    
    // Get Prisma client instance with enhanced validation
    getPrismaClient() {
        if (!this.prisma) {
            throw new Error('Consciousness Network Not Initialized. Invoke connection protocol first.');
        }
        return this.prisma;
    }
    
    // Utility method to mask sensitive connection string information
    maskConnectionString(url) {
        if (!url) return 'No connection pathway provided';
        // Replace password in connection string with metaphorical barrier
        return url.replace(/:(.*?)@/, ':🔒@');
    }
}

// Create and export a singleton instance
const databaseConnection = new DatabaseConnection();
export default databaseConnection;