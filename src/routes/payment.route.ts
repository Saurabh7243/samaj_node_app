import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import paymentController from "../controllers/paymentController";
import authenticateToken from "../utils/verifyToken";

@ImportedRoute.register
class PaymentRoute implements IRouting {
    prefix = '/payu';

    register(app: express.Application): void {

        app.post(`${this.prefix}/create`,authenticateToken,(req: Request, res:Response, next:NextFunction)=> {
            return paymentController.MakePayment(req, res, next);
        });

        app.post(`${this.prefix}/success`,(req: Request, res: Response, next: NextFunction)=> {
            return paymentController.success(req, res, next);
          });

        app.post(`${this.prefix}/failure`,(req: Request, res: Response, next: NextFunction)=> {
            return paymentController.failure(req, res, next);
        });

        app.post(`${this.prefix}/paymentHistory`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
            return paymentController.paymentHistory(req, res, next);
        });

    }
}

export default new PaymentRoute();