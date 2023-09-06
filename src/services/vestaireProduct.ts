import { config } from "../config/config";

export const VestaireProductDetailsScraperObject = {
    async findVestaireProductUrls({ urls, browserInstance }: any) {
        const productUrls: any = [];
        try {
            const TO_SKIP_URLS = [
                "https://www.vestiairecollective.com/new-items/",
                "https://www.vestiairecollective.com/brands/",
                "https://www.vestiairecollective.com/women/",
                "https://www.vestiairecollective.com/men/",
                "https://www.vestiairecollective.com/we-love/",
                "https://www.vestiairecollective.com/vintage/",
                "https://www.vestiairecollective.com/brands/#",
                "https://www.vestiairecollective.com/kids/",
                "https://www.vestiairecollective.com/g/express-delivery/",
                "https://www.vestiairecollective.com/g/direct-shipping/",
                "https://www.vestiairecollective.com/new-items/#country=US",
                "https://www.vestiairecollective.com/journal/our-concept-page/"
            ];

            let page = await browserInstance.newPage();
            for (let [index, url] of urls.entries()) {
                // if (index === 14) break;
                if (!TO_SKIP_URLS.includes(url)) {
                    console.log(`Navigating to ${url}...`);
                    await page.goto(url, { waitUntil: 'networkidle0' });
                    let count = 0;

                    const ifPageNotFound = (await page.$("#__next > div > section")) || "";
                    if (ifPageNotFound) continue;

                    await page.waitForSelector("div.product-search_bottomSectionWrapper__OCHXi");

                    while (true) {
                        await page.waitForSelector("#__next > div > main > .product-search_catalogPage__catalog__gOa9L > div > div");
                        await page.waitForSelector("div.product-search_catalog__sortActionBar__mhZHl.vc-d-md-flex-title-m > .product-search_catalog__pagination__R7beP > .pagination_pagination__KrWss");
                        const ifProducts = (await page.$("#__next > div > main > .product-search_catalogPage__catalog__gOa9L> div > div > div.product-search_catalog__columnProductList__gXnZR > div.product-search_catalog__resultContainer__y0_P_ > ul > li")) || "";
                        if (!ifProducts) break;
                        if (count) {
                            await page.goto(`${url}/p-${count + 1}`, { waitUntil: 'networkidle0' });
                        }
                        ++count;

                        let urls = await page.$$eval('div.product-search_catalog__resultContainer__y0_P_ > ul li', (links: any) => {
                            links = links.map((el: any) => el.querySelector('div.product-card_productCard__BF_Iz.product-search_catalog__productCardContainer__A2YBW > div.product-card_productCard__imageContainer__bYaVi a')?.href);
                            return links;
                        });

                        const urlArr = urls.map((item: any) => {
                            if (item) {
                                const brandName = url.split("https://us.vestiairecollective.com/")[1];
                                const temp = item.split("/");
                                const productName = temp[temp.length - 1].replace(".shtml", "");
                                return {
                                    product_name: brandName + productName,
                                    url: item,
                                    page: count,
                                    url_id: config.VESTAIRE_ID
                                };
                            }
                        }).filter((i: any) => i);

                        productUrls.push(...urlArr);
                        console.log(productUrls.length)
                        const isDisabled = await page.$eval("div.product-search_catalog__sortActionBar__mhZHl.vc-d-md-flex-title-m > .product-search_catalog__pagination__R7beP > .pagination_pagination__KrWss > button:last-child", (button: any) => button.disabled);
                        // console.log(count);
                        if (isDisabled) break;
                    }
                    // console.log("after while loop", index);
                    // break;
                }
                // if (productUrls.length > 5000) break;
            }
            console.log("after for loop");
            await browserInstance.close();
            return productUrls;
        } catch (error) {
            console.log(error);
            await browserInstance.close();
            return productUrls;
        }
    },

    async findVestaireProductDetails({ urlsToScrap, browserInstance }: any) {
        const allProducts: any = [];
        try {
            let count = 0;
            let page = await browserInstance.newPage();
            for (let item of urlsToScrap) {
                console.log(`Navigating to ${item.url}...`);
                await page.goto(item.url, { waitUntil: "networkidle0" });
                const product: any = {};
                const ifTypeOne = (await page.$(".pdp-top_pdpTop__mnbS4")) || "";
                const ifTypeTwo = (await page.$(".hero-pdp_heroPDP__iJXuC")) || "";

                if (ifTypeOne) {
                    await page.waitForSelector(".product-main-heading_productTitle__brand___s2rF");
                    product["product_url_id"] = item.id;
                    product['brand_name'] = await page.$eval(".product-main-heading_productTitle__brand__link__eRLSF", (el: any) => el.textContent);
                    product['product_name'] = await page.$eval(".product-main-heading_productTitle__name__9tVeL", (el: any) => el.textContent);

                    product['original_price'] = await page.$eval(".product-price_productPrice__price__znOI5 > span:nth-child(1)", (el: any) => el.textContent);
                    const current_price = (await page.$(".product-price_productPrice__price__znOI5 > span:nth-child(2)")) || "";

                    if (current_price) {
                        product.current_price = await current_price.evaluate((el: any) => el.textContent);
                    } else {
                        product.current_price = product.original_price;
                    }

                    product['size'] = await page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(1)", (el: any) => el.textContent);
                    product['size'] = product['size'].replace("sizing guide", "");
                    product['condition'] = await page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(2) > span", (el: any) => el.textContent);
                    product['description'] = await page.$eval(".product-description_description__container__YJ_DM > div:nth-child(2) > div", (el: any) => el.textContent);
                    product['url'] = await page.evaluate(() => document.location.href);
                    product['favourite'] = await page.$eval(".product-like-button_like__button__38sAi", (el: any) => el.textContent);
                    product['date_listed'] = await page.$eval(".product-description-list_descriptionList__list__FJb05 > li:nth-child(1) > span:nth-child(2)", (el: any) => el.textContent);
                }

                if (ifTypeTwo) {
                    await page.waitForSelector(".hero-pdp_heroPDP__iJXuC");
                    product["product_url_id"] = item.id;
                    product['brand_name'] = await page.$eval(".hero-pdp-header_heroPDPHeader__brand__XvAUi.vc-title-s", (el: any) => el.textContent);
                    product['product_name'] = await page.$eval(".hero-pdp-header_heroPDPHeader__productName___Opjc", (el: any) => el.textContent);

                    const ifPrice = (await page.$("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > span")) || "";

                    if (ifPrice) {
                        product['original_price'] = await page.$eval("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > span", (el: any) => el.textContent);
                        product['original_price'] = product.original_price.replace("Sold at", "").trim();
                        product['current_price'] = product.original_price;
                    } else {
                        product['original_price'] = await page.$eval("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > p >span", (el: any) => el.textContent);
                        product['original_price'] = product.original_price.replace("Sold at", "").trim();
                        product['current_price'] = product.original_price;
                    }

                    product['size'] = await page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(1)", (el: any) => el.textContent);
                    const desc = (await page.$(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(3)")) || "";

                    if (desc) {
                        product['condition'] = await page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(2)", (el: any) => el.textContent);
                        product['description'] = await desc.evaluate((el: any) => el.textContent);
                    } else {
                        product['description'] = await page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(2)", (el: any) => el.textContent);
                    }

                    product['url'] = await page.evaluate(() => document.location.href);
                    product['favourite'] = await page.$eval(".hero-pdp_heroPDP__gallery__likeBtn__ZNMWK.product-like-button_like__button__38sAi.product-like-button_like__button--textHidden__zrRxN", (el: any) => el.textContent);
                    product["is_sold"] = true;
                }
                
                if (Object.keys(product).length) allProducts.push(product);
            }
            browserInstance.close();
            return allProducts;
        } catch (error) {
            console.log(error)
            browserInstance.close();
            return allProducts;
        }
    }
}