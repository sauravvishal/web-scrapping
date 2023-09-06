const URL = "https://www.lampoo.com/au/designers/";
const TO_SKIP_URL = "https://www.lampoo.com/au/account/orders-and-returns/";
import { config } from "../config/config";

export const LampooProductDetailsScraperObject = {
    async findLampooProductUrls({ urls, browserInstance, lastPage }: any) {
        let allUrls: any = [];
        try {
            let page = await browserInstance.newPage();
            for (let [index, url] of urls.entries()) {
                if (index > 0) lastPage = 0;
                if (url == URL) continue;

                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle0' });

                let totalPage = 1;
                const pageCount = (await page.$("div.w-full.mx-auto > div:nth-child(4) > div > div > span:nth-child(3)")) || "";
                if (pageCount) {
                    totalPage = await pageCount.evaluate((el: any) => el.textContent);
                }

                let startIndex = 1;
                if (lastPage && lastPage <= totalPage) {
                    startIndex = ++lastPage;
                }
                for (let i = startIndex; i <= +totalPage; i++) {
                    let urls = await page.$$eval('div.group', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a').href);
                        return links;
                    });

                    const urlArr = urls.map((item: any) => {
                        const regex = new RegExp("/", "g");
                        if (item != TO_SKIP_URL) {
                            const website_name = item.split("https://www.lampoo.com/au/products/")[1].replace(regex, "-");
                            return {
                                product_name: website_name.slice(0, website_name.length - 1),
                                url: item,
                                page: i,
                                url_id: config.LAMPOO_ID
                            };
                        }
                    }).filter((i: any) => i);

                    allUrls.push(...urlArr);
                    const ifNextPage = (await page.$("#__next > main > div.w-full.mx-auto > div:nth-child(4) > div > button:nth-child(3) > div")) || "";
                    if (ifNextPage) await page.click("#__next > main > div.w-full.mx-auto > div:nth-child(4) > div > button:nth-child(3) > div");
                }
                // console.log({ index })
                // if (index == 100) break;
            }

            await browserInstance.close();
            return allUrls;
        } catch (error) {
            console.log({ error })
            await browserInstance.close();
            return allUrls;
        }
    },

    async findLampooProductDetails({ urlsToScrap, browserInstance }: any) {
        const products = [];
        try {
            let count = 0;
            let page = await browserInstance.newPage();
            for (let item of urlsToScrap) {
                console.log(`Navigating to ${item.url}...`);
                await page.goto(item.url, { waitUntil: "networkidle0" });
                const product: any = {};

                const ifPdpBtn = (await page.$("#pdp-buttons")) || "";
                if (!ifPdpBtn) continue;

                await page.waitForSelector("#pdp-buttons");

                product["product_url_id"] = item.id;
                product["brand_name"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > a > p", (el: any) => el.textContent);
                product["product_name"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > h1", (el: any) => el.textContent);
                product["original_price"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(1)", (el: any) => el.textContent);
                const currentPrice = (await page.$("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(2)")) || "";
                if (currentPrice) {
                    product["current_price"] = await currentPrice.evaluate((el: any) => el.textContent);
                } else {
                    product["current_price"] = product["original_price"];
                }

                const regex1 = new RegExp("'", "g");
                const regex2 = new RegExp('"', "g");

                const desc = (await page.$("#pdp-buttons > div.mt-4.px-3 > div:nth-child(1) > section > div > div:nth-child(2) > p")) || "";
                if (desc) {
                    const description = await desc.evaluate((el: any) => el.textContent);
                    product["description"] = description.replace(regex1, "''").replace(regex2, '""');
                }

                const condition = await page.$eval("#pdp-buttons > div.mt-4.px-3 > div:nth-child(2) > div", (el: any) => el.textContent);
                product["condition"] = condition.split(":")[1].trim();

                const sizeElem = (await page.$("#product-size-selector > div.css-jz49cj-control > div.css-f1eru0 > div.css-1dimb5e-singleValue > div > div.block")) || "";
                if (sizeElem) {
                    const size = await sizeElem.evaluate((el: any) => el.textContent);
                    product["size"] = size.replace(regex1, "''").replace(regex2, '""');
                } else {
                    const ifPres = (await page.$("#pdp-buttons > div.mt-10 > div > div > div > div > div")) || "";
                    if (ifPres) {
                        product["size"] = await page.$eval("#pdp-buttons > div.mt-10 > div > div > div > div > div", (el: any) => el.textContent);
                        product["size"] = product["size"].replace(regex1, "''").replace(regex2, '""');
                    }
                }

                products.push(product);

                ++count;
                console.log(count)
            }

            await browserInstance.close();
            return products;
        } catch (error) {
            console.log({ error });
            await browserInstance.close();
            return products;
        }
    }
};