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

    async findVestaireProductDetails({ urls, browserInstance }: any) {
        try {
            for (let url of urls) {
                let page = await browserInstance.newPage();
                console.log(`Navigating to ${url}...`);
                await page.goto(url); // "https://www.vestiairecollective.com/women/"
                // await page.waitForNavigation();
                // await page.click('#popin_tc_privacy_button_3');
                await page.waitForSelector('.product-search_catalog__flexContainer__Dg0eL');
                const allUrls: any = [];
                // for (let i = 0; i < 10; i++) {
                //     let urls = await page.$$eval('.product-card_productCard__imageContainer__bYaVi', (links: any) => {
                //         links = links.map((el: any) => el.querySelector('a').href);
                //         return links;
                //     });
                //     allUrls.push(...urls);
                //     await page.click(`.pagination_pagination__KrWss button:nth-child(${i + 3})`);
                // }
                let i = 0;
                while (i < 25) {
                    let urls = await page.$$eval('.product-card_productCard__imageContainer__bYaVi', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a').href);
                        return links;
                    });
                    allUrls.push(...urls);
                    const nextPageLink = await page.$('.pagination-button_paginationButton--arrow__h8iZ_.pagination-button_paginationButton--showText__pSbz1');
                    if (!nextPageLink) {
                        break;
                    }
                    const isEllipsisPresent = await page.$('div.pagination_pagination__KrWss > span');
                    if (!isEllipsisPresent) {
                        await Promise.all([
                            page.waitForNavigation(),
                            nextPageLink.click(),
                        ]);
                    } else {
                        const nextPageNumber = await page.evaluate(() => {
                            const ellipsis = document.querySelector('div.pagination_pagination__KrWss > span');
                            const nextPageLink = ellipsis?.nextElementSibling as HTMLLinkElement;
                            return Number(nextPageLink.textContent);
                        });
                        await Promise.all([
                            page.waitForNavigation(),
                            nextPageLink.click(),
                            page.waitForSelector(`.pagination-button_paginationButton--arrow__h8iZ_.pagination-button_paginationButton--showText__pSbz1="${nextPageNumber}"]`)
                        ]);
                    }
                    console.log(i)
                    i++;
                }


                // console.log(allUrls);

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
                browserInstance.close();
                break;
            }
        } catch (error) {
            console.log(error)
        }
    }
};