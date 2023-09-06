import { config } from "../config/config";

export const theRealProductDetailsScraperObject = {

    async findTheRealProductUrls({ urls, browserInstance, lastPage }: any) {
        let allUrls: any = [];
        //let url = "https://www.therealreal.com/designers/alice-olivia?first=120&page=1&path%5B%5D=alice-olivia";
        try {
            let page = await browserInstance.newPage();
            for (let [index, url] of urls.entries()) {
                if (index > 0) lastPage = 0;
                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle0' });

                let totalPage = 1;
                const pageCount = (await page.$("a.pagination__number.js-pagination__number.spagination__number--highlighted")) || "";
                console.log("hello")
                if (pageCount) {
                    console.log("maybe");
                    //      //Current Page, Page 17
                    totalPage = await pageCount.evaluate((el: any) => el.getAttribute("aria-label").split(',')[1]);
                    console.log("worked")
                }
                console.log(totalPage);

                let startIndex = 1;
                if (lastPage && lastPage < totalPage) {
                    startIndex = ++lastPage;
                }

                await page.waitForSelector(".plp-primary-content ");
                const ifProductsExist = (await page.$(".product-grid")) || "";
                if (!ifProductsExist) continue;

                for (let i = startIndex; i <= +totalPage; i++) {
                    await page.waitForSelector("div.plp-primary-content > div.js-product-grid.product-grid-wrapper");
                    let urls = await page.$$eval('div.product-card-wrapper.js-product-card-wrapper', (links: any) => {
                        links = links.map((el: any) => el.querySelector('a.product-card.js-plp-product-card ').href);
                        return links;
                    });
                    const urlArr = urls.map((item: any) => {
                        if (item) {

                            const key = url.split("/")[4].split("?")[0];
                            return {
                                product_name: key,
                                url: item,
                                page: i,
                                url_id: config.REAL_ID
                            };
                        }
                    }).filter((i: any) => i);
                    allUrls.push(...urlArr);

                    const ifNextPage = (await page.$(".chevron-arrow-right:nth-child(2)")) || "";
                    if (ifNextPage) await page.click(".chevron-arrow-right:nth-child(2)");
                    //await page.waitfornavigation(".plp-primary-content");
                }
            }
            console.log(allUrls.length);
            await browserInstance.close();
            return allUrls;
        } catch (error) {
            console.log({ error })
            await browserInstance.close();
            return allUrls;
        }
    },

    async findTheRealProductDetails({ urlsToScrap, browserInstance }: any) {
        const products = [];
        try {
            let count = 0;
            let page = await browserInstance.newPage();
            for (let item of urlsToScrap) {
            //let item = "https://www.therealreal.com/products/women/clothing/dresses/alice-olivia-v-neck-mini-dress-iiae7";
            console.log(`Navigating to ${item}...`);
            await page.goto(item, { waitUntil: "networkidle0" });
            const product: any = {};

            const ifPdpBtn = (await page.$("#pdp-buttons")) || "";
                if (!ifPdpBtn) continue;

            await page.waitForSelector(".pdp-two-cols");

            product["product_url_id"] = item;
            product["brand_name"] = await page.$eval("a[data-event-source]", (el: any) => el.textContent);
            product["product_name"] = await page.$eval("div.product-name", (el: any) => el.textContent);

            const original = (await page.$("div.price-info > div.price-info-values > div.price-info-values__original-price"));
            if (original) {
                product["original_price"] = await page.$eval("div.price-info > div.price-info-values > div.price-info-values__original-price", (el: any) => el.textContent);
                product["current_price"] = await page.$("div.price-info > div.price-info-values > div.price-info-values__final-price-discounted", (el: any) => el.textContent);
            } else {
                const originalPriceElement = await page.$("div.price-info > div.price-info-values > div.price-info-values__final-price");
                product["original_price"] = await page.evaluate((el: any) => el.textContent, originalPriceElement);
                product["current_price"] = product["original_price"];
            }

        const regex1 = new RegExp("'", "g");
        const regex2 = new RegExp('"', "g");

        const desc = (await page.$("#pdp-details-Description > div > ul")) || "";
        if (desc) {
            const description = await desc.evaluate((el: any) => el.textContent);
            product["description"] = description.replace(regex1, "' '").replace(regex2, ' ');
        }

        const condition = await page.$eval("#pdp-details-Condition > div.condition__wrapper > ul > li.condition__attribute--active.condition__attribute > div", (el: any) => el.textContent);
        product["condition"] = condition;

        const sizeElem = (await page.$("#pdp-details-Details > ul.product-details-group")) || "";
        if (sizeElem) {
            const size = await sizeElem.evaluate((el: any) => el.textContent);
            product["size"] = size.replace(regex1, "''").replace(regex2, ', ');
        } else {
            product["size"] = await page.$eval("div.pdp-title__size > div", (el: any) => el.textContent);
            product["size"] = product["size"].replace(regex1, "''").replace(regex2, ' ');
        }
        product["favourites"] = await page.$eval("div.obsessed-and-obsession-count > p", (el: any) => el.textContent);
        products.push(product);
        console.log(product);
         ++count;
         console.log(count)
         break;
         }

        await browserInstance.close();
        return products;
    } catch(error) {
        console.log({ error });
        await browserInstance.close();
        return products;
    }
}
};