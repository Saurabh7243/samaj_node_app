import express, { Express, Request, Response } from "express";
import dbUtils from "./utils/db.utils";
const cors = require("cors");
import * as routes from "./routes"
const app: Express = express();
import bodyParser from "body-parser";
import passport from 'passport'

import * as dotenv from 'dotenv';
dotenv.config();
const port: any = process.env.PORT || 50001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(cors({ origin: "https://samajnewapp.vercel.app" }));


app.use(passport.initialize());
app.use(express.json());

//all paths here
routes.registerRoutes(app);

app.use("/public", express.static('public'));

const connect = async () => {
  const conn = await dbUtils.init();
};
connect();

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // or your specific origin
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
//  });
 
const showConnection =() => {
  app.get('/',(req:Request,res:Response)=> {
    res.json("Node server running correctly")
  })
}

app.listen(port, () => {
  showConnection()
  console.log(`listening on port${port}`);
});

// app.listen(port, '192.168.1.6', ()   => {
//   console.log(`Server is running on http://192.168.1.6:${port}`);
// });