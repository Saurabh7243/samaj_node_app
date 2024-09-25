import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { ILike } from "typeorm";

class SearchController {
    async getMemberDetails(req:Request,res:Response,next:NextFunction) {
            
      try {   
          let memberId = req.body.memberId;           
          const connection = await dbUtils.getDefaultConnection();
          const memberRepo = connection.getRepository(Member)

          const findMember = await memberRepo.createQueryBuilder('member')
              .leftJoinAndSelect('member.TenantId','TenantId')
              .cache(true)
              .where("member.id= :id", {id : memberId})
              .getRawOne()

          return res.status(200).json(findMember);
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "error", error });
      }
  }
  async searchAllMember(req: Request, res: Response, next: NextFunction) {
    //
    const { inputValue } = req.body;
    const connection = await dbUtils.getDefaultConnection();
    const tenantId: any = req.decoded.member.TenantId.id;
  
    try {
      const memberRepo = connection.getRepository(Member);
      const users = await memberRepo.find({
        select: ["Name", "Email", "TenantId", "id"],
        where: {
          TenantId: {
            id: tenantId,
          },
            Name: ILike(`%${inputValue}%`),
            Email: ILike(`%${inputValue}%`),
        },
        cache: true,
      });
  
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }



}
export default new SearchController();