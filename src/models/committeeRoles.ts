import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./tenant";
import { Committee } from "./committee";

@Entity({name: "committeeRoles",synchronize: true})
export class CommitteeRoles {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ nullable: true, type: 'text'})
    Name: string;

    @ManyToOne(()=>Tenant, (tenant)=> tenant.committeeRole)
    @JoinColumn({name:'tenantId'})
    tenantId:Tenant

    @OneToMany(()=>Committee,((committee)=>committee.committeeRoleId), {cascade: true,onUpdate:'CASCADE'})
    //cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'
    committee:Committee[]
}