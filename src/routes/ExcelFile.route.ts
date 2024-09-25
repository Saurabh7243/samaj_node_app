import { Request, Response, NextFunction } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import excelFileReaderController from "../controllers/excelFileReaderController";
import multer from "multer";
import authenticateToken from "../utils/verifyToken";
import path from "path";

const mainDirectory = process.cwd();
const uploadDirectory = path.join(mainDirectory,'public', 'files');
const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename:(req:any, file:any, cb)=> {
        cb(null,file.originalname)
    },
})

const upload = multer({ storage });

@ImportedRoute.register
class ExcelFileReaderRoute implements IRouting{
    prefix = "/file"

    register(app: express.Application): void {
        app.post(`${this.prefix}/read`,upload.single('file'),authenticateToken,(req:Request, res:Response,next:NextFunction)=> {       
            return excelFileReaderController.readExcel(req, res, next)
        })
    }
}

export default new ExcelFileReaderRoute()