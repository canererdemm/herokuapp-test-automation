const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let domTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    domTests = [
        ...(testGroups['Challenging Dom - Valid Cases'] || []),
        ...(testGroups['Challenging Dom - Invalid Cases'] || [])
    ];
    
    console.log(`${domTests.length} adet Challenging DOM testi bulundu`);
});

test.describe('Challenging DOM Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/challenging_dom');
    });

    test('Butonların varlığını kontrol et', async ({ page }) => {
        // Tüm butonları bul
        const buttons = page.locator('.button');
        const buttonCount = await buttons.count();
        
        // 3 buton olmalı
        expect(buttonCount).toBe(3);
        
        // Her butonun tıklanabilir olduğunu kontrol et
        for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i);
            await expect(button).toBeEnabled();
            
            // Butona tıkla ve değişikliği kontrol et
            const oldText = await button.textContent();
            await button.click();
            const newText = await button.textContent();
            
            console.log(`Buton ${i + 1}: ${oldText} -> ${newText}`);
        }
    });

    test('Tablo verilerini kontrol et', async ({ page }) => {
        // Tablo başlıklarını kontrol et
        const headers = page.locator('thead th');
        const expectedHeaders = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Diceret', 'Action'];
        
        for (let i = 0; i < expectedHeaders.length; i++) {
            const header = headers.nth(i);
            await expect(header).toHaveText(expectedHeaders[i]);
        }
        
        // Tablo satırlarını kontrol et
        const rows = page.locator('tbody tr');
        const rowCount = await rows.count();
        console.log(`Tabloda ${rowCount} satır bulundu`);
        
        // Her satırda edit ve delete linkleri olmalı
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const editLink = row.locator('a').filter({ hasText: 'edit' });
            const deleteLink = row.locator('a').filter({ hasText: 'delete' });
            
            await expect(editLink).toBeVisible();
            await expect(deleteLink).toBeVisible();
        }
    });

    test('Canvas elementini kontrol et', async ({ page }) => {
        const canvas = page.locator('#canvas');
        
        // Canvas görünür olmalı
        await expect(canvas).toBeVisible();
        
        // Canvas boyutlarını kontrol et
        const width = await canvas.evaluate(el => el.width);
        const height = await canvas.evaluate(el => el.height);
        
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });
}); 