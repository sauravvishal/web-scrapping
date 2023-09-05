import { config } from "../config/config";

export const LuxuryProductDetailsScraperObject = {
    async findLuxuryProductUrls({ urls, browserInstance }: any) {
        let productUrls: any = [];
        try {
            let page = await browserInstance.newPage();
            await page.setViewport({ width: 1366, height: 768 });
            for (let [index, url] of urls.entries()) {
                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle2' });
                let count = 0;

                await page.waitForSelector("#root");
                while (count < 10) {
                    ++count;
                    console.log("inside loop", count);
                    // await page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa");

                    //     const ifProducts = (await page.$("#__next > div > main > .product-search_catalogPage__catalog__gOa9L> div > div > div.product-search_catalog__columnProductList__gXnZR > div.product-search_catalog__resultContainer__y0_P_ > ul > li")) || "";
                    //     if (!ifProducts) break;

                    let urls = await page.$$eval('div.Mpp__productGridWrapperNewBase___1Vm7T > div', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a')?.href);
                        return links;
                    });

                    const urlArr = urls.map((item: any) => {
                        if (item) {
                            const brandName = url.split("https://theluxurycloset.com/")[1];
                            const temp = item.split("/");
                            const productName = temp[temp.length - 1];
                            return {
                                product_name: brandName + productName,
                                url: item,
                                page: count,
                                url_id: config.LUXURY_ID
                            };
                        }
                    }).filter((i: any) => i);

                    productUrls.push(...urlArr);
                    console.log(productUrls.length)

                    const ifLastBtn = (await page.$("div.Mpp__paginationItem___1uP0o > ul > div:last-child")) || "";
                    console.log(count, ifLastBtn);
                    if (!ifLastBtn) break;
                    await Promise.all([
                        page.$eval('div.Mpp__paginationItem___1uP0o > ul > div:last-child', (el: any) => el.click()),
                        page.waitForNavigation(),
                    ]);
                    console.log("after 1st loop===")
                    page.on('navigation', () => console.log('Navigated!'));
                    await page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa")
                }
                break;
            }
            console.log("after for loop");
            await browserInstance.close();
            return productUrls;
        } catch (error) {
            console.log({ error });
            await browserInstance.close();
            return productUrls;
        }
    },

    async findLuxuryProductDetails({ urls, browserInstance }: any) {
        try {

        } catch (error) {
            console.log(error)
        }
    }
};