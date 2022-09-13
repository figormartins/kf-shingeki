const puppeteer = require('puppeteer');
const emailService = require('email-generator');
require('dotenv').config();
const { kfAttackTimeToFullDate, millisToMinutesAndSeconds } = require('./helpers/date');

(async () => {
    const browser = await puppeteer.launch({
        args:['--start-maximized' ],
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1800,
        height: 7500,
        deviceScaleFactor: 1,
    });
    let timeToAttack;
    console.log("Iniciando...");
    
    while(true) {
        /// Register
        await page.goto('https://moonid.net/account/register/knightfight/');
        await page.waitForSelector("#content > div > div:nth-child(1) > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > input");
        const emailGen = emailService.generateEmail();
        const email = emailGen.replace(new RegExp('"', 'g'), "");;
        const username = email.split('@')[0];
        await page.type('#id_email', email);
        await page.type('.form .help_text #id_username', username);
        await page.type('#id_password1', email);
        await page.type('#id_password2', email);
        await page.click("#id_terms_accepted");
        await page.click("#content > div > div:nth-child(1) > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > input");
        await page.waitForNavigation();
        console.log("Cadastrou...");
        
        // Select world
        await page.goto('https://moonid.net/games/knightfight/');
        await page.waitForSelector("tr.row1:nth-child(11) > td:nth-child(5) > a:nth-child(1)");
        await page.click("tr.row1:nth-child(11) > td:nth-child(5) > a:nth-child(1)");
        await page.waitForNavigation();
        console.log("Selecionou int4..");
        
        // Register user
        await page.type('#user', username);
        await page.click("#page > div:nth-child(2) > form > div > table > tbody > tr:nth-child(4) > td > input[type=image]");
        await page.waitForSelector("#page > div.box-charimage > img.charimage");
        console.log("Registrou...");

        // Wait to search
        if (timeToAttack) {
            await page.waitForSelector("#kftime-header");
            const valueTimeNow = await page.$eval("#kftime-header", el => el.textContent);
            const [hours, minutes, seconds] = valueTimeNow.split(":");
            const timeNow = new Date(timeToAttack.valueOf());

            if (hours < timeNow.getHours()) {
                timeNow.setDate(timeNow.getDate() + 1);
            }
            
            timeNow.setHours(hours);
            timeNow.setMinutes(minutes);
            timeNow.setSeconds(seconds);
            timeToAttack.setHours(timeToAttack.getHours() + 1);

            const timeout = Math.abs(timeNow - timeToAttack);
            console.log("Waiting for:", millisToMinutesAndSeconds(timeout));
            await new Promise(r => setTimeout(r, timeout));;
        }
        
        // Search for user
        await page.goto('https://int4.knightfight.moonid.net/raubzug/gegner/?searchuserid=517000943');
        await page.waitForSelector("#page > form > div > table:nth-child(6) > tbody > tr:nth-child(8) > td > input[type=image]");
        console.log("Buscou...");

        // Attack user
        await page.click("#page > form > div > table:nth-child(6) > tbody > tr:nth-child(8) > td > input[type=image]");
        console.log("Atacou...");

        // Skip button
        await page.waitForSelector("#button-skip-prem");
        await page.click("#button-skip-prem");
        
        // Get attack time
        await page.waitForSelector("#page > div > div:nth-child(4) > div > div > div.kf-bi-thin.padding-md.margin-top-lg.cc.f-os > span > b");
        const valueTime = await page.$eval("#page > div > div:nth-child(4) > div > div > div.kf-bi-thin.padding-md.margin-top-lg.cc.f-os > span > b", el => el.innerHTML);
        timeToAttack = kfAttackTimeToFullDate(valueTime);

        // Remove account
        await page.goto("https://int4.knightfight.moonid.net/profil/");
        await page.waitForSelector("#page > form > div > table > tbody > tr:nth-child(47) > td > label > div");
        await page.waitForSelector("#page > form > div > table > tbody > tr:nth-child(48) > td > input[type=image]");
        await page.click("#page > form > div > table > tbody > tr:nth-child(47) > td > label > div");
        await page.click("#page > form > div > table > tbody > tr:nth-child(48) > td > input[type=image]");
        console.log("Account removed from server...");

        // Logout
        await page.waitForSelector("#moonid-toolbar-account > a");
        await page.click("#moonid-toolbar-account > a");
        await page.waitForSelector("a.more:nth-child(13)");
        await page.click("a.more:nth-child(13)");
        console.log("Deslogou...", new Date().toString());

        // Clear cache
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');
    }
})();
