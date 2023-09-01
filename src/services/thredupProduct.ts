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
        console.log(url);

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

        for (let i = startIndex; i <= +totalPage; i++) {
          const ifPopup = (await page.$("div.content > div.w_J3p7TTX1XZ71LeCrat.bJIW1yz2fvC7uVLGNW2a > div.oGz_rN1aCFDcFbEwgDkf > button")) || "";
          if (ifPopup) await page.click("div.content > div.w_J3p7TTX1XZ71LeCrat.bJIW1yz2fvC7uVLGNW2a > div.oGz_rN1aCFDcFbEwgDkf > button");
          const ifProductExists = (await page.$("div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2")) || "";
          if (!ifProductExists) break;
          await page.waitForSelector("div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2")
          let urls = await page.$$eval('div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2', (links: any) => {
            links = links.map((el: any) => el.querySelector('a').href);
            return links;
          });

          const urlArr = urls.map((item: any) => {
            const regex = new RegExp("/", "g");
            if (item != TO_SKIP_URL) {
              const website_name = item.split("https://www.thredup.com/product/")[1].replace(regex, "-");
              return {
                product_name: website_name.slice(0, website_name.length - 1),
                url: item,
                page: i,
                url_id: 2
              };
            }
          }).filter((i: any) => i);

          allUrls.push(...urlArr);
          console.log(i);
          
          const ifNextPage = (await page.$("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child")) || "";
          if (ifNextPage) await page.click("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child");
          // if (i == 2) break; 
        }
        if (index == 10) break;
      }
      await browserInstance.close();
      return allUrls;
    } catch (error) {
      console.log({ error })
      await browserInstance.close();
      return allUrls;
    }
  },

  // async findLampooProductDetails({ urlsToScrap, browserInstance }: any) {
  //     const products = [];
  //     try {
  //         let count = 0;
  //         let page = await browserInstance.newPage();
  //         for (let item of urlsToScrap) {
  //             console.log(`Navigating to ${item.url}...`);

  //             await page.goto(item.url, { waitUntil: "networkidle0" });
  //             const product: any = {};

  //             const ifPdpBtn = (await page.$("#pdp-buttons")) || "";
  //             if (!ifPdpBtn) continue;

  //             await page.waitForSelector("#pdp-buttons");

  //             product["product_url_id"] = item.id;
  //             product["brand_name"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > a > p", (el: any) => el.textContent);
  //             product["product_name"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > h1", (el: any) => el.textContent);
  //             product["original_price"] = await page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(1)", (el: any) => el.textContent);
  //             const currentPrice = (await page.$("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(2)")) || "";
  //             if (currentPrice) {
  //                 product["current_price"] = await currentPrice.evaluate((el: any) => el.textContent);
  //             } else {
  //                 product["current_price"] = product["original_price"];
  //             }

  //             const regex1 = new RegExp("'", "g");
  //             const regex2 = new RegExp('"', "g");

  //             const desc = (await page.$("#pdp-buttons > div.mt-4.px-3 > div:nth-child(1) > section > div > div:nth-child(2) > p")) || "";
  //             if (desc) {
  //                 const description = await desc.evaluate((el: any) => el.textContent);
  //                 product["description"] = description.replace(regex1, "''").replace(regex2, '""');
  //             }

  //             const condition = await page.$eval("#pdp-buttons > div.mt-4.px-3 > div:nth-child(2) > div", (el: any) => el.textContent);
  //             product["condition"] = condition.split(":")[1].trim();

  //             const sizeElem = (await page.$("#product-size-selector > div.css-jz49cj-control > div.css-f1eru0 > div.css-1dimb5e-singleValue > div > div.block")) || "";
  //             if (sizeElem) {
  //                 const size = await sizeElem.evaluate((el: any) => el.textContent);
  //                 product["size"] = size.replace(regex1, "''").replace(regex2, '""');
  //             } else {
  //                 product["size"] = await page.$eval("#pdp-buttons > div.mt-10 > div > div > div > div > div", (el: any) => el.textContent);
  //                 product["size"] = product["size"].replace(regex1, "''").replace(regex2, '""');
  //             }

  //             products.push(product);

  //             ++count;
  //             console.log(count)
  //             if (count === 50) break;
  //         }

  //         await browserInstance.close();
  //         return products;
  //     } catch (error) {
  //         console.log({ error });
  //         await browserInstance.close();
  //         return products;
  //     }
  // }
}
