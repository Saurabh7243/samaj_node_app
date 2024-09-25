import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import childController from "../controllers/childController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class ChildRoutes implements IRouting {
    prefix = '/child';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {
            return childController.createChild(req, res, next);
        });

        app.post(`${this.prefix}/getAll`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return childController.GetAllChilds(req, res, next);
          });

        app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return childController.childUpdate(req, res, next);
        });

        app.post(`${this.prefix}/get`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return childController.getChildDetail(req, res, next);
        });

    }
}

export default new ChildRoutes();