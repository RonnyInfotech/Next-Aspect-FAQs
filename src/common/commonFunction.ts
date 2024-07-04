import CryptoJS from 'crypto-js';

// Function to generate a formatted 25-character key from a passphrase
export const generateFormattedKeyFromPassphrase = (passphrase) => {
    const hash = CryptoJS.SHA256(passphrase).toString(CryptoJS.enc.Hex);
    const formattedKey = hash.slice(0, 25).match(/.{1,5}/g).join('-'); // Add hyphen after every 5 characters
    return formattedKey;
};