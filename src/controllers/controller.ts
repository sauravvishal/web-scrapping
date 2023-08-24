import { Request, Response } from "express";
import { sendResponse } from "../common/response";

export class Controller {
    service: any;
    constructor() {
        // this.service = container.get("service");
    }

    scrap = async (req: Request, res: Response): Promise<any> => {
        try {
            sendResponse(res, 200, "scrapped successfully", null);
        } catch (error) {
            sendResponse(res, 403, "Something went wrong.", null);
        }
    }
}