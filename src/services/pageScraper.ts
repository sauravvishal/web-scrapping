export const scraperObject = {

    async vestiaireScraper(browser: any) {
        try {
            let url = "https://www.vestiairecollective.com/brands";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('#__next');
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

    async thredupScraper(browser: any) {
        try {
            let url = "https://www.thredup.com/brands/designer";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('#root');

            let urls = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a'));
                return anchors.map(anchor => {
                    if (anchor.href.includes("https://www.thredup.com")) return anchor.href;
                }).filter(i => i);
            });
            urls = [...new Set(urls)];

            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
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