const resolveSelector = (template, params) => {
    if (!template) {
        throw new Error("Selector template is undefined. Check your selectors.json file.");
    }

    console.log(`Resolving selector template: "${template}" with params:`, params);

    const resolvedSelector = template.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');

    console.log(`Resolved selector: "${resolvedSelector}"`);
    return resolvedSelector;
};

module.exports = resolveSelector;
