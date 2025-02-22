const { readTestCases } = require('../utils/excel-reader');
const path = require('path');

// Dosya yolunu güncelle
const testCasesPath = path.join(__dirname, '../test-cases/atm-exporter.xlsx');
console.log('Excel dosya yolu:', testCasesPath);

// Test case'leri oku
const testCases = readTestCases(testCasesPath);

if (testCases.length > 0) {
    console.log('Okunan test case\'ler:', JSON.stringify(testCases, null, 2));
} else {
    console.log('Test case bulunamadı');
} 