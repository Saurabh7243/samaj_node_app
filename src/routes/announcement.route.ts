import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import announcementController from "../controllers/announcementController";
import authenticateToken from "../utils/verifyToken";
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'public/upload/',
  filename: (req:any, file:any, cb:any) => {
      cb(null, file.originalname);
  }
})
const upload = multer({ storage : storage })

@ImportedRoute.register
class AnnouncementRoutes  implements IRouting {
    prefix= "/news";

    register(app: express.Application): void {      
        app.post(
            `${this.prefix}/create`,authenticateToken, upload.single('image'),
            (req: Request, res: Response, next: NextFunction) => {
              return announcementController.createNews(req, res, next);
            }
          );

          app.post(
            `${this.prefix}/getAll`,authenticateToken,
            (req: Request, res: Response, next: NextFunction) => {
              return announcementController.showNews(req, res, next);
            }
          );

          app.post(
            `${this.prefix}/get`,authenticateToken,
            (req: Request, res: Response, next: NextFunction) => {
              return announcementController.getNews(req, res, next);
            }
          );

          app.post(
            `${this.prefix}/update`,authenticateToken,upload.single('image'),
            (req: Request, res: Response, next: NextFunction) => {
              return announcementController.updateNews(req, res, next);
            }
          );
    }
}

export default new AnnouncementRoutes();