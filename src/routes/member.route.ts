import * as express from "express";
import { Request, Response, NextFunction } from "express";

import memberController from "../controllers/memberController";
import { IRouting, ImportedRoute } from "./routing.interface";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class MemberRoutes implements IRouting {
  prefix = "/member";

  register(app: express.Application) {    

    app.get(`${this.prefix}/getMemberDetail`,authenticateToken, (req: Request, res:Response, next: NextFunction) => {
      return memberController.getMemberDetail(req, res, next);
    });

    app.get(`${this.prefix}/relative`, authenticateToken,(req: Request, res:Response, next: NextFunction) => {
      return memberController.relativeDetail(req, res, next);
    });

    app.get(`${this.prefix}/parents`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
      return memberController.allParents(req, res, next);
    });

    app.post(`${this.prefix}/update`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
      return memberController.memberUpdate(req, res, next);
    });
  }
}

export default new MemberRoutes();
