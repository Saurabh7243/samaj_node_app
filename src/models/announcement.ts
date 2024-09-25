import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./tenant";
import { Member } from "./members";

@Entity({name:'announcement', synchronize:true})
class Announcement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text', nullable:true})
    Tittle: string;

    @Column({type:'text',nullable:true})
    Description: string;

    @Column({type:'boolean',nullable:true})
    IsActive: boolean

    @Column({type:'date', nullable:true})
    CreatedDate: Date
    @Column({type:'text', nullable:true})
    ImageUrl: string

    @ManyToOne(()=> Tenant, (tenant)=> tenant.announcement)
    @JoinColumn({ name:"tenantId"})
    TenantId: Tenant

    @ManyToOne(()=> Member, (member)=> member.Announcements)
    @JoinColumn({name:"memberId"})
    MemberId:Member[];
}

export default Announcement;