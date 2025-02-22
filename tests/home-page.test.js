const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

// Test case'leri test başlamadan önce oku
let homePageTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    // "Home Page - Valid Cases" ve "Home Page - Invalid Cases" testlerini birleştir
    homePageTests = [
        ...(testGroups['Home Page - Valid Cases'] || []),
        ...(testGroups['Home Page - Invalid Cases'] || [])
    ];
    
    console.log(`${homePageTests.length} adet Home Page testi bulundu`);
});

test.describe('Home Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Her testten önce ana sayfaya git
        await page.goto('https://the-internet.herokuapp.com/');
    });

    test('Ana sayfa başlığı kontrol', async ({ page }) => {
        const title = await page.title();
        expect(title).toContain('The Internet');
    });

    test('Ana sayfa linkleri kontrol', async ({ page }) => {
        // Sadece görünür linkleri seç
        const links = await page.locator('a:visible');
        const linkCount = await links.count();
        
        console.log(`Sayfada ${linkCount} adet görünür link bulundu`);
        
        for (let i = 0; i < linkCount; i++) {
            const link = links.nth(i);
            const linkText = await link.textContent();
            const linkHref = await link.getAttribute('href');
            console.log(`Link ${i + 1}: ${linkText} (${linkHref})`);
            
            // Link görünür ve tıklanabilir olmalı
            await expect(link).toBeVisible();
            await expect(link).toBeEnabled();
        }
    });

    // Excel'den okunan test case'leri çalıştır
    for (const testCase of homePageTests) {
        test(`${testCase.id}: ${testCase.name}`, async ({ page }) => {
            console.log(`Test ediliyor: ${testCase.id} - ${testCase.name}`);
            // Test case'e özel kontroller burada yapılacak
        });
    }
}); 