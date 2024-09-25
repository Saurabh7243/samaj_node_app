import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import adminController from "../controllers/adminController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class AdminRoutes implements IRouting {
    prefix = '/admin';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {
            return adminController.createAdmin(req, res, next);
        });

        app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {
            return adminController.adminUpdate(req, res, next);
        });

        app.post(`${this.prefix}/getAll`, authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return adminController.getAllMemberDetails(req, res, next);
          });

          app.post(`${this.prefix}/get`, authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return adminController.getMemberDetails(req, res, next);
          });
        
          app.post(`${this.prefix}/getParentDetails`, authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return adminController.getParentDetail(req, res, next);
          });

    }
}

export default new AdminRoutes();