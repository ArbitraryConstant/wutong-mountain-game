// src/utils/database-test.js
import prisma from '../database/prisma.js';

async function testDatabaseOperations() {
  try {
    console.log('?? Beginning Consciousness Evolution Database Test ??');
    
    // Generate a unique passphrase
    const passphrase = `GOLDEN_STORM_${Date.now()}`;
    
    console.log('1. Creating Player Progression...');
    const newPlayer = await prisma.createPlayerProgression({
      passphrase,
      currentReality: 'WUTONG',
      spiralPoints: 10,
      consciousnessLevel: 2
    });
    console.log('? Player Created:', newPlayer);

    console.log('2. Retrieving Player...');
    const retrievedPlayer = await prisma.findPlayerByPassphrase(passphrase);
    console.log('? Player Retrieved:', retrievedPlayer);

    console.log('3. Updating Player...');
    const updatedPlayer = await prisma.updatePlayerProgression(newPlayer.id, {
      spiralPoints: 25,
      consciousnessLevel: 3
    });
    console.log('? Player Updated:', updatedPlayer);

    console.log('4. Creating Story Fragment...');
    const storyFragment = await prisma.createStoryFragment({
      reality: 'WOKEMOUND',
      consciousnessLevel: 2,
      content: 'A mysterious journey through the roots of consciousness begins...',
      tags: ['exploration', 'mystery']
    });
    console.log('? Story Fragment Created:', storyFragment);

    console.log('?? Database Test Complete! All operations successful. ??');
  } catch (error) {
    console.error('? Consciousness Transfer Disrupted:', error);
  } finally {
    // Disconnect to prevent hanging connections
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseOperations();
