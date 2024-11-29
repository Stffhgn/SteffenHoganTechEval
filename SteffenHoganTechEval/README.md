# SteffenHoganTechEval


Introduction
The goal of this task was to validate the accuracy of Asana project data extraction and ensure it matched predefined test cases. The task involved:
Navigating to the project in Asana.
Scraping the list view to retrieve task groups, tasks, and their associated tags.
Formatting the scraped data for comparison with the provided test cases.
Running validation to confirm that the scraped data matched the expected results, noting any discrepancies.

Implementation Details
Solution Overview
Navigation:
A function was implemented to log in and navigate to the correct project in Asana.
The selectors for various elements (e.g., task groups, tasks, tags) were loaded dynamically from a JSON file to enable flexible updates.
Data Scraping:
The processListView function was developed to extract task data from the list view, grouping tasks by sections and pulling associated tags.
The scraped data was formatted to match the structure of the test cases for comparison.
Validation:
Test cases were defined in JSON format and loaded during runtime.
A case-insensitive comparison of tags was introduced to handle inconsistencies in capitalization.
Results were logged for each test case, highlighting matches and mismatches.

Challenges and Solutions
Challenge 1: Case Sensitivity in Tag Comparison
Problem: Tags such as "High Priority" and "High priority" caused mismatches due to case differences.
Solution: Normalized tags by converting both expected and actual tags to lowercase before comparison.
Challenge 2: Duplicate Groups
Problem: The scraper occasionally duplicated groups due to repeated DOM elements in Asana.
Solution: Added logic to deduplicate groups during data processing, ensuring each group appeared only once.
Challenge 3: Dynamic Selectors
Problem: Asana's DOM structure used variable class names, making static selectors unreliable.
Solution: Used more robust selector strategies, such as identifying elements by their roles and labels rather than class names.

Results
Summary of Test Run Outcomes
Total Test Cases: 6
Passed: 6

Recommendations
Improvements to Features:
Enhanced Scraper Logic:
Introduce checks to avoid duplicates during group and task scraping.
Implement validation for incomplete or empty groups to handle edge cases.
Expand Data Handling:
Add support for additional metadata such as due dates, assignees, or statuses for a more comprehensive validation process.
Improvements to Testing Process:
Robust Error Reporting:
Provide detailed logs for all failed cases, including the exact location of mismatches.
Save screenshots for visual debugging when validation fails.
Scalability of Test Cases:
Develop reusable templates for test cases to simplify adding or modifying tests in the future.
Automated Selector Updates:
Implement a mechanism to validate and update selectors dynamically, reducing the need for manual intervention when the Asana interface changes.
