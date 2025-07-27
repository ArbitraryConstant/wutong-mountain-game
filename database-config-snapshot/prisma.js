import DatabaseConnection from './connections.js';

// Export the Prisma client from the DatabaseConnection
export default DatabaseConnection.getPrismaClient();
