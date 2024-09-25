import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import authenticateToken from "../utils/verifyToken";
import searchController from "../controllers/searchController";

@ImportedRoute.register
class SearchRoute implements IRouting {
    prefix = '/search';

    register(app: express.Application): void {

        app.post(`${this.prefix}/members`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {                
            return searchController.searchAllMember(req, res, next);
        });

        // app.post(`${this.prefix}/getAll`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.getAllTenant(req, res, next);
        //   });

        //   app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.updateTenant(req, res, next);
        //   });

        //   app.post(`${this.prefix}/get`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.getTenant(req, res, next);
        //   });

    }
}

export default new SearchRoute();