const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to load JSON file at "${filePath}":`, error.message);
        throw error;
    }
}

module.exports = loadJson;
