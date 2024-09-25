import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { BloodGroupEnum, GenderEnum, MaritalStatusEnum, MemberRoleEnum, RelationEnum } from "../utils/enumData";
import { Tenant } from "../models/tenant";
import { updateMembers } from "../utils/commonFunction";

class AdminController {

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    //
    const { password, dob, role, tenantId, memberId, contact, username } = req.body
    const memberData = updateMembers(req.body)
    let currentRole: any = ""
    if (role === "Admin") {
      currentRole = MemberRoleEnum.Admin
    } else {
      currentRole = MemberRoleEnum.User
    }
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member)
      const tenantRepo = connection.getRepository(Tenant)

      if (currentRole === 1) {
        const findTenant = await tenantRepo.createQueryBuilder('tenant').where("tenant.id = :id", { id: tenantId }).getRawOne();
        if (!findTenant) {
          return res.status(404).json("Tenant not found")
        }
      }

      const userExists = await memberRepo
        .createQueryBuilder("member")
        .cache(true)
        .where("member.id = :id", { id: memberId })
        .getOne();

      if (userExists) {
        userExists.Email = memberData.validatedUserData.email;
        userExists.Name = memberData.validatedUserData.firstName;
        userExists.DOB = dob;
        userExists.Relation = RelationEnum.Head;
        userExists.RoleId = currentRole;
        userExists.Contact = memberData.validatedUserData.contact
        userExists.UserName = username

        await memberRepo.save(userExists)
        return res.status(200).json({ message: "User Updated Successfully" })
      } else {
        const member: any = memberRepo.create({
          Name: memberData.validatedUserData.firstName,
          Email: memberData.validatedUserData.email,
          Password: password,
          DOB: dob,
          Relation: RelationEnum.Head,
          Status: true,
          TenantId: tenantId,
          RoleId: currentRole,
          Contact: memberData.validatedUserData.contact,
          UserName: username
        });
        await memberRepo.save(member);
        return res.status(200).json("User register successfully");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error", error });
    }
  }

  async getMemberDetails(req: Request, res: Response, next: NextFunction) {
    //
    try {
      let memberId = req.body.memberId;
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member)
      const findMember = await memberRepo.createQueryBuilder('member')
        .select([
          "member.id",
          "member.Name",
          "member.Email",
          "member.Relation",
          "member.DOB",
          "member.Study",
          "member.MaritalStatus",
          "member.BloodGroup",
          "member.MaternalName",
          "member.Gender",
          "member.UserName",
          "member.TenantId",
          "member.RoleId",
          "member.Password",
          "member.Contact"
        ])
        .where("member.id= :id", { id: memberId })
        .cache(true)
        .getRawOne()

      return res.status(200).json(findMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }

  async getAllMemberDetails(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.decoded.member.TenantId.id
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member)
      const findMember = await memberRepo.createQueryBuilder('member')
        .where("member.TenantId= :TenantId", { TenantId: tenantId })
        .andWhere("member.parentId IS NULL")
        .cache(true)
        .getRawMany()

      return res.status(200).json(findMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }

  async adminUpdate(req: Request, res: Response, next: NextFunction) {
    //
    let mainId: any = req.body.id;
    //special function for react native
    const formData:any = Object.keys(req.body.formData).reduce((acc:any, key:any) => {      
      const updatedKey:any = key.replace("select_", "");
      acc[updatedKey] = req.body.formData[key];
      return acc;
    }, {});
  
    const { dob } = formData;

    const memberUpdate = updateMembers(formData)
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = await connection.getRepository(Member);

      const updateQuery: any = memberRepo
        .createQueryBuilder("member")
        .update(Member)
        .set({
          Name: memberUpdate.validatedUserData.firstName,
          Email: memberUpdate.validatedUserData.email,
          Relation: memberUpdate.relationshipStatus,
          MaritalStatus: memberUpdate.maritalData,
          Study: memberUpdate.validatedUserData.study,
          BloodGroup: memberUpdate.bloodGroupStatus,
          MaternalName: memberUpdate.validatedUserData.maternalName,
          Contact: memberUpdate.validatedUserData.contact,
          DOB: dob ? dob : new Date(),
          Gender: memberUpdate.genderStatus ? memberUpdate.genderStatus :GenderEnum.Male
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

  async getParentDetail(req: Request, res: Response, next: NextFunction) {
    //
    let mainId: any = "";
    const memberId = req.body.id;
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
      //     "member.Contact"
      //   ])
      //   .leftJoinAndSelect("member.TenantId", "TenantId")
      //   .leftJoinAndSelect("member.addresses", "addresses")
      //   .orderBy("member.id", "DESC")
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
          Contact: member.Contact,
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
export default new AdminController();