import { startBrowser } from "./browser";

export const scraperObject = {

    async vestiaireScraper(browser: any) {
        try {
            let url = "https://www.vestiairecollective.com/brands";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('#__next');
            let urls = await page.$$eval('main > ul > li > ul > li', (links: any) => {
                links = links.map((el: any) => el.querySelector('a').href);
                return links;
            });
            urls = [...new Set(urls)];
            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
        }
    },

    async thredupScraper(browser: any, url: any) {
        let scrappedUrls = [];
        try {
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector("div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG");
            const len = await page.evaluate(() => {
                return document.querySelectorAll(
                    "div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG > a.nklsQFqE_qT3VPQvqurw"
                ).length;
            });

            for (let i = 1; i <= len; i++) {
                if (i !== len) await Promise.all([
                    page.click(`div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG > a:nth-child(${i + 1})`),
                    page.waitForNavigation({ waitUntil: 'networkidle2' })
                ]);
                await page.waitForSelector("div.NG55LPeX625p1OzdvVdd");
                let urls = await page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll(".NG55LPeX625p1OzdvVdd a"));
                    return anchors.map((anchor: any) => {
                        return anchor.href;
                    }).filter(i => i);
                });

                scrappedUrls.push(...urls);
            }
            console.log("scrappedUrls", scrappedUrls.length)

            await browser.close();
            scrappedUrls = [...new Set(scrappedUrls)];
            return scrappedUrls;
        } catch (error) {
            console.log(error);
            // await browser.close();
            scrappedUrls = [...new Set(scrappedUrls)];
            return scrappedUrls;
        }
    },

    async lampooScraper(browser: any) {
        try {
            let url = "https://www.lampoo.com/au/designers/";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('#__next');
            let urls = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a'));
                return anchors.map(anchor => {
                    if (anchor.href.includes("https://www.lampoo.com/au/designers/")) return anchor.href;
                }).filter(i => i);
            });
            urls = [...new Set(urls)];

            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
        }
    },

    async luxuryScraper(browser: any) {
        try {
            let url = "https://theluxurycloset.com/designers";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('#root');

            let urls = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a'));
                return anchors.map(anchor => {
                    return anchor.href;
                });
            });
            urls = [...new Set(urls)];

            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
        }
    },

    async theRealScraper(browser: any) {
        try {
            let url = "https://www.therealreal.com/designers";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector(".designer-directory");
            let urls = await page.$$eval('ul > li', (links: any) => {
                links = links.map((el: any) => el.querySelector('a').href);
                return links;
            });
            urls = [...new Set(urls)];

            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
        }
    },
};