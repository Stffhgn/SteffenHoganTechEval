const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
    testDir: path.join(__dirname, 'test', 'specs'), 
    timeout: 30000,
    retries: 0,
    globalSetup: require.resolve('./global-setup.js'), 
    use: {
        headless: false, 
        viewport: { width: 1280, height: 720 },
    },
});
