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
        // get-requests
        this.router.get("/test", this.controller.test);
        this.router.get("/scrap/get-all", this.controller.getAllUrls);
        this.router.get("/scrap/get-all-products", this.controller.getAllProducts);
        this.router.get("/scrap/get-product-url-count", this.controller.getAllProductUrlCount);
        
        this.router.get("/scrap/get-vestaire-products-urls", this.controller.getVestaireProductsUrls);
        this.router.get("/scrap/get-lampoo-products-urls", this.controller.getLampooProductsUrls);
        this.router.get("/scrap/get-thredup-products-urls", this.controller.getThredupProductsUrls);
        this.router.get("/scrap/get-luxury-products-urls", this.controller.getLuxuryProductsUrls);
        this.router.get("/scrap/get-thereal-products-urls", this.controller.getTherealProductsUrls);

        this.router.get("/scrap/get-vestaire-products-details", this.controller.getVestaireProductsDetails);
        this.router.get("/scrap/get-lampoo-products-details", this.controller.getLampooProductsDetails);
        this.router.get("/scrap/get-thredup-products-details", this.controller.getThredupProductsDetails);
        this.router.get("/scrap/get-luxury-products-details", this.controller.getLuxuryProductsDetails);
        this.router.get("/scrap/get-thereal-products-details", this.controller.getTherealProductsDetails);

        // post-requests
        this.router.post("/scrap/vestaire", this.controller.vestialScrap);
        this.router.post("/scrap/thredup",this.controller.thredupScrap);
        this.router.post("/scrap/luxury", this.controller.luxuryScrap); 
        this.router.post("/scrap/lampoo", this.controller.lampooScrap);
        this.router.post("/scrap/thereal", this.controller.theRealScrap);

        this.router.post("/scrap/vestaire-products-urls", this.controller.vestaireProductUrlScrap);
        this.router.post("/scrap/lampoo-products-urls", this.controller.lampooProductUrlScrap);
        this.router.post("/scrap/thredup-products-urls", this.controller.thredupProductUrlScrap);
        this.router.post("/scrap/thereal-products-urls", this.controller.theRealProductUrlScrap);
        this.router.post("/scrap/luxury-products-urls", this.controller.luxuryProductUrlScrap);

        this.router.post("/scrap/vestaire-products-details", this.controller.vestaireProductDetailsScrap);
        this.router.post("/scrap/lampoo-products-details", this.controller.lampooProductDetailsScrap);
        this.router.post("/scrap/thredup-products-details", this.controller.thredupProductDetailsScrap);
        this.router.post("/scrap/luxury-products-details", this.controller.luxuryProductDetailsScrap);
        this.router.post("/scrap/thereal-products-details", this.controller.theRealProductDetailsScrap);
        
        this.router.use('*', function (req: Request, res: Response) {
            sendResponse(res, 404, "Not Found.", null);
        });
    }

    getRouters() {
        return this.router;
    }
}

export const router = new MainRouter();