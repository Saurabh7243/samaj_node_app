import { Request, Response, NextFunction } from "express";
import { Business } from "../models/business";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { validBusinessData } from "../utils/validate";

class BusinessController {

    async createBusiness(req:Request,res:Response,next:NextFunction) {
      //
        let  mainId:any="";
        const memberId = req.decoded.member.id
        const childId  = req.body.childId;
        const memberRole:any = req.body.memberRole;
        const validData = validBusinessData(req.body.formData)
        console.log(validData)

        if (memberRole === "child") {
          mainId = childId;
        } else {
          mainId = memberId;
        }
        try {
            
            const connection = await dbUtils.getDefaultConnection();
            const businessRepo = connection.getRepository(Business);
            const memberRepo = connection.getRepository(Member)

            const findMember:any = await memberRepo.findOne({where: {id: mainId}})

            const business = await businessRepo.create({
                Name: validData.name,
                member: findMember.id,
            })
            await businessRepo.save(business);
            res.json({message: "Business saved successfully", data: business});
        } catch (error) {
            console.error(error);
        }
    }

    async getBusinessDetails(req:Request,res:Response,next:NextFunction) {
        //
        let mainId:any="";
        const memberId = req.decoded.member.id
        const childId  = req.body.childId
        const memberRole:any = req.body.memberRole;
        console.log(`this is memberId =${memberId}  and childId = ${childId} and memberRole = ${memberRole}`)
        console.log(req.body)
        if (memberRole === "child") {
          mainId = childId;
        } else {
          mainId = memberId;
        }
        
        try {            
            const connection = await dbUtils.getDefaultConnection();
            const businessRepo = connection.getRepository(Business);
            const memberRepo = connection.getRepository(Member)

            const findMember:any = await memberRepo.findOne({where: {id: mainId}})
            if(!findMember) {
                return res.status(404).json({message: "Member not found"})
            }
            const business = await businessRepo.createQueryBuilder('business')
                .select(["business.Name", "business.id"])
                .cache(true)
                .where("business.memberId= :memberId", {memberId : mainId})
                .getRawMany()

            // res.json({message: "Business found", data: business});
            return res.status(200).json(business);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "error", error });
        }
    }

    async updateBusiness(req: Request, res: Response, next: NextFunction) { 
        //
        let mainId:any="";
        const memberId = req.decoded.member.id;
        const childId  = req.body.childId;
        const validData = validBusinessData(req.body.formData)
        const { businessId } = req.body;
        const memberRole:any = req.body.memberRole;

        if (memberRole === "child") {
          mainId = childId;
        } else {
          mainId = memberId;
        }
        try {
          const connection = await dbUtils.getDefaultConnection();
          const memberRepo = connection.getRepository(Member);
          const businessRepo = connection.getRepository(Business);

          const memberExists = memberRepo.createQueryBuilder("member")
            .select(["member.id"])
            .where("member.id= :id", {memberId:mainId})

        if(!memberExists) {
           return res.status(401).json("user not found");
        }
          const updateBusiness: any = await businessRepo
            .createQueryBuilder("business")
            .update(Business)
            .set({
              Name: validData.name,
            })
            .where("business.id = :id", { id: businessId })
            .execute();
      
          return res.status(200).json(updateBusiness);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteBusiness(req: Request, res: Response, next: NextFunction) {
      
      const { id } = req.body;  
  
      try {
        const connection = await dbUtils.getDefaultConnection();
        const businessRepo = connection.getRepository(Business);
        
        const memberBusinessDelete: any = await businessRepo
          .createQueryBuilder("address")
          .delete()
          .where("business.id = :id", { id: id })
          .execute()
          return res.status(200).json(memberBusinessDelete)
      } catch (error) {
        console.error(error);
        return res.json("Address not found");      
      }
    }
}
export default new BusinessController();