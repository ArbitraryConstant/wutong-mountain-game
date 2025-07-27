import databaseConnection from './connections.js';

// Ensure the database connection is established before exporting the Prisma client
const prismaClient = async () => {
    try {
        // Ensure connection is established
        await databaseConnection.connect();
        
        // Return the Prisma client instance
        return databaseConnection.getPrismaClient();
    } catch (error) {
        console.error('Failed to initialize Prisma client:', error);
        throw error;
    }
};

// Export the Prisma client as a promise
export default prismaClient();
