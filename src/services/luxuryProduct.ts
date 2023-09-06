import { config } from "../config/config";

export const LuxuryProductDetailsScraperObject = {
    async findLuxuryProductUrls({ urls, browserInstance, lastPage }: any) {
        let productUrls: any = [];
        try {
            let page = await browserInstance.newPage();
            await page.setViewport({ width: 1366, height: 768 });
            for (let [index, url] of urls.entries()) {
                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle2' });
                let count = 0;

                await page.waitForSelector("#root");
                let currentUrl = "";
                while (true) {
                    ++count;
                    await page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa", { waitUntil: 'load' });
                    if (lastPage) {
                        if (count === 1) {
                            await page.$eval('div.Mpp__paginationItem___1uP0o > ul > div:last-child', (el: any) => el.click());
                            continue;
                        }
                        if (count === 2) {
                            currentUrl = await page.url();
                            const splitUrl = currentUrl.split("&page=");
                            const baseUrl = splitUrl[0];
                            const toNavigate = `${baseUrl}&page=${lastPage + 1}`;
                            console.log(`Navigating to ${toNavigate}...`);
                            count = ++lastPage;
                            await page.goto(toNavigate, { waitUntil: 'networkidle2' });
                        }
                    }


                    if (count > 1) currentUrl = await page.url();
                    if (count === 2) {
                        console.log(`Navigating to ${currentUrl}...`);
                        await page.goto(currentUrl, { waitUntil: 'networkidle2' });
                    }

                    await page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa");

                    let urls = await page.$$eval('div.Mpp__productGridWrapperNewBase___1Vm7T > div', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a')?.href);
                        return links;
                    });

                    const urlArr = urls.map((item: any) => {
                        if (item) {
                            const brandName = url.split("https://theluxurycloset.com/")[1] + "/";
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
                    // console.log(productUrls.length);

                    const ifLastBtn = (await page.$("div.Mpp__paginationItem___1uP0o > ul > div:last-child")) || "";
                    // console.log("count====", count);
                    // if (count === 100) break;
                    if (!ifLastBtn) break;

                    if (count === 1) {
                        await page.$eval('div.Mpp__paginationItem___1uP0o > ul > div:last-child', (el: any) => el.click());
                    } else {
                        const splitUrl = currentUrl.split("&page=");
                        const pageNo = +splitUrl[1];
                        const baseUrl = splitUrl[0];
                        const toNavigate = `${baseUrl}&page=${pageNo + 1}`;

                        console.log(`Navigating to ${toNavigate}...`);
                        await page.goto(toNavigate, { waitUntil: 'networkidle2' });
                    }
                }
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

    async findLuxuryProductDetails({ urlsToScrap, browserInstance }: any) {
        const allProducts: any = [];
        try {
            let page = await browserInstance.newPage();
            for (let item of urlsToScrap) {
                console.log(`Navigating to ${item.url}...`);
                await page.goto(item.url, { waitUntil: 'networkidle2' });
                const product: any = {};
                
                await page.waitForSelector("#root > .DesktopWidth__base___3ZRAa");

                product["product_url_id"] = item.id;
                product['brand_name'] = await page.$eval(".ProductDetailsCard__newBrandName___8h5-f", (el: any) => el.textContent);
                product['product_name'] = await page.$eval(".ProductDetailsCard__productName___1xdQ-", (el: any) => el.textContent);

                const currentPriceHandle1 = (await page.$(".ProductPriceV2__newProductPrice___3VQFU")) || "";
                const originalPriceHandle1 = (await page.$(".ProductPriceV2__newDiscountedOfferPrice___lNSAA")) || "";
                const originalPriceHandle2 = (await page.$(".ProductPriceV2__newStrikeOffPrice___G-L9p")) || "";
                const currentPriceHandle2 = (await page.$(".ProductPriceV2__newVoucherAmount___3nnI_")) || "";
                const originalPriceHandle3= (await page.$(".ProductPriceV2__newProductPrice___3VQFU")) || "";

                if (currentPriceHandle1) {
                    product['current_price'] = await currentPriceHandle1.evaluate((el: any) => el.textContent);
                }
                if (currentPriceHandle2) {
                    product['current_price'] = await currentPriceHandle2.evaluate((el: any) => el.textContent);
                }
                if (originalPriceHandle1) {
                    const price = await originalPriceHandle1.evaluate((el: any) => el.textContent);
                    product["original_price"] = price.split('Off on')[1].replace(')', '');
                }
                if (originalPriceHandle2) {
                    product["original_price"] = await originalPriceHandle2.evaluate((el: any) => el.textContent);
                }
                if (!product.original_price && originalPriceHandle3) {
                    product["original_price"] = await originalPriceHandle3.evaluate((el: any) => el.textContent);
                }

                if (!product.current_price) product['current_price'] = product.original_price;

                product['condition'] = await page.$eval(".ProductConditionAndAuthenticStrip__newSppProductDescription___Vo8TJ", (el: any) => el.textContent);

                const sizeHandle = (await page.$(".ProductDetailsCard__newSize___2tbsp")) || "";

                if (sizeHandle) {
                    product['size'] = await sizeHandle.evaluate((el: any) => el.textContent);
                } else {
                    await page.$eval('div.ProductInformationNewSpp__base___1cY2P > div:nth-child(3) > div', (el: any) => el.click());

                    let sizes = await page.$$eval('.ProductInformationNewSpp__sizeAndFitListBase___1h-gl li', (item: any) => {
                        item = item.map((el: any) => {
                            const anchors = Array.from(document.querySelectorAll('.ProductInformationNewSpp__sizeAndFitListBase___1h-gl > li span span'));
                            return anchors.map((anchor: any) => anchor.textContent.trim());
                        });
                        return item;
                    });

                    product['size'] = sizes[0].join(" ").trim();
                }

                await page.$eval('div.ProductInformationNewSpp__base___1cY2P > div:nth-child(2) > div', (el: any) => el.click());
                let description = await page.$eval(".HtmlText__footer___7DbCF", (el: any) => el.textContent);
                const regex1 = new RegExp("'", "g");
                const regex2 = new RegExp('"', "g");
                product['description'] = description.replace(regex1, "''").replace(regex2, '""');

                product['url'] = await page.evaluate(() => document.location.href);

                const isSold = ((await page.$(".SppButtonWrapper__soldOutWrapper___2akOv"))) || "";
                if (isSold) product["is_sold"] = true;

                allProducts.push(product);
            }
            browserInstance.close();
            return allProducts;
        } catch (error) {
            console.log(error)
            browserInstance.close();
            return allProducts;
        }
    }
};