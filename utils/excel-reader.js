const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function readTestCases(filePath) {
    try {
        // Dosya var mı kontrol et
        if (!fs.existsSync(filePath)) {
            console.error(`Excel dosyası bulunamadı: ${filePath}`);
            return [];
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        const testCases = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Başlık satırını atla
            
            const test = {
                id: row.getCell('A').value,
                name: row.getCell('B').value,
                status: row.getCell('C').value,
                precondition: row.getCell('D').value,
                folder: row.getCell('F').value,
                priority: row.getCell('G').value,
                owner: row.getCell('I').value,
                testScript: row.getCell('L').value
            };

            if (test.id && test.name) {
                testCases.push(test);
            }
        });

        console.log(`${testCases.length} test case okundu`);
        
        return testCases;
        
    } catch (error) {
        console.error('Excel okuma hatası:', error);
        return [];
    }
}

module.exports = { readTestCases }; 