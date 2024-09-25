import { Request, Response, NextFunction } from "express";
import { Member } from "../models/members";
import dbUtils from "../utils/db.utils";
import { BloodGroupEnum, GenderEnum, MaritalStatusEnum, MemberRoleEnum, RelationEnum } from "../utils/enumData";
import { updateMembers } from "../utils/commonFunction";

class ChildController {
  async createChild(req: Request, res: Response, next: NextFunction) {    
    //
    const { dob, study, maternalName , userName , password , contact} = req.body.data.formData;
    const parentId = req.body.data.parentId;
    const tenantId: any = req.decoded.member.TenantId.id
    const memberData: any = updateMembers(req.body.data.formData)
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member);
      const userExists = await memberRepo
        .createQueryBuilder("member")
        .where("member.Email = :Email", { Email: memberData.validatedUserData.email })
        .getOne();
      if (userExists) {
        return res.status(409).json({ message: "User already exists" });
      }
      if (!userExists) {
        const member = memberRepo.create({
          Email: memberData.validatedUserData.email,
          Name: memberData.validatedUserData.firstName,
          DOB: dob,
          Relation: memberData.relationshipStatus,
          Study: study,
          MaritalStatus: memberData.maritalData,
          BloodGroup: memberData.bloodGroupStatus,
          MaternalName: memberData.validatedUserData.maternalName,
          Status: true,
          Gender: memberData.genderStatus,
          businesses: [],
          ParentId: parentId,
          RoleId: MemberRoleEnum.User,
          TenantId: tenantId,
          UserName : userName,
          Password : password,
          Contact : memberData.validatedUserData.contact
        });
        await memberRepo.save(member);
        return res.status(200).json({
          message: "Child or wife created",
          memberId: member.id,
          member,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }

    return res.status(500).json({ error: 'Unknown error' });
  }

  async GetAllChilds(req: Request, res: Response, next: NextFunction) {
    const { parentId } = req.body;
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = await connection.getRepository(Member);
      const result = await memberRepo
        .createQueryBuilder("member")
        .leftJoinAndSelect("member.businesses", "businesses")
        .leftJoinAndSelect("member.addresses", "addresses")
        .where("member.parentId = :parentId", { parentId: parentId })
        .cache(true)
        .getRawMany();

      if (result) {
        res.json(result);
      } else {
        res.json({ error: "No child members found" });
      }
    } catch (error) {
      console.error(error);
    }
  }
  async childUpdate(req: Request, res: Response, next: NextFunction) {
    //;
    let mainId: any = "";
    const childId = req.body.childId;
    const memberRole: any = req.body.memberRole;

    if (memberRole === "child") {
      mainId = childId;
    }
    const childUpdate = updateMembers(req.body.formData)
    const { firstName, email, dob, study, maternalName , contact } = req.body.formData;
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member);

      const updateQuery: any = memberRepo
        .createQueryBuilder("member")
        .update(Member)
        .set({
          Name: childUpdate.validatedUserData.firstName,
          Email: childUpdate.validatedUserData.email,
          Relation: childUpdate.relationshipStatus,
          MaritalStatus: childUpdate.maritalData,
          Study: childUpdate.validatedUserData.study,
          BloodGroup: childUpdate.bloodGroupStatus,
          MaternalName: childUpdate.validatedUserData.maternalName,
          Contact : childUpdate.validatedUserData.contact,
          DOB:dob,
          // Gender: childUpdate.genderStatus ? childUpdate.genderStatus: GenderEnum.Male
          Gender : childUpdate.genderStatus
        })
        
      const updateMember: any = await updateQuery
        .where("member.id = :id", { id: mainId })
        .execute();


      return res.status(200).json(updateMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getChildDetail(req: Request, res: Response, next: NextFunction) {  
    //
    let mainId: any = "";
    const memberId = req.decoded.member.id;
    const childId = req.body.childId;
    const memberRole: any = req.body.memberRole;

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
      //     "member.Password",
      //     "member.Contact"
      //   ])
      //   .leftJoinAndSelect("member.TenantId", "TenantId")
      //   .leftJoinAndSelect("member.addresses", "addresses")
      //   .cache(true)
      //   .where("member.id = :id", { id: mainId })
      //   .getRawOne();
      if (member) {
        member.Relation = RelationEnum[member.Relation];
        member.BloodGroup = BloodGroupEnum[member.BloodGroup];
        member.MaritalStatus = MaritalStatusEnum[member.MaritalStatus];
        member.Gender = GenderEnum[member.Gender];

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
          UserName : member.UserName,
          Password : member.Password,
          Contact : member.Contact,
          MaternalName : member.MaternalName
        }
        res.json({ formattedResults });
      } else {
        res.json({ error: "No child members found" });
      }
    } catch (error) {
      res.json({ error: "user not found" });
      console.error(error);
    }
  }
}

export default new ChildController();