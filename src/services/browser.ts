import * as puppeteer from "puppeteer";

export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            // userDataDir: './myUserDataDir',
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
        return browser;
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}