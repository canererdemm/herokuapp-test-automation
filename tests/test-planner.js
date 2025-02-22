const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

async function planTests() {
    // Test case'leri oku
    const testCasesPath = path.join(__dirname, '../test-cases/atm-exporter.xlsx');
    const testCases = await readTestCases(testCasesPath);

    // Test gruplarını al
    const testGroups = groupTestsByFolder(testCases);

    // Grupları göster
    console.log('Test Grupları:');
    Object.entries(testGroups).forEach(([folder, tests]) => {
        console.log(`\n${folder} (${tests.length} test):`);
        tests.forEach(test => {
            console.log(`- ${test.id}: ${test.name}`);
        });
    });
}

planTests().catch(console.error); 