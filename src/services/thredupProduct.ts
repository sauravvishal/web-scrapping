import { config } from "../config/config";
import { Products } from "../database/entity/Product";

const TO_SKIP_URL = [
  "https://www.thredup.com/giftcards",
  "https://www.thredup.com/",
  "https://www.thredup.com/cleanout",
  "https://www.thredup.com/about",
  "https://www.thredup.com/saved/favorites",
  "https://www.thredup.com/my",
  "https://www.thredup.com/cart",
  "https://www.thredup.com/brands",
  "https://www.thredup.com/kids",
  "https://www.thredup.com/rescues",
  "https://www.thredup.com/cleanout/consignment",
  "https://www.thredup.com/legal/tou",
  "https://www.thredup.com/legal/privacy-policy",
  "https://www.thredup.com/legal/accessibility",
  "https://www.thredup.com/contact",
  "https://www.thredup.com/bg",
  "https://www.thredup.com/resale",
  "https://www.thredup.com/careers",
  "https://www.thredup.com/support",
  "https://www.thredup.com/brands/designer/A",
  "https://www.thredup.com/brands/designer/C",
  "https://www.thredup.com/brands/designer/M",
  "https://www.thredup.com/brands/designer/R",
  "https://www.thredup.com/brands/designer/S"
];

export const thredupProductDetailsScraperObject = {
  async findThredupProductUrls({ urls, browserInstance, lastPage }: any) {
    let allUrls: any = [];
    try {
      let page = await browserInstance.newPage();
      for (let [index, url] of urls.entries()) {
        if (index > 0) lastPage = 0;
        if (TO_SKIP_URL.includes(url)) continue;

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0' });

        let totalPage = 1;
        const pageCount = (await page.$(".kOQ5Zl09UDEBeP3n_NpF")) || "";
        if (pageCount) {
          totalPage = await pageCount.evaluate((el: any) => el.getAttribute("max"));
        }

        let startIndex = 1;
        if (lastPage && lastPage < totalPage) {
          startIndex = ++lastPage;
        }

        await page.waitForSelector("#root > div > main > div > div.ui-container.large.u-px-2x > div.ui-container.large.u-flex > div.u-flex-1.u-flex-shrink-0.u-overflow-auto > div.u-relative > div:nth-child(2)");
        const ifProductsExist = (await page.$(".Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2")) || "";
        if (!ifProductsExist) continue;

        for (let i = startIndex; i <= +totalPage; i++) {
          await page.waitForSelector("div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2");
          let urls = await page.$$eval('div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2', (links: any) => {
            links = links.map((el: any) => el.querySelector('a').href);
            return links;
          });

          const urlArr = urls.map((item: any) => {
            const regex = new RegExp("/", "g");
            if (item != TO_SKIP_URL) {
              const key = url.split("?brand_name_tags=")[1];
              return {
                product_name: key,
                url: item,
                page: i,
                url_id: config.THREDUP_ID
              };
            }
          }).filter((i: any) => i);

          allUrls.push(...urlArr);
          //await page.waitfornavigation();
          const ifNextPage = (await page.$("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child")) || "";
          if (ifNextPage) await page.click("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child");
        }
        console.log(allUrls.length);
      }
      await browserInstance.close();
      return allUrls;
    } catch (error) {
      console.log({ error })
      await browserInstance.close();
      return allUrls;
    }
  },

  async findThredupProductDetails({ urlsToScrap, browserInstance }: any) {
    const products = [];
    try {
      let count = 0;
      let page = await browserInstance.newPage();

      for (let item of urlsToScrap) {
        console.log(`Navigating to ${item.url}...`);
        await page.goto(item.url, { waitUntil: "networkidle0" });
        await page.waitForSelector(".kcJ47Ktxoind4bGkMYAt");
        const product: any = {};

        product["product_url_id"] = item.id;
        product["brand_name"] = await page.$eval("div.u-flex.LarhPVhimXuUmTnRJDlM.pf7s4T1n1ycRZfLe5veB > div:nth-child(1) > a", (el: any) => el.textContent);
        product["product_name"] = await page.$eval(".wc1Wg5BbXVFBe4MHxY3r", (el: any) => el.textContent);
        
        const ifSold = await page.$eval("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > button", (el: any) => el.textContent);

        if (ifSold != "Sold") {
          const priceElem = (await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.u-text-20.u-font-bold.u-mr-1xs")) || "";
          if (priceElem) {
            const originalPriceElement = await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.u-text-20.u-font-bold.u-mr-1xs");
            product["original_price"] = await page.evaluate((el: any) => el.textContent, originalPriceElement);
            const currentPriceElement = await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.price.u-font-bold.u-text-20.u-text-alert");
            product["current_price"] = await page.evaluate((el: any) => el.textContent, currentPriceElement);
          } else {
            const temp = (await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.u-text-20.u-font-bold.u-mr-1xs")) || "";
            if (temp) {
              const originalPriceElement = await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.u-text-20.u-font-bold.u-mr-1xs");
              product["original_price"] = await page.evaluate((el: any) => el.textContent, originalPriceElement);
              const currentPriceElement = await page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.price.u-font-bold.u-text-20.u-text-alert");
              product["current_price"] = await page.evaluate((el: any) => el.textContent, currentPriceElement);
            } else {
              const originalPriceElement = await page.$("#root > div > main > div > div > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span");
              product["original_price"] = await page.evaluate((el: any) => el.textContent, originalPriceElement);
              product["current_price"] = product["original_price"];
            }
          }
        } else {
          product["is_sold"] = true;
          product["original_price"] = "sold";
          product["current_price"] = "sold";
        }

        const regex1 = new RegExp("'", "g");
        const regex2 = new RegExp('"', "g");

        const desc = (await page.$(".jgiusFKudDUr6aL432nM")) || "";
        if (desc) {
          const description = await desc.evaluate((el: any) => el.textContent);
          product["description"] = description.replace(regex1, "''").replace(regex2, '""');
        }
        
        product["condition"] = await page.$eval("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > ul > li", (el: any) => el.textContent);

        const sizeElem = (await page.$(".P9j6cGJ6kvC9bBgLk4pE")) || "";
        if (sizeElem) {
          const size = await sizeElem.evaluate((el: any) => el.textContent);
          product["size"] = size.replace(regex1, "''").replace(regex2, '""');
        } else {
          product["size"] = await page.$eval(" div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > ul > li", (el: any) => el.textContent);
          product["size"] = product["size"].replace(regex1, "''").replace(regex2, '""');
        }
        product["favourites"] = await page.$eval("button[aria-label='favorite'] > div > span", (el: any) => el.textContent);
        product["favourites"] = +product.favourites.split(" ")[0];
        products.push(product);
        // ++count;
        // console.log(count)
      }
      await browserInstance.close();

      return products;
    } catch (error) {
      console.log({ error });
      await browserInstance.close();
      return products;
    }
  }
}
