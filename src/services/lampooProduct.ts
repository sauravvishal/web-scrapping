const URL = "https://www.lampoo.com/au/designers/";
const TO_SKIP_URL = "https://www.lampoo.com/au/account/orders-and-returns/";

export const LampooProductDetailsScraperObject = {
    async findLampooProductDetails({ urls, browserInstance, lastPage }: any) {
        let allUrls: any = [];
        try {
            let page = await browserInstance.newPage();
            for (let [index, url] of urls.entries()) {
                if (index > 0) lastPage = 0;
                if (url == URL) continue;

                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle0' });

                const totalPage = await page.$eval("div.w-full.mx-auto > div:nth-child(4) > div > div > span:nth-child(3)", (el: any) => el.textContent);

                let startIndex = 1;
                if (lastPage && lastPage < totalPage) {
                    startIndex = ++lastPage;
                }
                for (let i = startIndex; i <= +totalPage; i++) {
                    if (i > 1) {
                        if (url[url.length - 1] != "/") url += "/";
                        await page.goto(`${url}?p=${i}`);
                        await page.waitForNavigation();
                    }

                    let urls = await page.$$eval('div.group', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a').href);
                        return links;
                    });

                    const urlArr = urls.map((item: any) => {
                        const regex = new RegExp("/", "g");
                        if (item != TO_SKIP_URL) {
                            const website_name = item.split("https://www.lampoo.com/au/products/")[1].replace(regex, "-");
                            return {
                                website_name: website_name.slice(0, website_name.length - 1),
                                url: item,
                                page: i
                            };
                        }
                    }).filter((i: any) => i);

                    allUrls.push(...urlArr);
                }
            }

            await browserInstance.close();
            return allUrls;
        } catch (error) {
            console.log({ error })
            await browserInstance.close();
            return allUrls;
        }
    }
};