import * as puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import Stealth from 'puppeteer-extra-plugin-stealth';

puppeteerExtra.use(Stealth());
export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
         browser = await puppeteerExtra.launch({
            headless: false,
            defaultViewport: null,
            // userDataDir: './myUserDataDir',
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
        // const newpage = await browser.newPage();
        return browser;
        
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}