import { Request, Response, NextFunction } from "express";
import { Member } from "../models/members";
import dbUtils from "../utils/db.utils";
import {
  BloodGroupEnum,
  GenderEnum,
  MaritalStatusEnum,
  RelationEnum,
} from "../utils/enumData";
import { updateMembers } from "../utils/commonFunction";
import moment from 'moment-timezone';
class MemberController {
  async getMemberDetail(req: Request, res: Response, next: NextFunction) {
    //
    let mainId: any = "";
    const memberId = req.decoded.member.id;
    const childId = req.body.childId;
    const memberRole:any = req.body.memberRole;

    if (memberRole === "child") {
      mainId = childId;
    } else {
      mainId = memberId;
    }

    try {
      const connection = await dbUtils.getDefaultConnection();
      const repo = connection.getRepository(Member);
      const member:any = await repo.findOneBy({id:mainId})      

      // const member = await repo
      //   .createQueryBuilder("member")
      //   .select([
      //     "member.id",
      //     "member.Name",
      //     "member.Email",
      //     "member.Relation",
      //     "member.DOB",
      //     "member.Study",
      //     "member.MaritalStatus",
      //     "member.BloodGroup",
      //     "member.MaternalName",
      //     "member.Gender",
      //     "member.UserName",
      //     "member.TenantId",
      //     "member.RoleId",
      //     "member.Contact",
      //   ] )
      //   .leftJoinAndSelect("member.TenantId", "TenantId")
      //   .leftJoinAndSelect("member.addresses","addresses")
      //   .where("member.id = :id", { id: mainId })
      //   .cache(true)
      //   .getRawOne();        

      if (member) {
        // member.member_Relation = RelationEnum[member.member_Relation];
        // member.member_BloodGroup = BloodGroupEnum[member.member_BloodGroup];
        // member.member_MaritalStatus = MaritalStatusEnum[member.member_MaritalStatus];
        // member.member_Gender = GenderEnum[member.member_Gender];

        member.Relation = RelationEnum[member.Relation];
        member.BloodGroup = BloodGroupEnum[member.BloodGroup];
        member.MaritalStatus = MaritalStatusEnum[member.MaritalStatus];
        member.Gender = GenderEnum[member.Gender];
        
        const utcDate = moment.tz(member.DOB, 'Asia/Kolkata').utc();
        
      //   const formattedResults = {
      //     Name: member.member_Name,
      //     Email: member.member_Email,
      //     id: member.member_id,
      //     Relation: member.member_Relation,
      //     Dob: utcDate,
      //     Study: member.member_Study,
      //     MaritalStatus: member.member_MaritalStatus,
      //     BloodGroup: member.member_BloodGroup,
      //     Gender: member.member_Gender,
      //     Contact : member.member_Contact,
      //     UserName : member.member_UserName,
      //     MaternalName:member.member_MaternalName
      // }

      const formattedResults = {
        Name: member.Name,
        Email: member.Email,
        id: member.id,
        Relation: member.Relation,
        Dob: member.DOB,
        Study: member.Study,
        MaritalStatus: member.MaritalStatus,
        BloodGroup: member.BloodGroup,
        Gender: member.Gender,
        Contact : member.Contact,
        UserName : member.UserName,
        MaternalName:member.MaternalName
    }
        res.status(200).json({ formattedResults });
      } else {
        res.json({ error: "No child members found" });
      }
    } catch (error) {
      res.json({ error: "user not found" });
      console.error(error);
    }
  }
          
  async relativeDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const repo = connection.getRepository(Member);
      const parentId: any = 2;
      if (isNaN(parentId) || parentId <= 0) {
        res.json({ error: "Invalid memberId provided" });
        return;
      }
      const result = await repo
        .createQueryBuilder("user")
        .select(["user.id", "user.Name", "user.Relation", "user.parentId"])
        .where("user.parentId = :id", { id: parentId })
        .cache(true)
        .getRawMany();
      if (result) {
        return res.json({ success: result });
      } else {
        return res.json({ error: "No child members found" });
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: "user not found" });      
    }
  }

  async allParents(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const repo = connection.getRepository(Member);
      const member = await repo
        .createQueryBuilder("member")
        .select([
          "member.id",
          "member.UserName",
          "member.Email",
          "member.parentId",
          "member.Contact",
        ])
        .where("member.parentId IS NULL")
        .cache(true)
        .getRawMany();
      if (member) {
        res.json({ success: member }).status(200);
      } else {
        res.json({ error: "No child members found" });
      }
    } catch (error) {
      res.json({ error: "user not found" });
      console.error(error);
    }
  }

  async memberUpdate(req: Request, res: Response, next: NextFunction) {
   //
    let mainId: any = "";
    const memberId = req.decoded.member.id
    const childId = req.body.childId;
    const memberRole:any = req.body.memberRole;

    if (memberRole === "child") {
      mainId = childId;
    } else {
      mainId = memberId;
    }
    const {firstName,email,dob,study,maternalName,contact,userName} = req.body.formData;
    const utcDate = moment.tz(dob, 'Asia/Kolkata').utc().format('YYYY-MM-DD');
    const memberUpdate = updateMembers(req.body.formData)
    console.log(contact)
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member);  

      const updateQuery: any = memberRepo
        .createQueryBuilder("member")         
        .update(Member)
        .set({
          Name: memberUpdate.validatedUserData.firstName,
          Email: memberUpdate.validatedUserData.email,
          Relation: memberUpdate.relationshipStatus,
          MaritalStatus: memberUpdate.maritalData,
          DOB: dob,//dob ? dob : new Date(),
          Study: memberUpdate.validatedUserData.study,
          BloodGroup: memberUpdate.bloodGroupStatus,
          MaternalName: memberUpdate.validatedUserData.maternalName,
          Contact :memberUpdate.validatedUserData.contact,
          UserName : userName,
          Gender: memberUpdate.genderStatus ? memberUpdate.genderStatus :GenderEnum.Male
        })

        const updateMember: any = await updateQuery
        .where("member.id = :id", { id: mainId })      
        .execute();

      console.log(updateMember)

      return res.status(200).json(updateMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new MemberController();
