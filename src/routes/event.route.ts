import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import authenticateToken from "../utils/verifyToken";
import eventController from "../controllers/eventController";
const multer = require('multer');
const storage = multer.diskStorage({
  destination: "public/event-upload",
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
@ImportedRoute.register
class EventRoutes implements IRouting {
  prefix = "/event";

    register(app: express.Application) {      
        app.post(`${this.prefix}/create`,authenticateToken ,upload.single('image'),
        (req : Request , res : Response , next : NextFunction) => {
            return eventController.createEvent(req,res,next)
        })

        app.get(`${this.prefix}/listing`,authenticateToken ,(req : Request , res : Response , next : NextFunction) => {
            return eventController.listEvents(req,res,next)
        })

        app.get(`${this.prefix}/delete/:eventId`,authenticateToken ,(req : Request , res : Response , next : NextFunction) => {
            return eventController.deleteEvents(req,res,next)
        })

        app.post(`${this.prefix}/paymentSuccess`,(req: Request, res: Response, next: NextFunction) => {
          return eventController.paymentSuccess(req, res, next);
        });

        app.post(`${this.prefix}/paymentFailure`,(req: Request, res: Response, next: NextFunction)=> {
            return eventController.paymentFailure(req, res, next);
        });

        app.post(`${this.prefix}/enrollFreeEvent`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
          return eventController.enrollFreeEvent(req, res, next);
        });

        app.post(`${this.prefix}/enrollPaidEvent`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
          return eventController.enrollPaidEvent(req, res, next);
        });

        app.post(`${this.prefix}/alreadyScanned`,authenticateToken,(req: Request, res: Response, next: NextFunction)=> {
          return eventController.alreadyScanned(req, res, next);
        });
    }
}

export default new EventRoutes();
