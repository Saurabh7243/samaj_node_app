import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import authController from "../controllers/authController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class ChildRoutes implements IRouting {
  prefix = "/auth";

  register(app: express.Application): void {
    app.post(
      `${this.prefix}/registration`,authenticateToken,
       (req: Request, res: Response, next: NextFunction) => {
        return authController.doRegistration(req, res, next);
      }
    );

    app.post(
      `${this.prefix}/login`,
      (req: Request, res: Response, next: NextFunction) => {
        return authController.doLogin(req, res, next);
      }
    );

    app.post(
      `${this.prefix}/super-admin-registration`,
      (req: Request, res: Response, next: NextFunction) => {
        return authController.superAdminRegistration(req, res, next);
      }
    );
  }
}

export default new ChildRoutes();