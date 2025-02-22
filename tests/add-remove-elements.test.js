const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let addRemoveTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    addRemoveTests = [
        ...(testGroups['Add Remove Elements - Valid Cases'] || []),
        ...(testGroups['Add Remove Elements - Invalid Cases'] || [])
    ];
    
    console.log(`${addRemoveTests.length} adet Add/Remove Elements testi bulundu`);
});

test.describe('Add/Remove Elements Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
    });

    test('Element ekleme', async ({ page }) => {
        const addButton = page.locator('button[onclick="addElement()"]');
        await addButton.click();
        
        const deleteButton = page.locator('.added-manually');
        await expect(deleteButton).toBeVisible();
    });

    test('Element silme', async ({ page }) => {
        // Önce element ekle
        const addButton = page.locator('button[onclick="addElement()"]');
        await addButton.click();
        
        // Sonra sil
        const deleteButton = page.locator('.added-manually');
        await deleteButton.click();
        
        // Element silinmiş olmalı
        await expect(deleteButton).toHaveCount(0);
    });

    test('Çoklu element ekleme ve silme', async ({ page }) => {
        const addButton = page.locator('button[onclick="addElement()"]');
        
        // 3 element ekle
        for (let i = 0; i < 3; i++) {
            await addButton.click();
        }
        
        const deleteButtons = page.locator('.added-manually');
        await expect(deleteButtons).toHaveCount(3);
    });
}); 