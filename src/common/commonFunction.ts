import CryptoJS from 'crypto-js';

// Function to generate a formatted 25-character key from a passphrase
export const generateFormattedKeyFromPassphrase = (passphrase) => {
    const hash = CryptoJS.SHA256(passphrase).toString(CryptoJS.enc.Hex);
    const formattedKey = hash.slice(0, 25).match(/.{1,5}/g).join('-'); // Add hyphen after every 5 characters
    return formattedKey;
};

export const generateFaqData = (categories, faqs) => {
    return categories.map(category => {
        return {
            categoryId: category.ID,
            category: category.Title,
            section: `${category.Title} Questions`,
            questions: faqs
                .filter(faq => faq.CategoryId === category.ID && faq.Active == true)
                .map(faq => {
                    return {
                        question: faq.Title,
                        answer: faq.Content,
                        Created: faq.Created
                    };
                })
        };
    });
};