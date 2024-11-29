const readline = require('readline-sync');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
    console.log('Prompting user for credentials...');
    const email = readline.question('Enter your Asana email: ');
    const password = readline.question('Enter your Asana password: ', { hideEchoBack: true });
    console.log('Credentials received.');

    // Store credentials in a temporary file
    const credentials = { email, password };
    const credentialsPath = path.join(__dirname, 'credentials.json');
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials));

    // Return a function to perform cleanup after tests
    return async () => {
        // Delete the credentials file after all tests have run
        if (fs.existsSync(credentialsPath)) {
            fs.unlinkSync(credentialsPath);
            console.log('Credentials file deleted.');
        }
    };
};
