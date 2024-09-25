import * as express from "express";
import { Request,Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import BusinessController from "../controllers/businessController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class BusinessRoutes implements IRouting {      
    prefix = "/business";

    register(app: express.Application) {
        
        app.post(`${this.prefix}/create`, authenticateToken,(req:Request, res:Response,next:express.NextFunction) => {
            return BusinessController.createBusiness(req, res, next);
        });

        app.post(`${this.prefix}/getBusiness`, authenticateToken,(req:Request, res:Response,next:express.NextFunction) => {
            return BusinessController.getBusinessDetails(req, res, next);
        });

        app.post(`${this.prefix}/updateBusiness`, authenticateToken,(req:Request, res:Response,next:express.NextFunction) => {
            return BusinessController.updateBusiness(req, res, next);
        });

        app.post(`${this.prefix}/delete`, authenticateToken,(req:Request, res:Response,next:express.NextFunction) => {
            return BusinessController.deleteBusiness(req, res, next);
        });
    }
}

export default new BusinessRoutes();