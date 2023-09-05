import { Request, Response } from "express";
import { config } from "../config/config";

import { sendResponse } from "../common/response";
import { startBrowser } from "../services/browser";
import { scraperObject } from "../services/pageScraper";
import { Urls } from "../database/entity/Url";
import { Product_urls } from "../database/entity/ProductUrls";
import { Products } from "../database/entity/Product";
import { AppDataSource } from "../database/data-source";
import { VestaireProductDetailsScraperObject } from "../services/vestaireProduct";

import { LampooProductDetailsScraperObject } from "../services/lampooProduct";
import { thredupProductDetailsScraperObject } from "../services/thredupProduct";

const {
    LAMPOO_ID,
    LUXURY_ID,
    REAL_ID,
    THREDUP_ID,
    VESTAIRE_ID
} = config;
export class Controller {
    service: any;
    constructor() { }

    getAllUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);
            const [urls, count] = await urlRepository.findAndCount();
            if (!count) return sendResponse(res, 404, "No data found.", null);
            let total_count = 0;
            urls.map((elem: any) => {
                elem['urls_count'] = elem.urls.length;
                total_count += elem.urls.length;
                return elem;
            });

            sendResponse(res, 200, "scrapped successfully", { total_count, ...urls });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    getAllProducts = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);
            const [products, count] = await productRepository.findAndCount();
            if (!count) return sendResponse(res, 404, "No data found.", null);
            let total_count = products.reduce((sum: number, item: any) => ++sum, 0)

            sendResponse(res, 200, "scrapped successfully", { total_count, ...products });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    vestialScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let browserInstance = await startBrowser();
            const vestiaireUrls = await scraperObject.vestiaireScraper(browserInstance);
            const url = new Urls();
            url.website_name = 'https://us.vestiairecollective.com/';
            url.urls = vestiaireUrls;

            const savedUrls = await AppDataSource.manager.save(url);

            sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    thredupScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let browserInstance = await startBrowser();
            let urls = [
                "https://www.thredup.com/brands/women",
                "https://www.thredup.com/brands/designer",
                "https://www.thredup.com/brands/maternity",
                "https://www.thredup.com/brands/plus",
                "https://www.thredup.com/brands/girls",
                "https://www.thredup.com/brands/boys",
                "https://www.thredup.com/brands/juniors",
                "https://www.thredup.com/brands/petite",
                "https://www.thredup.com/brands/tall",
                "https://www.thredup.com/brands/shoes",
                "https://www.thredup.com/brands/handbags",
                "https://www.thredup.com/brands/accessories"
            ];
            let thredupUrls: any = [];
            for (let url of urls) {
                const scrappedUrls = await scraperObject.thredupScraper(browserInstance, url) || [];
                thredupUrls.push(...scrappedUrls);
                console.log("======", scrappedUrls.length, "======")
            }
            await browserInstance?.close();
            console.log("controller===", thredupUrls.length)
            const url = new Urls();
            url.website_name = 'https://www.thredup.com';
            url.urls = thredupUrls;

            const savedUrls = await AppDataSource.manager.save(url);

            sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    lampooScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let browserInstance = await startBrowser();
            const lampooUrls = await scraperObject.lampooScraper(browserInstance);

            const url = new Urls();
            url.website_name = 'https://www.lampoo.com';
            url.urls = lampooUrls;

            const savedUrls = await AppDataSource.manager.save(url);

            sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    luxuryScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let browserInstance = await startBrowser();
            const luxuryUrls = await scraperObject.luxuryScraper(browserInstance);

            const url = new Urls();
            url.website_name = 'https://theluxurycloset.com';
            url.urls = luxuryUrls;

            const savedUrls = await AppDataSource.manager.save(url);

            sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    therealScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let browserInstance = await startBrowser();
            const realUrls = await scraperObject.theRealScraper(browserInstance);

            const url = new Urls();
            url.website_name = 'https://www.therealreal.com';
            url.urls = realUrls;

            const savedUrls = await AppDataSource.manager.save(url);

            sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    vestaireProductUrlScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);
            const urls = await urlRepository.findOneBy({ id: VESTAIRE_ID });
            const productRepository = AppDataSource.getRepository(Product_urls);
            const latestProductUrl = await productRepository
                .createQueryBuilder('product_urls')
                .where('product_urls.url_id = :url_id', { url_id: VESTAIRE_ID })
                .orderBy('product_urls.id', 'DESC')
                .limit(1)
                .getOne();
            let arr: any = [];

            if (latestProductUrl) { // To filter out already inserted urls
                const key = latestProductUrl?.product_name.split("/")[0];
                const url = urls?.urls.find((item: any) => item.includes(key));
                const index = urls?.urls.findIndex((item: any) => item == url) || 0 + 1;
                arr = urls?.urls.slice(index + 1);
            }
            if (!arr.length) {
                arr = urls?.urls;
            }

            let browserInstance = await startBrowser();

            const products = await VestaireProductDetailsScraperObject.findVestaireProductUrls({
                urls: arr,
                browserInstance,
                lastPage: latestProductUrl?.page ? latestProductUrl?.page : null
            });

            if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            const dbArr: any = [], resArr: any = [];
            while (products.length) {
                dbArr.push(products.splice(0, 10000));
            }

            for (let item of dbArr) {
                const insertedData = await productRepository.insert(item);
                resArr.push(...insertedData?.identifiers);
            }

            return sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    vestaireProductDetailsScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);

            const [data] = await AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${VESTAIRE_ID} ORDER BY p.id DESC LIMIT 1;
                    `);


            let urlsToScrap: any = [];

            if (data) {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${VESTAIRE_ID};
                `);
            } else {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${VESTAIRE_ID};
                `)
            }
            let browserInstance = await startBrowser();
            const products = await VestaireProductDetailsScraperObject.findVestaireProductDetails({ urlsToScrap: urlsToScrap.splice(0, 1), browserInstance });
            const insertedData = await productRepository.insert(products);

            sendResponse(res, 200, "scrapped successfully", insertedData?.identifiers);
        } catch (error) {
            console.log(error);
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    lampooProductUrlScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);

            const productRepository = AppDataSource.getRepository(Product_urls);
            let urls = await urlRepository.findOneBy({ id: LAMPOO_ID });

            const latestProductUrl = await productRepository
                .createQueryBuilder('product_urls')
                .where('product_urls.url_id = :url_id', { url_id: LAMPOO_ID })
                .orderBy('product_urls.id', 'DESC')
                .limit(1)
                .getOne();

            let arr: any = [];

            if (latestProductUrl) { // To filter out already inserted urls
                const key = latestProductUrl?.url.split("https://www.lampoo.com/au/products/")[1].split("/")[1].split("-")[0];
                const url = urls?.urls.find((item: any) => item.includes(key));
                const index = urls?.urls.findIndex((item: any) => item == url);
                arr = urls?.urls.slice(index);
            }

            if (!arr.length) {
                arr = urls?.urls;
            }

            let browserInstance = await startBrowser();

            const products = await LampooProductDetailsScraperObject.findLampooProductUrls({
                urls: arr,
                browserInstance,
                lastPage: latestProductUrl?.page ? latestProductUrl?.page : null
            });

            if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);
            const insertedData = await productRepository.insert(products);

            sendResponse(res, 200, "scrapped successfully", { total_scrapped: products.length, insertedData });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    lampooProductDetailsScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);

            const [data] = await AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${LAMPOO_ID} ORDER BY p.id DESC LIMIT 1;
                    `);

            let urlsToScrap: any = [];

            if (data) {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${LAMPOO_ID};
                `);
            } else {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${LAMPOO_ID};
                `)
            }

            let browserInstance = await startBrowser();
            const products = await LampooProductDetailsScraperObject.findLampooProductDetails({ urlsToScrap: urlsToScrap.splice(0, 1), browserInstance });

            const insertedData = await productRepository.insert(products);

            sendResponse(res, 200, "scrapped successfully", insertedData?.identifiers);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    thredupProductUrlScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);
            
            const productRepository = AppDataSource.getRepository(Product_urls);
            
            let urls = await urlRepository.findOneBy({ id: THREDUP_ID });

            let index = urls?.urls.findIndex(i => i === "https://www.thredup.com/brands/designer/other") || 0;
            urls?.urls.splice(0, ++index);

            const latestProductUrl = await productRepository
                .createQueryBuilder('product_urls')
                .where('product_urls.url_id = :url_id', { url_id: THREDUP_ID })
                .orderBy('product_urls.id', 'DESC')
                .limit(1)
                .getOne();

            let arr: any = [];

            if (latestProductUrl) { // To filter out already inserted urls
                const key = latestProductUrl?.product_name;
                const url = urls?.urls.find((item: any) => item.includes(key));
                const index = urls?.urls.findIndex((item: any) => item == url) || 0 + 1;
                arr = urls?.urls.slice(index + 1);
            }

            if (!arr.length) {
                arr = urls?.urls;
            }

            let browserInstance = await startBrowser();
            const product: any = await thredupProductDetailsScraperObject.findThredupProductUrls({
                urls: arr.splice(0, 20),
                browserInstance,
                lastPage: latestProductUrl?.page ? latestProductUrl?.page : null
            });

            if (!product.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);
            const data = await productRepository.insert(product);
            sendResponse(res, 200, "scrapped successfully", data?.identifiers);
        } catch (error) {
            console.log(error);
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    thredupProductDetailsScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);

            const [data] = await AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${THREDUP_ID} ORDER BY p.id DESC LIMIT 1;
                    `);


            let urlsToScrap: any = [];

            if (data) {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${THREDUP_ID};
                `);
            } else {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${THREDUP_ID};
                `)
            }
            
           
            let browserInstance = await startBrowser();
            //console.log(urlsToScrap);
            const products = await thredupProductDetailsScraperObject.findThredupProductDetails({ urlsToScrap: urlsToScrap.slice(0, 10), browserInstance });
            // const insertedData = await productRepository.insert(products);
             sendResponse(res, 200, "scrapped successfully", products);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }
}
