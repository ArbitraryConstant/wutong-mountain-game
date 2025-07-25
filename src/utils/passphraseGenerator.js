// src/utils/passphraseGenerator.js

/**
 * Generate a unique, meaningful passphrase
 * @returns {string} A unique passphrase
 */
export const generateUniquePassphrase = () => {
    const adjectives = [
        'silver', 'golden', 'quiet', 'wise', 'gentle', 'radiant', 
        'peaceful', 'mystic', 'ancient', 'luminous', 'serene'
    ];
    
    const nouns = [
        'moon', 'star', 'river', 'mountain', 'light', 'wind', 
        'harmony', 'crystal', 'dawn', 'horizon', 'whisper'
    ];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const timestamp = Date.now();
    
    return ${randomAdjective}--;
};

/**
 * Validate a passphrase format
 * @param {string} passphrase - Passphrase to validate
 * @returns {boolean} Whether the passphrase is valid
 */
export const validatePassphrase = (passphrase) => {
    if (!passphrase || typeof passphrase !== 'string') {
        return false;
    }

    // Regex to match format: word-word-number
    const passphraseRegex = /^[a-z]+-[a-z]+-\d+$/;
    return passphraseRegex.test(passphrase);
};

/**
 * Generate a player identification object
 * @param {string} passphrase - Player's passphrase
 * @returns {Object} Player identification details
 */
export const generatePlayerIdentification = (passphrase) => {
    return {
        passphrase,
        createdAt: new Date().toISOString(),
        identificationHash: Buffer.from(passphrase).toString('base64')
    };
};

export default {
    generateUniquePassphrase,
    validatePassphrase,
    generatePlayerIdentification
};
