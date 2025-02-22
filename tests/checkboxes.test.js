const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let checkboxTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    checkboxTests = [
        ...(testGroups['Checkbox Page - Valid Cases'] || []),
        ...(testGroups['Checkbox Page - Invalid Cases'] || [])
    ];
    
    console.log(`${checkboxTests.length} adet Checkbox testi bulundu`);
});

test.describe('Checkbox Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/checkboxes');
    });

    test('Checkbox başlangıç durumlarını kontrol et', async ({ page }) => {
        const checkboxes = page.locator('input[type="checkbox"]');
        
        // İlk checkbox başlangıçta işaretli olmamalı
        await expect(checkboxes.nth(0)).not.toBeChecked();
        
        // İkinci checkbox başlangıçta işaretli olmalı
        await expect(checkboxes.nth(1)).toBeChecked();
    });

    test('Checkbox işaretleme/kaldırma', async ({ page }) => {
        const checkboxes = page.locator('input[type="checkbox"]');
        
        // İlk checkbox'ı işaretle
        await checkboxes.nth(0).check();
        await expect(checkboxes.nth(0)).toBeChecked();
        
        // İkinci checkbox'ın işaretini kaldır
        await checkboxes.nth(1).uncheck();
        await expect(checkboxes.nth(1)).not.toBeChecked();
    });

    test('Tüm checkboxları işaretle/kaldır', async ({ page }) => {
        const checkboxes = page.locator('input[type="checkbox"]');
        const count = await checkboxes.count();
        
        // Tüm checkboxları işaretle
        for (let i = 0; i < count; i++) {
            await checkboxes.nth(i).check();
            await expect(checkboxes.nth(i)).toBeChecked();
        }
        
        // Tüm checkboxların işaretini kaldır
        for (let i = 0; i < count; i++) {
            await checkboxes.nth(i).uncheck();
            await expect(checkboxes.nth(i)).not.toBeChecked();
        }
    });
}); 