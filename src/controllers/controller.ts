import { Request, Response } from "express";
import { sendResponse } from "../common/response";
import { startBrowser } from "../services/browser";
import { scraperObject } from "../services/pageScraper";
import { Urls } from "../database/entity/Url";
import { AppDataSource } from "../database/data-source";

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

            sendResponse(res, 200, "scrapped successfully", { ...urls, total_count });
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
            const thredupUrls = await scraperObject.thredupScraper(browserInstance);

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
            url.website_name = 'https://www.therealreal.com';
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

    vestialProductScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls);
            const urls = await urlRepository.findOneBy({ id: 1 });

            let browserInstance = await startBrowser();

            const products = await scraperObject.findVestaireProductDetails({ urls: urls?.urls, browserInstance });
            
            // let browserInstance = await startBrowser();
            // const realUrls = await scraperObject.theRealScraper(browserInstance);

            // sendResponse(res, 200, "scrapped successfully", savedUrls);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }
}