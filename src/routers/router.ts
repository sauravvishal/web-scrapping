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
        this.router.post("/scrap/vestial", this.controller.vestialScrap);
        this.router.get("/scrap/vestial", this.controller.getVestialUrls);

        this.router.post("/scrap/thredup", this.controller.thredupScrap);
        this.router.post("/scrap/lampoo", this.controller.lampooScrap);
        this.router.post("/scrap/luxury", this.controller.luxuryScrap);
        this.router.post("/scrap/thereal", this.controller.therealScrap);

        this.router.use('*', function (req: Request, res: Response) {
            sendResponse(res, 404, "Not Found.", null);
        });
    }

    getRouters() {
        return this.router;
    }
}

export const router = new MainRouter();