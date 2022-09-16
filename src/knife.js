const puppeteer = require('puppeteer');
require('dotenv').config();
const { getUsers, deleteUser } = require('../repositories/user');

(async () => {
    console.log("Starting...");
    const browser = await puppeteer.launch({
        args: ['--start-maximized' ],
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1800,
        height: 7500,
        deviceScaleFactor: 1,
    });

    console.log("Getting users...");
    const users = await getUsers();
    
    for (const user of users) {
        /// Login
        const username = user.email.split('@')[0];
        const pwd = user.email;
        await page.goto('https://moonid.net/account/login/', { waitUntil: 'networkidle2' });
        await page.waitForSelector("input.btn:nth-child(2)");
        await page.type('.form > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input:nth-child(2)', username);
        await page.type('.form > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > input:nth-child(2)', pwd);
        await Promise.all([
            page.waitForNavigation(),
            page.click('input.btn:nth-child(2)'),
        ]);
        console.log('Logged as:', user.email);
        
        try {
            /// Deleting account
            await page.goto('https://moonid.net/account/data/', { waitUntil: 'networkidle2' });
            await page.waitForSelector('#id_confirmed', { timeout: 2000 });
            await page.click('#id_confirmed');
            await page.click('#content > div > div > div.subcolumn.right > div > div > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
            console.log('Account deleted');
    
            /// Deleting account from database
            await deleteUser(user.id);
            console.log('Account deleted from database', user.email);
        } catch (error) {
            console.log('ERROR:', error.message);
        }

        console.log('----------------------');
    }
    console.log('All users deleted');
    await browser.close();
})();