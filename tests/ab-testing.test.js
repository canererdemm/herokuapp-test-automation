const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let abTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    abTests = [
        ...(testGroups['A&B Page - Valid Cases'] || []),
        ...(testGroups['A&B Page - Invalid Cases'] || [])
    ];
    
    console.log(`${abTests.length} adet A/B Testing testi bulundu`);
});

test.describe('A/B Testing Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/abtest');
    });

    test('Sayfa başlığı kontrolü', async ({ page }) => {
        const heading = await page.locator('h3');
        const headingText = await heading.textContent();
        
        // Başlık "A/B Test Control" veya "A/B Test Variation 1" olabilir
        expect(headingText).toMatch(/A\/B Test/);
    });

    test('Metin içeriği kontrolü', async ({ page }) => {
        const content = await page.locator('.example p');
        const text = await content.textContent();
        
        // Metnin var olduğunu ve boş olmadığını kontrol et
        expect(text.length).toBeGreaterThan(0);
        
        // Metni kopyalayabilme kontrolü
        await content.click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Control+C');
    });

    test('Elemental Selenium linki kontrolü', async ({ page }) => {
        const link = await page.locator('a[href="http://elementalselenium.com/"]');
        
        // Link görünür ve tıklanabilir olmalı
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
        
        // Link metni doğru olmalı
        const linkText = await link.textContent();
        expect(linkText).toContain('Elemental Selenium');
    });

    // Excel'den okunan test case'leri çalıştır
    for (const testCase of abTests) {
        test(`${testCase.id}: ${testCase.name}`, async ({ page }) => {
            console.log(`Test ediliyor: ${testCase.id} - ${testCase.name}`);
            
            // Test case'e özel kontroller
            if (testCase.name.includes('string')) {
                const heading = await page.locator('h3');
                await expect(heading).toBeVisible();
                await expect(heading).toContainText('A/B Test');
            }
            
            if (testCase.name.toLowerCase().includes('metin')) {
                const content = await page.locator('.example p');
                await expect(content).toBeVisible();
                await expect(content).not.toBeEmpty();
            }
        });
    }
}); 