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
import { LuxuryProductDetailsScraperObject } from "../services/luxuryProduct";
import { theRealProductDetailsScraperObject } from "../services/theRealProduct";

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

    /**
     * test - to check if server is running
     * @param req 
     * @param res 
     * @returns 
     */
    test = async (req: Request, res: Response): Promise<any> => {
        try {
            sendResponse(res, 200, "Everything is OK !!!!", null);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getAllUrls - to get brand urls of each websites
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * getAllProductUrlCount - to get product_url_count of each websites
     * @param req 
     * @param res 
     * @returns 
     */
    getAllProductUrlCount = async (req: Request, res: Response): Promise<any> => {
        try {
            const data = await AppDataSource.query(`
                SELECT 
                    pu.url_id AS url_id, u.website_name AS website_name, COUNT(pu.*) AS product_url_count
                FROM product_urls pu 
                INNER JOIN urls u ON u.id = pu.url_id
                GROUP BY pu.url_id, u.id;
            `);

            if (!data.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", data);
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getAllProductUrlCount - to get all products of each websites
     * @param req 
     * @param res 
     * @returns 
     */
    getAllProducts = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id;
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getVestaireProductsUrls - to get all products urls of Vestaire
     * @param req 
     * @param res 
     * @returns 
     */
    getVestaireProductsUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${VESTAIRE_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getLampooProductsUrls - to get all products urls of Lampoo
     * @param req 
     * @param res 
     * @returns 
     */
    getLampooProductsUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${LAMPOO_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getThredupProductsUrls - to get all products urls of Thredup
     * @param req 
     * @param res 
     * @returns 
     */
    getThredupProductsUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${THREDUP_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getLuxuryProductsUrls - to get all products urls of Luxury
     * @param req 
     * @param res 
     * @returns 
     */
    getLuxuryProductsUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${LUXURY_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getTherealProductsUrls: to get all products urls of The Real Real
     * @param req 
     * @param res 
     * @returns 
     */
    getTherealProductsUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${REAL_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getVestaireProductsDetails - to get all products details of Vestaire
     * @param req 
     * @param res 
     * @returns 
     */
    getVestaireProductsDetails = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${VESTAIRE_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getLampooProductsDetails - to get all products details of Lampoo
     * @param req 
     * @param res 
     * @returns 
     */
    getLampooProductsDetails = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${LAMPOO_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getThredupProductsDetails - to get all products details of Thredup
     * @param req 
     * @param res 
     * @returns 
     */
    getThredupProductsDetails = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${THREDUP_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getLuxuryProductsDetails - to get all products details of Luxury
     * @param req 
     * @param res 
     * @returns 
     */
    getLuxuryProductsDetails = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${LUXURY_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * getTheRealProductsDetails: to get all products details of The Real Real
     * @param req 
     * @param res 
     * @returns 
     */
    getTherealProductsDetails = async (req: Request, res: Response): Promise<any> => {
        try {
            const products = await AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${REAL_ID};
            `);

            if (!products.length) return sendResponse(res, 404, "No data found.", null);

            sendResponse(res, 200, "scrapped successfully", { total_count: products.length, products });
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * vestialScrap - to scrap vestial brand urls
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * thredupScrap - to scrap thredup brand urls
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * lampooScrap - to scrap lampoo brand urls
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * luxuryScrap - to scrap luxury brand urls
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * theRealScrap - to scrap theReal brand urls
     * @param req 
     * @param res 
     * @returns 
     */
    theRealScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            let urls = [
                "https://www.therealreal.com/designers/women",
                "https://www.therealreal.com/designers/men",
                "https://www.therealreal.com/designers/fine-jewelry",
                "https://www.therealreal.com/designers/watches",
                "https://www.therealreal.com/designers/art",
                "https://www.therealreal.com/designers/home",
                "https://www.therealreal.com/designers/kids"
            ];
            let theRealUrls: any = [];
            for (let url of urls) {
                let browserInstance = await startBrowser();
                const scrappedUrls = await scraperObject.theRealScraper(browserInstance, url) || [];
                theRealUrls.push(...scrappedUrls);
                console.log("======", scrappedUrls.length, theRealUrls.length, "======")
                await browserInstance?.close();
            }
            theRealUrls = [...new Set(theRealUrls)];
            const url = new Urls();
            url.website_name = 'https://www.therealreal.com';
            url.urls = theRealUrls;
            const savedUrls = await AppDataSource.manager.save(url);
            return sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * vestaireProductUrlScrap - to scrap urls of products from vestaire from brands urls
     * @param req 
     * @param res 
     * @returns 
     */
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

    /**
     * vestaireProductDetailsScrap - to scrap details of products from vestaire from products urls
     * @param req 
     * @param res 
     * @returns 
     */
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
            const products = await VestaireProductDetailsScraperObject.findVestaireProductDetails({ urlsToScrap, browserInstance });
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
            console.log(error);
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * lampooProductUrlScrap - to scrap urls of products from lampoo from brands urls
     * @param req 
     * @param res 
     * @returns 
     */
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
                urls: arr.splice(0, 15),
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

            sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
    * lampooProductDetailsScrap - to scrap details of products from lampoo from products urls
    * @param req 
    * @param res 
    * @returns 
    */
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

            if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            const dbArr: any = [], resArr: any = [];
            while (products.length) {
                dbArr.push(products.splice(0, 10));
            }

            for (let item of dbArr) {
                const insertedData = await productRepository.insert(item);
                resArr.push(...insertedData?.identifiers);
            }

            sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            console.log({ error });
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * thredupProductUrlScrap - to scrap urls of products from luxury from brands urls
     * @param req 
     * @param res 
     * @returns 
     */
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
                urls: arr,
                browserInstance,
                lastPage: latestProductUrl?.page ? latestProductUrl?.page : null
            });

            if (!product.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            const dbArr: any = [], resArr: any = [];
            while (product.length) {
                dbArr.push(product.splice(0, 10000));
            }

            for (let item of dbArr) {
                const insertedData = await productRepository.insert(item);
                resArr.push(...insertedData?.identifiers);
            }

            sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            console.log(error);
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
    * thredupProductDetailsScrap - to scrap details of products from thredup from products urls
    * @param req 
    * @param res 
    * @returns 
    */
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
            const products = await thredupProductDetailsScraperObject.findThredupProductDetails({ urlsToScrap, browserInstance });
            if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            const dbArr: any = [], resArr: any = [];
            while (products.length) {
                dbArr.push(products.splice(0, 10000));
            }

            for (let item of dbArr) {
                const insertedData = await productRepository.insert(item);
                resArr.push(...insertedData?.identifiers);
            }

            sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * luxuryProductUrlScrap - to scrap urls of products from luxury from brands urls
     * @param req 
     * @param res 
     * @returns 
     */
    luxuryProductUrlScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);

            const productRepository = AppDataSource.getRepository(Product_urls);
            let urls = await urlRepository.findOneBy({ id: LUXURY_ID });

            const latestProductUrl = await productRepository
                .createQueryBuilder('product_urls')
                .where('product_urls.url_id = :url_id', { url_id: LUXURY_ID })
                .orderBy('product_urls.id', 'DESC')
                .limit(1)
                .getOne();

            let arr: any = [];

            if (latestProductUrl) { // To filter out already inserted urls
                const keyArr = latestProductUrl?.product_name.split("/");
                const key = keyArr.splice(0, keyArr.length - 1).join("/");
                const url = urls?.urls.find((item: any) => item.includes(key));
                const index = urls?.urls.findIndex((item: any) => item == url);
                arr = urls?.urls.slice(index);
            }

            if (!arr.length) {
                arr = urls?.urls;
            }

            let browserInstance = await startBrowser();

            const products = await LuxuryProductDetailsScraperObject.findLuxuryProductUrls({
                urls: arr,
                browserInstance,
                lastPage: latestProductUrl?.page
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

            sendResponse(res, 200, "scrapped successfully", resArr);
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
    * luxuryProductDetailsScrap - to scrap details of products from luxury from products urls
    * @param req 
    * @param res 
    * @returns 
    */
    luxuryProductDetailsScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);

            const [data] = await AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${LUXURY_ID} ORDER BY p.id DESC LIMIT 1;
                    `);

            let urlsToScrap: any = [];

            if (data) {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${LUXURY_ID};
                `);
            } else {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${LUXURY_ID};
                `)
            }

            let browserInstance = await startBrowser();
            const products = await LuxuryProductDetailsScraperObject.findLuxuryProductDetails({ urlsToScrap, browserInstance });
            if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            const dbArr: any = [], resArr: any = [];
            while (products.length) {
                dbArr.push(products.splice(0, 10000));
            }

            for (let item of dbArr) {
                const insertedData = await productRepository.insert(item);
                resArr.push(...insertedData?.identifiers);
            }

            sendResponse(res, 200, "scrapped successfully.", resArr);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * theRealProductUrlScrap: to scrap urls of products from luxury from brands urls
     * @param req 
     * @param res 
     * @returns 
     */
    theRealProductUrlScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);
            const urls = await urlRepository.findOneBy({ id: REAL_ID });
            const productRepository = AppDataSource.getRepository(Product_urls);
            const latestProductUrl = await productRepository
                .createQueryBuilder('product_urls')
                .where('product_urls.url_id = :url_id', { url_id: REAL_ID })
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
            const products = await theRealProductDetailsScraperObject.findTheRealProductUrls({
                urls: arr.splice(0, 2),
                browserInstance,
                lastPage: latestProductUrl?.page ? latestProductUrl?.page : null
            });

            // if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);

            // const dbArr: any = [], resArr: any = [];
            // while (products.length) {
            //     dbArr.push(products.splice(0, 10000));
            // }

            // for (let item of dbArr) {
            //     const insertedData = await productRepository.insert(item);
            //     resArr.push(...insertedData?.identifiers);
            // }

            return sendResponse(res, 200, "scrapped successfully.", products);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    /**
     * theRealProductDetailsScrap: to scrap details of products from luxury from products urls
     * @param req 
     * @param res 
     * @returns 
     */
    theRealProductDetailsScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const productRepository = AppDataSource.getRepository(Products);

            const [data] = await AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${REAL_ID} ORDER BY p.id DESC LIMIT 1;
                    `);


            let urlsToScrap: any = [];

            if (data) {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${REAL_ID};
                `);
            } else {
                urlsToScrap = await AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${REAL_ID};
                `)
            }
            let browserInstance = await startBrowser();
            const products = await theRealProductDetailsScraperObject.findTheRealProductDetails({ urlsToScrap: urlsToScrap.splice(0, 1), browserInstance });
            const insertedData = await productRepository.insert(products);

            sendResponse(res, 200, "scrapped successfully", insertedData?.identifiers);
        } catch (error) {
            console.log(error);
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }
}
