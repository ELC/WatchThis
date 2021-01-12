let adjectives = require('../../public/adjectives.json');
let names = require('../../public/names.json');

// Extracted from https://github.com/MaPhil/username-generator

export default class RandomUserName {
    
    static getRandomUserName() {
        const nameIndex = Math.floor(Math.random() * names.length);
        const adjectiveIndex = Math.floor(Math.random() * adjectives.length);
        const suffix = Math.floor(Math.random() * 100);

        console.log(names.length);
        console.log(adjectives.length);
        console.log(names.length * adjectives.length);
        
        return `${adjectives[adjectiveIndex]}_${names[nameIndex]}${suffix}`;
    };
}