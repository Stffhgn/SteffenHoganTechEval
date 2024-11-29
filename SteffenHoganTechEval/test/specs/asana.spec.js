const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Import helpers
const loadJson = require('../helpers/loadJson');
const navigateToProject = require('../helpers/navigateToProject.asana');
const processListView = require('../helpers/processListView.asana');

// File paths
const credentialsPath = path.resolve(__dirname, '../../credentials.json');
const testCasesPath = path.resolve(__dirname, '../data/testCases.asana.json');
const selectorsPath = path.resolve(__dirname, '../data/selectors.asana.json');

// Global variables
let email, password, testCases, selectors;

test.describe('Asana Task Verification', () => {
    // Load configuration files before all tests
    test.beforeAll(() => {
        console.log('=== Starting Test Setup ===');

        // Load Test Cases
        try {
            console.log(`Loading test cases from: ${testCasesPath}`);
            testCases = loadJson(testCasesPath);
            if (!Array.isArray(testCases) || testCases.length === 0) {
                throw new Error('Test cases file is invalid or empty.');
            }
            console.log(`Loaded ${testCases.length} test cases successfully.`);
        } catch (error) {
            console.error(`Error loading test cases: ${error.message}`);
            process.exit(1);
        }

        // Load Selectors
        try {
            console.log(`Loading selectors from: ${selectorsPath}`);
            selectors = loadJson(selectorsPath);
            if (!selectors || typeof selectors !== 'object') {
                throw new Error('Selectors file is invalid or empty.');
            }
            console.log('Selectors loaded successfully.');
        } catch (error) {
            console.error(`Error loading selectors: ${error.message}`);
            process.exit(1);
        }

        // Load Credentials
        try {
            console.log('Loading credentials...');
            if (!fs.existsSync(credentialsPath)) {
                throw new Error(`Credentials file not found: ${credentialsPath}`);
            }
            const credentials = loadJson(credentialsPath);
            email = credentials.email;
            password = credentials.password;

            if (!email || !password) {
                throw new Error('Email or password missing in credentials file.');
            }
            console.log('Credentials loaded successfully.');
        } catch (error) {
            console.error(`Error loading credentials: ${error.message}`);
            process.exit(1);
        }

        console.log('=== Test Setup Complete ===');
    });

    // Perform login before each test
    test.beforeEach(async ({ page }) => {
        console.log('=== Starting Login Process ===');
        try {
            console.log('Starting navigation to the Asana login page...');

            // Ensure browser and page context are properly initialized
            const response = await page.goto('https://app.asana.com/-/login', { timeout: 60000 });
            if (!response || !response.ok()) {
                throw new Error(`Failed to load Asana login page: ${response ? response.status() : 'No response'}`);
            }

            console.log(`Asana login page loaded with status: ${response.status()}`);

            // Enter email
            console.log(`Filling email: ${email}`);
            await page.fill(selectors.loginPage.emailField, email);
            await page.click(selectors.loginPage.emailContinueButton);
            console.log('Email submitted.');

            // Enter password
            console.log('Waiting for password field...');
            await page.waitForSelector(selectors.loginPage.passwordField, { timeout: 5000 });
            console.log('Password field visible. Entering password.');
            await page.fill(selectors.loginPage.passwordField, password);
            await page.click(selectors.loginPage.loginButton);
            console.log('Password submitted.');

            // Wait for dashboard
            console.log('Waiting for dashboard to load...');
            await page.waitForSelector(selectors.asana.projectsSection, { timeout: 10000 });
            console.log('Dashboard loaded successfully. Login process completed.');
        } catch (error) {
            console.error(`Login failed: ${error.message}`);
            // Optionally capture screenshot for debugging
            await page.screenshot({ path: 'login_error.png' });
            throw error;
        }
    });


    test('Validate and Run All Test Cases', async ({ page }) => {
        console.log('=== Starting Test Execution ===');

        if (!Array.isArray(testCases) || testCases.length === 0) {
            console.error('No valid test cases found.');
            process.exit(1);
        }

        testCases.forEach((testCase, index) => {
            console.log(`Validating test case ${index + 1}:`, JSON.stringify(testCase, null, 2));

            if (!testCase.project || !testCase.group || !testCase.task || !Array.isArray(testCase.tags)) {
                console.error(`Test case ${index + 1} is invalid. Skipping.`);
                return;
            }
        });

        console.log('=== All Test Cases Validated ===');

        for (const [index, testCase] of testCases.entries()) {
            console.log(`\n=== Running Test Case ${index + 1}: "${testCase.testName}" ===`);

            try {
                console.log(`Details: Project="${testCase.project}", Group="${testCase.group}", Task="${testCase.task}", Tags=[${testCase.tags.join(', ')}]`);

                // Step 1: Navigate to the project
                console.log(`Navigating to project: "${testCase.project}"`);
                await navigateToProject(page, testCase.project, selectors);

                // Step 2: Process the list view
                console.log(`Processing list view for group: "${testCase.group}"`);
                const results = await processListView(page, testCases);

                // Validate results
                console.log('Validating results...');
                const result = results.find(
                    (res) => res.task === testCase.task && res.group === testCase.group
                );

                if (!result) {
                    console.error(
                        `Test case not found for task: "${testCase.task}" in group: "${testCase.group}"`
                    );
                    console.error(`Scraped data: ${JSON.stringify(results, null, 2)}`);
                    continue;
                }

                // Validate the tags
                const normalizeTags = (tags) => tags.map(tag => tag.toLowerCase()).sort();

                const tagsMatch =
                    JSON.stringify(normalizeTags(testCase.tags)) === JSON.stringify(normalizeTags(result.tags));


                if (tagsMatch) {
                    console.log(`Test case ${index + 1}: PASSED.`);
                } else {
                    console.error(`Test case ${index + 1}: FAILED.`);
                    console.error(`Expected Tags: [${testCase.tags.join(', ')}]`);
                    console.error(`Actual Tags: [${result.tags.join(', ')}]`);
                }

                // Use assertion to formally validate
                expect(tagsMatch).toBe(true);
            } catch (error) {
                console.error(`Test case ${index + 1} failed unexpectedly: ${error.message}`);
            }
        }

        console.log('=== All Test Cases Executed ===');
    });

    test.afterAll(() => {
        console.log('=== All Tests Completed ===');
    });

});
