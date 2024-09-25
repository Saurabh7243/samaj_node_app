import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./tenant";
import { Member } from "./members";
import { CommitteeRoles } from "./committeeRoles";

@Entity({name: "committee",synchronize: true})
export class Committee {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Tenant, (tenant)=> tenant.committeeRole)
    @JoinColumn({name:"TenantId"})
    tenantId:Tenant

    @OneToOne(()=>Member, (member)=> member.committee)
    @JoinColumn({name:"MemberId"})
    memberId:Member

    @ManyToOne(()=>CommitteeRoles, (CommitteeRoles)=> CommitteeRoles.committee,{onUpdate:'CASCADE'})
    @JoinColumn({name:"CommitteeRoleId"})
    committeeRoleId:CommitteeRoles
}