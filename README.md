npm install

npx playwright test

project-root/
├── test/
│   ├── specs/
│   │   └── asana.spec.js         # Main test script
│   ├── helpers/
│   │   ├── processListView.asana.js  # Function to scrape and process Asana data
│   │   └── navigateToProject.asana.js # Function to navigate to the project
│   ├── data/
│   │   ├── credentials.json      # Asana login credentials
│   │   ├── selectors.asana.json  # DOM selectors for Asana elements
│   │   └── testCases.asana.json  # Expected test cases for validation
├── package.json                  # Project dependencies
├── README.md                     # Project documentation
└── playwright.config.js          # Playwright configuration

Contact:
Steffen Hogan
Steffen.Hogan@gmail.com
