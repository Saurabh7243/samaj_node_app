import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import memberShipController from "../controllers/memberShipController";

@ImportedRoute.register
class MemberShipRoute implements IRouting {
    prefix= "/membership";

    register(app: express.Application): void {
        app.post(`${this.prefix}/create`,(req: Request, res:Response, next:NextFunction)=> {
            return memberShipController.createMemberShip(req, res, next);
        });

        app.post(`${this.prefix}/expired`,(req: Request, res:Response, next:NextFunction)=> {
            return memberShipController.expiredMemberShip(req, res, next);
        });
    }
}

export default new MemberShipRoute();