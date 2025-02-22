const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let imageTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    imageTests = [
        ...(testGroups['Broken Images - Valid Cases'] || []),
        ...(testGroups['Broken Images - Invalid Cases'] || [])
    ];
    
    console.log(`${imageTests.length} adet Broken Images testi bulundu`);
});

test.describe('Broken Images Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/broken_images');
    });

    test('Sayfa başlığı kontrolü', async ({ page }) => {
        const heading = await page.locator('h3');
        await expect(heading).toHaveText('Broken Images');
    });

    test('Tüm görsellerin durumunu kontrol et', async ({ page }) => {
        // Sayfadaki tüm görselleri bul
        const images = await page.locator('img');
        const count = await images.count();
        
        console.log(`Toplam ${count} görsel bulundu`);
        
        // Her görselin durumunu kontrol et
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const src = await img.getAttribute('src');
            
            // Görsel boyutlarını al
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            const naturalHeight = await img.evaluate(el => el.naturalHeight);
            
            console.log(`Görsel ${i + 1}: ${src}`);
            console.log(`Boyutlar: ${naturalWidth}x${naturalHeight}`);
            
            // Görsel yüklenmiş mi kontrol et (0x0 ise kırık demektir)
            const isBroken = naturalWidth === 0 || naturalHeight === 0;
            console.log(`Durum: ${isBroken ? 'Kırık' : 'Sağlam'}`);
        }
    });

    test('Kırık görsel sayısını kontrol et', async ({ page }) => {
        const brokenImages = await page.evaluate(() => {
            const images = document.getElementsByTagName('img');
            return Array.from(images).filter(img => img.naturalWidth === 0).length;
        });
        
        // Sayfada 2 kırık görsel olmalı
        expect(brokenImages).toBe(2);
    });
}); 