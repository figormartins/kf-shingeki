const puppeteer = require('puppeteer');
const emailService = require('email-generator');
require('dotenv').config();

(async () => {
    const browser = await puppeteer.launch({ headless: false/*args: ['--no-sandbox', '--disable-setuid-sandbox'], */});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 3500,
        deviceScaleFactor: 1,
    });
    console.log("Iniciando...");
    
    while(true) {
        /// Register
        await page.goto('https://moonid.net/account/register/knightfight/');
        const email = emailService.generateEmail().replaceAll('"', '');
        const username = email.split('@')[0];
        await page.type('#id_email', email);
        await page.type('.form .help_text #id_username', username);
        await page.type('#id_password1', email);
        await page.type('#id_password2', email);
        await page.click("#id_terms_accepted");
        await page.click("#content > div > div:nth-child(1) > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > input");
        await page.waitForNavigation();
        
        // Select world
        await page.goto('https://moonid.net/games/knightfight/');
        await page.waitForSelector("tr.row1:nth-child(11) > td:nth-child(5) > a:nth-child(1)");
        await page.click("tr.row1:nth-child(11) > td:nth-child(5) > a:nth-child(1)");
        await page.waitForNavigation();
        
        // Register user
        await page.type('#user', username);
        await page.click("#page > div:nth-child(2) > form > div > table > tbody > tr:nth-child(4) > td > input[type=image]");
        await page.waitForSelector("#page > div.box-charimage > img.charimage");
        
        // Search for user
        await page.goto('https://int4.knightfight.moonid.net/raubzug/gegner/?searchuserid=517000943');
        await page.waitForSelector("#page > form > div > table:nth-child(6) > tbody > tr:nth-child(8) > td > input[type=image]");
        
        // Attack user
        await page.click("#page > form > div > table:nth-child(6) > tbody > tr:nth-child(8) > td > input[type=image]");
        await page.waitForSelector("#navigation > a:nth-child(17)");
        await page.click("#navigation > a:nth-child(17)");

        await page.waitForTimeout(1000 * 60 * 60);
    }
})();

