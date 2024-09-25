import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import tenantController from "../controllers/tenantController";
import authenticateToken from "../utils/verifyToken";
import generateMultipleUsers from "../controllers/generateMultipleUsers";

@ImportedRoute.register
class GenerateMultiUser implements IRouting {
    prefix = '/generate';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,(req: Request, res:Response, next:NextFunction)=> {                
            return generateMultipleUsers.createUsers(req, res, next);
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

export default new GenerateMultiUser();