const { readTestCases } = require('../utils/excel-reader');
const path = require('path');

// Test case'leri oku
const testCasesPath = path.join(__dirname, '../test-cases/download-tests.xlsx');
const testCases = readTestCases(testCasesPath);

// Her test case için test oluştur
for (const testCase of testCases) {
    test(`${testCase.TestID}: ${testCase.Description}`, async ({ page }) => {
        // Test adımlarını uygula
        await page.goto(testCase.URL);
        // ... diğer test adımları
    });
} 