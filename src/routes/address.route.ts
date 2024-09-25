import { Request, Response, NextFunction } from "express";
import addressController from "../controllers/addressController";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class AddressRoute implements IRouting {
    prefix= "/member/address";

    register(app: express.Application) {

        app.post(`${this.prefix}/create`, authenticateToken,(req:Request ,res:Response,next: express.NextFunction)=> {
            return addressController.createAddress(req, res, next);
        });

        app.post(`${this.prefix}/getDetail`, authenticateToken,(req:Request ,res:Response,next: express.NextFunction)=> {
            return addressController.addressDetails(req, res, next);
        });

        app.post(`${this.prefix}/update`, authenticateToken,(req:Request ,res:Response,next: express.NextFunction)=> {
            return addressController.addressUpdate(req, res, next);
        });

        app.post(`${this.prefix}/delete`, authenticateToken, (req: Request, res: Response, next: express.NextFunction) => {
            addressController.addressDelete(req, res, next)
                .then(() => next())
                .catch(err => next(err));
        });
    }
}

export default new AddressRoute()