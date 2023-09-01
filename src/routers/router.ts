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

        this.router.get("/scrap/get-all", this.controller.getAllUrls);
        this.router.get("/scrap/get-all-products", this.controller.getAllProducts);

        this.router.post("/scrap/vestial", this.controller.vestialScrap);
        this.router.post("/scrap/thredup",this.controller.thredupScrap);
        this.router.post("/scrap/luxury", this.controller.luxuryScrap); 
        this.router.post("/scrap/lampoo", this.controller.lampooScrap);
        this.router.post("/scrap/thereal", this.controller.therealScrap);
        this.router.post("/scrap/vestial-products", this.controller.vestialProductScrap);
        this.router.post("/scrap/lampoo-products-urls", this.controller.lampooProductUrlScrap);
        this.router.post("/scrap/lampoo-products-details", this.controller.lampooProductDetailsScrap);
        //this.router.post("/scrap/thredup-products-details", this.controller.thredUpProductDetailsScrap);

        this.router.post("/scrap/thredup-products-urls", this.controller.thredupProductUrlScrap);
        // this.router.post("/scrap/vestial-products", this.controller.vestialProductScrap);

        this.router.use('*', function (req: Request, res: Response) {
            sendResponse(res, 404, "Not Found.", null);
        });
    }

    getRouters() {
        return this.router;
    }
}

export const router = new MainRouter();