// src/database/prisma.js
import { PrismaClient } from '@prisma/client';

// Extend PrismaClient with custom methods for WuTong Mountain game
class ExtendedPrismaClient extends PrismaClient {
  // Method to create a new player progression
  async createPlayerProgression(data) {
    try {
      return await this.playerProgression.create({ data });
    } catch (error) {
      console.error('Error creating player progression:', error);
      throw error;
    }
  }

  // Method to find a player by passphrase
  async findPlayerByPassphrase(passphrase) {
    try {
      return await this.playerProgression.findUnique({ 
        where: { passphrase } 
      });
    } catch (error) {
      console.error('Error finding player:', error);
      throw error;
    }
  }

  // Method to update player progression
  async updatePlayerProgression(id, data) {
    try {
      return await this.playerProgression.update({
        where: { id },
        data
      });
    } catch (error) {
      console.error('Error updating player progression:', error);
      throw error;
    }
  }

  // Method to create a story fragment
  async createStoryFragment(data) {
    try {
      return await this.storyFragment.create({ data });
    } catch (error) {
      console.error('Error creating story fragment:', error);
      throw error;
    }
  }
}

// Singleton pattern to prevent multiple client instances
const prisma = new ExtendedPrismaClient();

export default prisma;
