import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { CommitteeRoles } from "../models/committeeRoles";
import { Tenant } from "../models/tenant";

class CommitteeRoleController {
    async CreateCommitteeRoles(req:Request,res:Response,next:NextFunction) {
        //
      try {
          let tenantId:any = req.decoded.member.TenantId.id;          
          let roleName = req.body.roleName.name
          const connection = await dbUtils.getDefaultConnection();
          const committeeRoleRepo = connection.getRepository(CommitteeRoles)
          const tenantRepo = connection.getRepository(Tenant)

          const findTenant = await tenantRepo.findOne({where: {id:tenantId}})

          if(findTenant) {
            const createCommitteeRoles = committeeRoleRepo.create({
                Name:roleName,
                tenantId:tenantId
              });
            await committeeRoleRepo.save(createCommitteeRoles)
            return res.status(200).json(createCommitteeRoles);
          } else {
            return res.status(404).json("Tenant not found");
          }
      } catch (error) {
        if(error.driverError && error.driverError.code === '23505') {
            return res.status(409).json("this role is already exists");
        }
        return res.status(500).json({ message: "error", error, });
      }
    }

    async GetAllCommitteeRoles(req:Request,res:Response,next:NextFunction) {
    try {
      const tenantId:any = req.decoded.member.TenantId.id;
        const connection = await dbUtils.getDefaultConnection();
        const committeeRoleRepo = connection.getRepository(CommitteeRoles)
        const tenantRepo = connection.getRepository(Tenant)

        const findTenant = await tenantRepo.findOne({where: {id:tenantId}})
        const findCommitteeRoles = await committeeRoleRepo.find({ 
          where: { 
            tenantId: { 
              id: tenantId
            }
          },   
          order: {id: "DESC"}
        });

        return res.status(200).json({findCommitteeRoles});
    } catch (error) {
      return res.status(500).json({ message: "error", error, });
    }
  }

}
export default new CommitteeRoleController();