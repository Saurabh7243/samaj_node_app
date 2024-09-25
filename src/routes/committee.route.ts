import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import authenticateToken from "../utils/verifyToken";
import committeeController from "../controllers/committeeController";

@ImportedRoute.register
class CommitteeRoute implements IRouting {
    prefix = '/committee';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {                
            return committeeController.CreateCommittee(req, res, next);
        });

        app.get(`${this.prefix}/getAll`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return committeeController.GetAllCommittee(req, res, next);
          });

        //   app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.updateTenant(req, res, next);
        //   });

        //   app.post(`${this.prefix}/get`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.getTenant(req, res, next);
        //   });

    }
}

export default new CommitteeRoute();