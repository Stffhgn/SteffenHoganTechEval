const selectors = require('../data/selectors.asana.json');

async function processListView(page, testCases) {
    console.log("========== Starting processListView ==========");

    try {
        const asanaSelectors = selectors.asana; 

        // Step 1: Navigate to the List View tab
        const listTabSelector = asanaSelectors.listTab;
        console.log(`Navigating to the List View tab using selector: ${listTabSelector}`);

        // Ensure the List View button is visible and clickable
        await page.waitForSelector(listTabSelector, { timeout: 10000 });
        console.log("List View tab is visible. Clicking...");

        await page.click(listTabSelector);
        console.log("List View tab clicked. Waiting for the List View content to load...");

        // Step 2: Wait for the task groups to be visible
        console.log(`Waiting for task groups to be visible with selector: ${asanaSelectors.groupContainer}`);
        await page.waitForSelector(asanaSelectors.groupContainer, { timeout: 10000 });
        console.log("Task groups are visible. Proceeding to scrape data...");

        // Step 3: Scrape groups, tasks, and tags
        console.log("Scraping groups, tasks, and tags...");
        const scrapedData = await page.evaluate(
            ({ groupContainer, groupHeader, taskRow, taskName, taskTags }) => {
                const result = [];
                const groups = document.querySelectorAll(groupContainer);

                console.log(`Found ${groups.length} groups on the page.`);
                groups.forEach((group, index) => {
                    // Extract group name
                    const groupName =
                        group.querySelector(groupHeader)?.innerText || `Group ${index + 1}`;

                    console.log(`Group Found: ${groupName}`);
                    const tasks = [];

                    // Find task rows within the group
                    const taskRows = group.querySelectorAll(taskRow);

                    taskRows.forEach((taskRow) => {
                        // Extract task name
                        const taskNameText =
                            taskRow.querySelector(taskName)?.innerText || "Unnamed Task";

                        // Extract tags
                        const tags = Array.from(
                            taskRow.querySelectorAll(taskTags)
                        ).map((tag) => tag.innerText.trim());

                        console.log(
                            `    Task Found: "${taskNameText}", Tags: [${tags.join(", ")}]`
                        );
                        tasks.push({ task: taskNameText, tags });
                    });

                    result.push({ group: groupName, tasks });
                });

                return result;
            },
            {
                groupContainer: asanaSelectors.groupContainer,
                groupHeader: asanaSelectors.groupHeader,
                taskRow: asanaSelectors.taskRow,
                taskName: asanaSelectors.taskName,
                taskTags: asanaSelectors.taskTags,
            }
        );

        console.log("Scraped Data:");
        console.dir(scrapedData, { depth: null });

        // Step 4: Format the scraped data for the test cases
        const formattedData = scrapedData.flatMap((groupData) =>
            groupData.tasks.map((taskData) => ({
                testName: `Verify '${taskData.task}' in '${groupData.group}' column`,
                project: "Project Name Placeholder", 
                group: groupData.group,
                task: taskData.task,
                tags: taskData.tags,
            }))
        );

        console.log("Formatted Data for Test Cases:");
        console.dir(formattedData, { depth: null });

        return formattedData;
    } catch (error) {
        console.error("Error during processListView:", error.message);
        throw error;
    }
}

module.exports = processListView;
