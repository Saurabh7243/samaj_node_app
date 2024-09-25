import * as express from "express";
import { ImportedRoute } from "./routing.interface";
import fs from "fs";
import path from "path";

export function registerRoutes(app: express.Application) {
    const files = fs.readdirSync(path.join(__dirname));
    files.filter(x => x.indexOf(".route") > -1 && x.indexOf(".map") === -1).forEach(x => {
        require(`./${x}`);
    });
    // console.log("==========",files)

    ImportedRoute.GetImplementations().forEach(x => {
        const route = new x();
        route.register(app);
    });
}