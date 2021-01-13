let adjectives = require('../../public/adjectives.json');
let names = require('../../public/names.json');

// Extracted from https://github.com/MaPhil/username-generator

export default class RandomUserName {
    
    static getRandomUserName() {
        var username = "";
        var adecuateAdjectives = adjectives
                                  .filter(word => word.length >= 9)
                                  .filter(word => word.includes("-"));
        var adecuateNames = names
                             .filter(word => word.length >= 9)
                             .filter(word => word.includes("-"));

        do {
            let nameIndex = Math.floor(Math.random() * adecuateNames.length);
            let adjectiveIndex = Math.floor(Math.random() * adecuateAdjectives.length);
            let suffix = Math.floor(Math.random() * 100);

            let adjective = adjectives[adjectiveIndex];
            let name = names[nameIndex];

            if (adjective.includes("-") || name.includes("-")){
                continue;
            }

            username = `${adjective}_${name}${suffix}`;
        } while (username.length >= 13);

        return username
    };
}