const { test, expect } = require('@playwright/test');
const { readTestCases } = require('../utils/excel-reader');
const { groupTestsByFolder } = require('../utils/test-groups');
const path = require('path');

let authTests = [];

test.beforeAll(async () => {
    const testCases = await readTestCases(path.join(__dirname, '../test-cases/atm-exporter.xlsx'));
    const testGroups = groupTestsByFolder(testCases);
    
    authTests = [
        ...(testGroups['Basic Auth - Valid Cases'] || []),
        ...(testGroups['Basic Auth - Invalid Cases'] || [])
    ];
    
    console.log(`${authTests.length} adet Basic Auth testi bulundu`);
});

test.describe('Basic Auth Tests', () => {
    test('Başarılı giriş', async ({ page }) => {
        // Basic auth bilgilerini URL'e ekle
        await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');
        
        // Başarılı giriş mesajını kontrol et
        const successMessage = page.locator('p');
        await expect(successMessage).toContainText('Congratulations');
    });

    test('Başarısız giriş', async ({ page }) => {
        // Response'u yakalayacak listener ekle
        let responseStatus = 0;
        page.on('response', response => {
            if (response.url().includes('/basic_auth')) {
                responseStatus = response.status();
            }
        });

        try {
            // Yanlış bilgilerle giriş dene
            await page.goto('https://wrong:wrong@the-internet.herokuapp.com/basic_auth', {
                waitUntil: 'networkidle'
            });
        } catch (error) {
            // 401 hatası beklediğimiz bir durum
            console.log('Beklenen auth hatası alındı');
        }

        // Status 401 olmalı
        expect(responseStatus).toBe(401);
    });

    test('Giriş iptali', async ({ page, context }) => {
        // Auth dialog'unu iptal etmek için event listener ekle
        context.on('dialog', dialog => dialog.dismiss());
        
        try {
            // Normal URL ile git (auth bilgileri olmadan)
            await page.goto('https://the-internet.herokuapp.com/basic_auth', {
                waitUntil: 'networkidle',
                timeout: 5000 // Timeout'u düşür
            });
        } catch (error) {
            // Timeout hatası beklediğimiz bir durum
            console.log('Beklenen timeout hatası alındı');
        }

        // Sayfanın yüklenmemesi gerekiyor
        const body = page.locator('body');
        await expect(body).not.toContainText('Congratulations');
    });
}); 