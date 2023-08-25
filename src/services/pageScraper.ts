export const scraperObject = {

    async vestiaireScraper(browser: any) {
        let url = "https://www.vestiairecollective.com/brands";
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.waitForSelector('#__next');
        let urls = await page.$$eval('ul > li', (links: any) => {
            links = links.map((el: any) => el.querySelector('a').href);
            return links;
        });
        await browser.close();
        return urls;
    },

    async thredupScraper(browser: any) {
        try {
            let url = "https://www.thredup.com/brands/designer";
            let page = await browser.newPage();
            console.log(`Navigating to ${url}...`);
            await page.goto(url);
            await page.waitForSelector('.content');
            let urls = await page.$$eval('#A', (links: any) => {
                links = links.map((el: any) => el.querySelector('a').href);
                return links;
            });
            console.log({ urls })
            await browser.close();
            return urls;
        } catch (error) {
            console.log(error)
        }
    },

    async lampooScraper(browser: any) {

    },

    async luxuryScraper(browser: any) {

    },

    async theRealScraper(browser: any) {

    }
};