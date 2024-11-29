async function navigateToProject(page, projectName, selectors) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`Attempt ${retryCount + 1}/${maxRetries}: Looking for project link: "${projectName}"...`);

            // Ensure the sidebar is visible
            console.log("Waiting for sidebar to load...");
            await page.waitForSelector('div.SidebarResizableContainer-sidebarWrapper', { timeout: 10000 });
            console.log("Sidebar is loaded.");

            // Wait for the sidebar links to be visible
            console.log("Waiting for sidebar project links to be visible...");
            await page.waitForSelector('span.SidebarNavigationLinkCard-label', { timeout: 10000 });
            console.log("Sidebar project links are now visible.");

            // Fetch all visible project links
            const allProjects = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('span.SidebarNavigationLinkCard-label'))
                    .map(el => el.textContent.trim());
            });

            // Log all project links
            console.log(`Found these project links on the page:`);
            allProjects.forEach((project, index) => {
                console.log(`  [${index + 1}] ${project}`);
            });

            // Check if the specific project exists
            const projectLink = await page.locator(`span.SidebarNavigationLinkCard-label:text("${projectName}")`);
            const projectCount = await projectLink.count();

            if (projectCount > 0) {
                console.log(`Project "${projectName}" found (${projectCount} link(s)). Clicking...`);
                await projectLink.first().click();
                console.log(`Successfully navigated to project: "${projectName}".`);
                return projectName; // Exit the function as the project was successfully found
            } else {
                console.warn(`Project "${projectName}" not found in the available list. Retrying...`);
            }
        } catch (error) {
            console.error(`Error during navigateToProject attempt ${retryCount + 1}/${maxRetries}:`, error);
        }

        retryCount++;
        if (retryCount < maxRetries) {
            console.log(`Retrying to locate project "${projectName}"...`);
            await page.waitForTimeout(3000); 
        }
    }

    throw new Error(`Failed to locate project "${projectName}" after ${maxRetries} attempts.`);

}

module.exports = navigateToProject;
