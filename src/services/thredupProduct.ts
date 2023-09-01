const TO_SKIP_URL = [
  "https://www.thredup.com/giftcards",
  "https://www.thredup.com/",
  "https://www.thredup.com/cleanout",
  "https://www.thredup.com/about",
  "https://www.thredup.com/saved/favorites",
  "https://www.thredup.com/my",
  "https://www.thredup.com/cart"
];

export const thredupProductDetailsScraperObject = {
  async findThredupProductUrls({ urls, browserInstance }: any) {
    const products = [];
    let page = await browserInstance.newPage();
    try {

      let allUrls: any = [];

      for (let url of urls) {
        if (url == URL) continue;

        //let url = "https://www.thredup.com/women?department_tags=women"
        if (TO_SKIP_URL.includes(url)) {
          continue;
        }
        console.log(`Navigating to ${url}...`);

        await page.goto(url, { waitUntil: 'networkidle0' });

        let urls = await page.$$eval('div.Vb607oOokVxxYVL7SQwh', (links: any) => {
          links = links.map((el: any) => el.querySelector('a').href);
          return links;
        });
        console.log(urls.length);

        let startIndex = 1;
        const selector = 'button[data-action="next"]';
        const lastPage = await page.$eval(selector, (button: any) => button.disabled);

        for (let i = startIndex; i <= +lastPage; i++) {

          if (i > 1) {
            if (url[url.length - 1] != "/") url += "/";
            await page.goto(`${url}&page=${i}`);
            await page.waitForNavigation();
          }

          await page.waitForSelector(selector);
          await page.click(selector);

          //const urlArr = urls.map((item: any, i: number) => {
          //     //     const regex = new RegExp("/", "g");
          //     //     const website_name = item.split("https://www.thredup.com/product/")[1].replace(regex, "-");
          //     //     console.log(website_name);
          //     //     return {
          //     //       product_name: website_name.slice(0, website_name.length - 1),
          //     //       url: item,
          //     //       page: i,
          //     //       url_id: 2
          //     //     };
          //     //   })
          //     //   .filter((i: any) => i !== null);

          //     //console.log(urlArr);
          //     //allUrls.push(...urlArr);
        }
      }
      console.log(allUrls.length)
      browserInstance.close();
    } catch (error) {
      console.log(error);
    }
  },

  //  async findThredupProductDetails({ urlsToScrap, browserInstance }: any) {
  //   const products = [];
  //   let page = await browserInstance.newPage();
  //   try {
  //     await page.click('div.Vb607oOokVxxYVL7SQwh');
  //     let product: any = {};
  //     await page.waitForSelector(".wAhTkKjWOmWyIy2F13MZ");
  //     product['brand_name'] = await page.$eval(".LarhPVhimXuUmTnRJDlM > div > a", (el: any) => el.textContent);
  //     product['name'] = await page.$eval(".wc1Wg5BbXVFBe4MHxY3r", (el: any) => el.textContent);
  //     product['original_price'] = await page.$eval("div > span.u-text-20.u-font-bold.u-mr-1xs", (el: any) => el.textContent);
  //     const current_price = (await page.$(".u-flex.u-items-center > span:nth-child(2)")) || "";
  //     if (current_price) {
  //       product.current_price = await current_price.evaluate((el: any) => el.textContent);
  //     } else {
  //       product.current_price = product.original_price;
  //     }
  //     product['size'] = await page.$eval(".P9j6cGJ6kvC9bBgLk4pE", (el: any) => el.textContent);
  //     product['size'] = product['size'].replace("sizing guide", "");
  //     product['condition'] = await page.$eval("section > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > ul > li", (el: any) => el.textContent);
  //     product['description'] = await page.$eval(".jgiusFKudDUr6aL432nM", (el: any) => el.textContent);
  //     product['url'] = await page.evaluate(() => document.location.href);
  //     product['favourite'] = await page.$eval(".p.u-flex > button > div > span.u-ml-1xs ", (el: any) => el.textContent);
  //     //product['date_listed'] = await page.$eval(".product-description-list_descriptionList__list__FJb05 > li:nth-child(1) > span:nth-child(2)", (el: any) => el.textContent);
  //     console.log({ product })
  //     //console.log(allUrls.length)
  //     browserInstance.close();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   //     // ++count;
  //   //     // if (count === 2) break;
  //   //     await browserInstance.close();
  //   //     //return products;
  //   //   } catch (error) {
  //   //     console.log({ error });
  //   //     //await browserInstance.close();
  //   //     //return products;
  //   //   }
  //   // }
  // }
  // /women-lululemon-athletica-blue-sports-bra/150756411?query_id=810146821762236416&result_id=810146823414792192
  // /women-cotton-forever-21-black-leggings   /150099609?query_id=810146821762236416&result_id=810146823414792192
  // /women-coach-multi-color-coin-purse       /150848184?query_id=810148414331142144&result_id=810148414733795328
}
