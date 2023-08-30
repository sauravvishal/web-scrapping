

export const thredupProductDetailsScraperObject = {
  async findThredupProductDetails({ urls, browserInstance }: any) {
    let allUrls: any = [];  
    let page = await browserInstance.newPage(); 
    try {
      for (let url of urls) {
        console.log(`Navigating to ${url}...`);
        await page.waitForSelector(' ');
        await page.goto(url, { waitUntil: 'networkidle2' });

        const extractedUrls = await page.$$eval('div.u-relative > div.grid.u-justify-center.u-border.u-border-t.u-border-solid.u-border-gray-0.md:u-border-0', (links: any) => {
          return links.map((el: any) => el.querySelector('a').href);
        });
        console.log(extractedUrls);
        allUrls.push(...extractedUrls);
        await page.click('div.u-flex.u-items-center.u-space-x-1x > button.tup-ui-btn.tup-ui-btn-outline:nth-child(2)');
                 
                browserInstance.close();
                 break;
        } 
    }catch (error) {
            console.log(error);
        }
    }
};

