export const VestaireProductDetailsScraperObject = {
    async findVestaireProductDetails({ urls, browserInstance }: any) {
        try {
            const allUrls: any = [];
            let page = await browserInstance.newPage();
            for (let url of urls) {
                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle2' }); // "https://www.vestiairecollective.com/women/"
                // await page.waitForNavigation();
                // await page.click('#popin_tc_privacy_button_3');
                await page.waitForSelector('.product-search_catalog__flexContainer__Dg0eL');

                for (let i = 0; i < 25; i++) {

                    let urls = await page.$$eval('.product-card_productCard__imageContainer__bYaVi', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a').href);
                        return links;
                    });
                    allUrls.push(...urls);
                    await page.click(`div.pagination_pagination__KrWss > .pagination-button_paginationButton__d33zo.pagination-button_paginationButton--arrow__h8iZ_.pagination-button_paginationButton--showText__pSbz1:last-child`);


                    // await page.click(`div.product-search_catalog__pagination__R7beP > div > button:nth-child(5)`,{ delay: 200 });
                }

                // console.log(allUrls.length);

                // await page.click('.product-card_productCard__imageContainer__bYaVi a');
                // let product: any = {};
                // await page.waitForSelector(".product-main-heading_productTitle__brand___s2rF");
                // product['brand_name'] = await page.$eval(".product-main-heading_productTitle__brand__link__eRLSF", (el: any) => el.textContent);
                // product['name'] = await page.$eval(".product-main-heading_productTitle__name__9tVeL", (el: any) => el.textContent);

                // product['original_price'] = await page.$eval(".product-price_productPrice__price__znOI5 > span:nth-child(1)", (el: any) => el.textContent);
                // const current_price = (await page.$(".product-price_productPrice__price__znOI5 > span:nth-child(2)")) || "";

                // if (current_price) {
                //     product.current_price = await current_price.evaluate((el: any) => el.textContent);
                // } else {
                //     product.current_price = product.original_price;
                // }

                // product['size'] = await page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(1)", (el: any) => el.textContent);
                // product['size'] = product['size'].replace("sizing guide", "");
                // product['condition'] = await page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(2) > span", (el: any) => el.textContent);
                // product['description'] = await page.$eval(".product-description_description__container__YJ_DM > div:nth-child(2) > div", (el: any) => el.textContent);
                // product['url'] = await page.evaluate(() => document.location.href);
                // product['favourite'] = await page.$eval(".product-like-button_like__button__38sAi", (el: any) => el.textContent);
                // product['date_listed'] = await page.$eval(".product-description-list_descriptionList__list__FJb05 > li:nth-child(1) > span:nth-child(2)", (el: any) => el.textContent);

                // console.log({ product })
                // browserInstance.close();
                break;
            }
            return allUrls;
        } catch (error) {
            console.log(error)
        }
    }
};