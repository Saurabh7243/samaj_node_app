import  { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Tenant } from "../models/tenant";
import { CommitteeRoles } from "../models/committeeRoles";


class TenantController {
    async createTenant(req: Request, res: Response, next: NextFunction) {
        const { address,contactNumber,dob,email,status,tenantName,contactPersonName } = req.body.formData
        //
        try {
            const connection = await dbUtils.getDefaultConnection();
            const tenantRepo = connection.getRepository(Tenant)
            const committeeRoleRepo = connection.getRepository(CommitteeRoles)

            const tenant = tenantRepo.create({
                Name:tenantName,
                CreatedDate:dob,
                ContactPersonEmail:email,
                ContactPersonName:contactPersonName,
                HeadOfficeAddress:address,
                ContactPersonNumber:contactNumber,
                Active: true,
            });

            await tenantRepo.save(tenant)
            const createdTenant = await tenantRepo.findOne({ where: { id: tenant.id } });
            if(createdTenant) {
                const defaultCommitteeRoles:any = [
                    { Name: "chairman", tenantId: createdTenant.id },
                    { Name: "secretary",tenantId: createdTenant.id },
                    { Name: "members",  tenantId: createdTenant.id },
                ];
                const createDefaultCommitteeRoles = await committeeRoleRepo
                .createQueryBuilder()
                .insert()
                .into(CommitteeRoles)
                .values(defaultCommitteeRoles)
                .execute()
            }
            res.status(200).json({tenant,message:"tenant created successfully"});
        } catch (error) {
            console.error(error)
        }
    }

    async getAllTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const tenantRepo = connection.getRepository(Tenant)

            const tenantResult = await tenantRepo.createQueryBuilder('tenant')
                .select([
                    "tenant.Name",
                    "tenant.CreatedDate",
                    "tenant.id",
                    "tenant.ContactPersonName",
                    "tenant.ContactPersonNumber",
                    "tenant.ContactPersonEmail",
                    "tenant.HeadOfficeAddress",
                    "tenant.Active"
                ])
                .cache(true)
                .getRawMany()

                const formattedResults = tenantResult.map(tenant => ({
                    Name: tenant.tenant_Name,
                    CreatedDate: tenant.CreatedDate,
                    id: tenant.tenant_id,
                    ContactPersonName: tenant.tenant_ContactPersonName,
                    ContactPersonNumber: tenant.tenant_ContactPersonNumber,
                    ContactPersonEmail: tenant.tenant_ContactPersonEmail,
                    HeadOfficeAddress: tenant.tenant_HeadOfficeAddress,
                    Active: tenant.tenant_Active
                }));                
            return res.status(200).json(formattedResults);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "error", error });
        }
    }

    
    async getTenant(req: Request, res: Response, next: NextFunction) {
        //
        const { editTenantId } = req.body;
        try {
            const connection = await dbUtils.getDefaultConnection();
            const tenantRepo = connection.getRepository(Tenant)

            const result = await tenantRepo.createQueryBuilder("tenant")
                .select([
                        "tenant.Name", 
                        "tenant.CreatedDate",
                        "tenant.id",
                        "tenant.ContactPersonName",
                        "tenant.ContactPersonNumber",
                        "tenant.ContactPersonEmail",
                        "tenant.HeadOfficeAddress",
                        "tenant.Active",                                           
                    ])            
                .leftJoin('tenant.members', 'member')
                .addSelect(["member.id"])
                .where("tenant.id = :id", {id:editTenantId})
                .andWhere("member.TenantId = :TenantId", { TenantId : editTenantId})
                .andWhere("member.RoleId = :RoleId", {RoleId : 1})
                .getOne()
         
            return res.status(200).json({result});
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "error", error });

        }
    }

    async updateTenant(req: Request, res: Response, next: NextFunction) {
        //
        // let editTenantId = req.body.editTenantId;
        const { address,contactNumber,dob,email,status,tenantName,contactPersonName,editTenantId } = req.body.formData
        try {
          const connection = await dbUtils.getDefaultConnection();
          const tenantRepo = connection.getRepository(Tenant);

          let currntStatus = null;
          if (status === 'Active') {
            currntStatus = true;
          } else {
            currntStatus = false;
          }
          const updateBusiness: any = await tenantRepo
            .createQueryBuilder("tenant")
            .update(Tenant)
            .set({
              Name:tenantName,
              CreatedDate:dob,
              ContactPersonEmail:email,
              ContactPersonName:contactPersonName,
              HeadOfficeAddress:address,
              ContactPersonNumber:contactNumber,
              Active: currntStatus
            })
            .where("tenant.id = :id", { id: editTenantId })
            .execute();
          return res.status(200).json(updateBusiness);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default new TenantController();