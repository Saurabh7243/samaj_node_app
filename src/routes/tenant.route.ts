import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import tenantController from "../controllers/tenantController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class TenantRoute implements IRouting {
    prefix = '/tenant';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {                
            return tenantController.createTenant(req, res, next);
        });

        app.post(`${this.prefix}/getAll`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return tenantController.getAllTenant(req, res, next);
          });

          app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return tenantController.updateTenant(req, res, next);
          });

          app.post(`${this.prefix}/get`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return tenantController.getTenant(req, res, next);
          });

    }
}

export default new TenantRoute();