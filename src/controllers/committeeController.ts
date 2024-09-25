import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Committee } from "../models/committee";


class CommitteeController {
  async CreateCommittee(req: Request, res: Response, next: NextFunction) {
    //
    try {
      const { currentCommitteeRoleId, memberId } = req.body
      let updatedRoleId = req.body.updatedRoleId?.id
      let memberExistsInCommittee: any = []
      let tenantId = req.decoded.member.TenantId.id

      const connection = await dbUtils.getDefaultConnection();
      const committeeRepo = connection.getRepository(Committee)
      const memberExist: any = await committeeRepo.createQueryBuilder('committee')
        .where("committee.memberId = :memberId", { memberId: memberId })
        .getOne()

      if (!tenantId) {
        return res.status(404).json("tenantId not found")
      }

      if (memberExist && currentCommitteeRoleId) {
        const query = ` UPDATE "committee"
        SET "CommitteeRoleId" = $1
        WHERE "MemberId" = $2
          AND "CommitteeRoleId" = $3`
        await connection.query(query, [updatedRoleId, memberId, currentCommitteeRoleId]);
        return res.status(200).json({ message: "committee updated" });
      } else {
        let globalCommitteeRoles = req.body.globalSelectedCommitteeRoles
        for (const role of globalCommitteeRoles) {
          const memberExist = await committeeRepo.createQueryBuilder('committee')
            .where("committee.memberId = :memberId", { memberId: role.memberId })
            .getRawOne()
          if (memberExist) {
            memberExistsInCommittee.push(memberExist)        
          } else {
            let createCommittee = committeeRepo.create({
              tenantId: tenantId,
              memberId: role.memberId,
              committeeRoleId: role.committeeRoleId,

            })
            console.log(createCommittee)
            await committeeRepo.save(createCommittee)
          }
        }
        return res.status(200).json({ message: "committee created" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error", error, });
    }
  }

  async GetAllCommittee(req: Request, res: Response, next: NextFunction) {
    try {
      let tenantId = req.decoded.member.TenantId.id
      const connection = await dbUtils.getDefaultConnection();
      const committeeRepo = connection.getRepository(Committee)
      const availableCommittee = await committeeRepo.createQueryBuilder('committee')
        .leftJoinAndSelect("committee.committeeRoleId", "committeeRoleId")
        .leftJoinAndSelect("committee.memberId", "memberId")
        .select([
          "memberId.Name",
          "memberId.Contact",
          "memberId.id",
          "memberId.Email",
          "committeeRoleId.Name",
          "committeeRoleId.id",
          "committee.id"
        ])
        .where("committee.tenantId = :tenantId", { tenantId: tenantId })
        .getRawMany()
      return res.status(200).json({ availableCommittee });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error", error, });
    }
  }

}
export default new CommitteeController();