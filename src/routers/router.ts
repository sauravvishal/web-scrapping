import { Router, Request, Response } from "express";
import { Controller } from "../controllers/controller";
import { sendResponse } from "../common/response";

class MainRouter {
    router: any;
    private controller: Controller;
    constructor() {
        this.controller = new Controller();
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get("/scrap", this.controller.scrap);

        this.router.use('*', function (req: Request, res: Response) {
            sendResponse(res, 404, "Not Found.", null);
        });
    }

    getRouters() {
        return this.router;
    }
}

export const router = new MainRouter();