import { Request, Response } from "express";
import { sendResponse } from "../common/response";
import { startBrowser } from "../services/browser";
import { scraperObject } from "../services/pageScraper";
import { Urls } from "../database/entity/Url";
import { AppDataSource } from "../database/data-source";

export class Controller {
    service: any;
    constructor() { }

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

    getVestialUrls = async (req: Request, res: Response): Promise<any> => {
        try {
            const urlRepository = AppDataSource.getRepository(Urls)
            const urls = await urlRepository.findOneBy({
                website_name: "https://us.vestiairecollective.com/"
            });

            if (!urls) return sendResponse(res, 404, "No data found.", null);
            sendResponse(res, 200, "scrapped successfully", urls);
        } catch (error) {
            console.log(error)
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    thredupScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const { link } = req.body;
            let browserInstance = await startBrowser();
            const vestiaireUrls = await scraperObject.thredupScraper(browserInstance);

            sendResponse(res, 200, "scrapped successfully", { vestiaireUrls });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }


    lampooScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const { link } = req.body;
            let browserInstance = await startBrowser();
            const vestiaireUrls = await scraperObject.lampooScraper(browserInstance);

            // const url = new Urls()
            // url.website_name = 'bobby the dog'
            // petToSave.ownerName = 'mike'
            // const savedPetOwner = await petRepository.save(petToSave)

            sendResponse(res, 200, "scrapped successfully", { vestiaireUrls });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    luxuryScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const { link } = req.body;
            let browserInstance = await startBrowser();
            const vestiaireUrls = await scraperObject.luxuryScraper(browserInstance);

            // const url = new Urls()
            // url.website_name = 'bobby the dog'
            // petToSave.ownerName = 'mike'
            // const savedPetOwner = await petRepository.save(petToSave)

            sendResponse(res, 200, "scrapped successfully", { vestiaireUrls });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }

    therealScrap = async (req: Request, res: Response): Promise<any> => {
        try {
            const { link } = req.body;
            let browserInstance = await startBrowser();
            const vestiaireUrls = await scraperObject.theRealScraper(browserInstance);

            // const url = new Urls()
            // url.website_name = 'bobby the dog'
            // petToSave.ownerName = 'mike'
            // const savedPetOwner = await petRepository.save(petToSave)

            sendResponse(res, 200, "scrapped successfully", { vestiaireUrls });
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }
}