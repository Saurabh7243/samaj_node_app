import { NextFunction } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import dbUtils from "./db.utils";
import { Member } from "../models/members";
const expressAsyncHandler = require('express-async-handler');

declare global {
    namespace Express {
      interface Request {
        decoded: {id:string, member:any, tenantId:any};
      }
    }
  }
  
const authenticateToken = expressAsyncHandler(async (req:any, res:any, next: NextFunction) => { 
  // //
  const connection = dbUtils.getDefaultConnection();
  const memberModelRepo = (await connection).getRepository(Member)

    try {
        const authHeaders = req.headers;     
        if(!authHeaders.authorization) {
            return res.status(403).json({error: 'Authorization header not found'});
        } 
        //for verify current user token        
        const token = authHeaders.authorization.split(' ')[1];
        // const decoded = Jwt.verify(token, 'ILove_Node')
        const decoded = Jwt.verify(token, process.env.AUTH_SECRET_KEY || 'default_secret_key') as JwtPayload;
        
        // const currentToken = jwtTokenModelRepo.createQueryBuilder('memberToken') "decoded.id"
        // const memberId:any = decoded.member.id
        // const currentToken = await jwtTokenModelRepo.findOne({where:{memberId:memberId}})

        // console.log(currentToken?.token)
        req.decoded = decoded;
        next();
    } catch (error) {        
        return res.status(401).json({ error: 'Invalid t oken' });
    }
});

export default authenticateToken;
