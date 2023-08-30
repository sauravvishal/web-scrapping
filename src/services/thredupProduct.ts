import { error } from "console";

export const thredupProductDetailsScraperObject = {
    async findThredupProductDetails({ urls, browserInstance }: any) {
        try {
            for (let url of urls) {
                let page = await browserInstance.newPage();
                console.log(`Navigating to ${url}...`);
                await page.goto("https://www.thredup.com/women?department_tags=women");
             await page.waitForSelector('div.u-relative > div.grid.u-justify-center > div:nth-child(1)');
            const allUrls: any = [];
            await page.click('div.u-relative > div.grid > div:nth-child(1) a');
                let product: any = {};
                await page.waitForSelector(".dbhnmqvaB2E26dQvyBVl");
                product['brand_name'] = await page.$eval("h1.ui-visually-hidden", (el: any) => el.textContent);
                product['brand_name'] = product['brand_name'].replace("Leggings", "");
                product['name'] = await page.$eval("span.wc1Wg5BbXVFBe4MHxY3r", (el: any) => el.textContent);

                //product['original_price'] = await page.$eval("", (el: any) => el.textContent);
                // const current_price = (await page.$(".product-price_productPrice__price__znOI5 > span:nth-child(2)")) || "";

                // if (current_price) {
                //     product.current_price = await current_price.evaluate((el: any) => el.textContent);
                // } else {
                //     product.current_price = product.original_price;
                // }
                // await page.waitForSelector("ul.jgiusFKudDUr6aL432nM");


                const elements = await page.$x('/html/body/div[1]/div/main/div/div[2]/section/div[2]/div[2]/div/div/div[2]/ul/li');

                if (elements.length > 0) {
                  const textContent = await page.evaluate((el: any) => el.textContent, elements[0]);
                  product['condition'] = textContent;
                  console.log(product['condition']);
                } else {
                  console.log('Element not found.');
                }
                


               
                const liElements = await page.$$('.qIe8uEwlaO9qd8EVVIlr > ul.jgiusFKudDUr6aL432nM');
                for (let i = 0; i < liElements.length; i++) {
                  const liElement = liElements[i];
                  const liContent = await liElement.evaluate((el: any) => el.textContent.trim());
                  product['description'] = product['description'] || []; // Initialize the array
                  product['description'].push(liContent); // Add the content to the array
                }

                product['size'] = await page.$eval(".P9j6cGJ6kvC9bBgLk4pE", (el: any) => el.textContent);
                
                product['url'] = await page.evaluate(() => document.location.href);
                product['favourite'] = await page.$eval(".XMAeTtijAYS07yZeY2vQ > div > .u-ml-1xs", (el: any) => el.textContent);
                // product['date_listed'] = await page.$eval(".product-description-list_descriptionList__list__FJb05 > li:nth-child(1) > span:nth-child(2)", (el: any) => el.textContent);

                console.log({ product });
                // browserInstance.close();
                break;
        } 
    }catch (error) {
            console.log(error)
        }
    }
};
