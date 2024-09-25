import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import authenticateToken from "../utils/verifyToken";
import commiteeRoleController from "../controllers/committeeRoleController";
@ImportedRoute.register
class CommitteeRoleRoute implements IRouting {
    prefix = '/committeeRole';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {                
            return commiteeRoleController.CreateCommitteeRoles(req, res, next);
        });

        app.get(`${this.prefix}/getAll`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return commiteeRoleController.GetAllCommitteeRoles(req, res, next);
          });

        //   app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.updateTenant(req, res, next);
        //   });

        //   app.post(`${this.prefix}/get`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
        //     return tenantController.getTenant(req, res, next);
        //   });

    }
}

export default new CommitteeRoleRoute();