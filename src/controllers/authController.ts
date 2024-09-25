import { Request, Response, NextFunction } from "express";
import { Member } from "../models/members";
import dbUtils from "../utils/db.utils";
import * as bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";
import { MemberRoleEnum, RelationEnum } from "../utils/enumData";
import { Tenant } from "../models/tenant";
import { updateMembers } from "../utils/commonFunction";
// import { JwtTokenModel } from "../models/jwtToken";

class AuthController {
    async doRegistration(req:Request, res:Response, next:NextFunction) {
      //
        const {password, dob,role , username , contact} = req.body
        const memberData: any = updateMembers(req.body)
        let tenantId: any = req.decoded.member.TenantId.id;
        let currentRole:any = ""
        if (role === "Admin") {
          currentRole = MemberRoleEnum.Admin
        } else {
          currentRole = MemberRoleEnum.User
        }
        try {
            const connection = await dbUtils.getDefaultConnection();
            const memberRepo = connection.getRepository(Member)
            const tenantRepo = connection.getRepository(Tenant)

            if(currentRole === 1) {
              const findTenant = await tenantRepo.createQueryBuilder('tenant').where("tenant.id = :id",{id:tenantId}).getRawOne();
         
              if(!findTenant) {
                return res.status(404).json("Tenant not found")
              }              
            }

            const userExists = await memberRepo
            .createQueryBuilder("member")        
            .where("member.Email = :Email", { Email: memberData.validatedUserData.email })
            .getOne();            
          if (userExists) {                               
            return res.status(409).json({message:"Email Id exists"})
          }

          const member:any = memberRepo.create({
            Name: memberData.validatedUserData.firstName,
            Email: memberData.validatedUserData.email,
            Password: password,
            DOB: dob,
            Relation:RelationEnum.Head,
            Status:true,
            TenantId:tenantId,
            RoleId:currentRole,
            UserName : username,
            Contact : memberData.validatedUserData.contact
          });
          await memberRepo.save(member);

          return res.status(200).json("User register successfully");
        } catch (error) {            
            console.log(error);
            return res.status(500).json({ message: "error", error });
        }
    }
    async superAdminRegistration(req:Request, res:Response, next:NextFunction) {
      
      const firstName = "superadmin"
      const password = "1234"
      const tenantId:any = null;
      const email = "superadmin@gmail.com"
      try {
          const connection = await dbUtils.getDefaultConnection();
          const memberRepo = connection.getRepository(Member)

          const userExists = await memberRepo
          .createQueryBuilder("member")        
          .where("member.Email = :Email", { Email: email })
          .getOne();            
        if (userExists) {                        
          return res.status(409).json({message:"Email Id exists"})
        }

        const member:any  = memberRepo.create({
          Name: firstName,
          Email: email,
          Password: password,
          DOB: new Date(),
          Relation:RelationEnum.Head,
          Status:true,
          TenantId:tenantId,
          RoleId:MemberRoleEnum.SuperAdmin,
        });
        await memberRepo.save(member);

        return res.status(200).json({
          userName:email,
          password:password,
          message:"SuperAdmin register successfully",
        });
      } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "error", error });
      }
    }
    async doLogin(req: Request, res: Response, next: NextFunction) {
    
    const { password } = req.body;
    const memberData: any = updateMembers(req.body)
    if (!memberData.validatedUserData.email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Member)

      const member: any = await memberRepo.createQueryBuilder("member")
        .where("member.Email = :Email", { Email: memberData.validatedUserData.email })
        .leftJoinAndSelect("member.TenantId", "TenantId")
        .addSelect("TenantId.id AS tenantId")
        .getOne()

      if (!member) {
        return res.status(404).json({ message: "User not found" });
      }

      if (member.Password === null) {
        return res.status(401).json({ message: "the User not allowed to login and password null" });
      }

      const skipSuperAdmin = member.RoleId !== 3;
      if (skipSuperAdmin) {
        const tenantStatus = member?.TenantId.Active !== null ? member.TenantId.Active : true;
        if (tenantStatus !== true) {
          return res.status(409).json({ message: "TenantStatus is not Active" });
        }
      }

      const isPasswordValid = await bcrypt.compareSync(password, member.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      // const token = Jwt.sign({ member }, "ILove_Node", { expiresIn: '8h' });
      const token = Jwt.sign({ member }, process.env.AUTH_SECRET_KEY || 'default_secret_key', { expiresIn: '8h' });
      // if(token) {
      //   const saveToken = await jwtTokenStoreRepo.create({
      //     memberId:member.id,
      //     token:token
      //   })
      //   await jwtTokenStoreRepo.save(saveToken)
      //   // console.log("store jwt token =========== ",saveToken)
      // }
      return res.status(200).json({ token, role: member.RoleId, id: member.id, status: member.Status, name: member.Name });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }

}

export default new AuthController();