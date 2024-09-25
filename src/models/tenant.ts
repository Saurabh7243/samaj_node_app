import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./members";
import Announcement from "./announcement";
import { MemberShip } from "./memberShip";
import { CommitteeRoles } from "./committeeRoles";
import { Events } from "./event";


@Entity({name: 'tenant', synchronize:true})
export class Tenant {
  @PrimaryGeneratedColumn()   
  id: number;

  @Column({ type: 'text'})
  Name: string

  @Column({ type: 'date', nullable:true})
  CreatedDate: Date;

  @Column({type: 'text',nullable:true})
  ContactPersonName: string

  @Column({type: 'text',nullable:true})
  ContactPersonNumber: string

  @Column({type: 'text',nullable:true})
  ContactPersonEmail: string

  @Column({type: 'text',nullable:true})
  HeadOfficeAddress: string

  @Column({type: 'boolean', nullable: true })
  Active: boolean;

  @OneToMany(() => Member, (member) => member.TenantId)
  members: Member[];

  @OneToMany(() => Announcement,(announcement)=> announcement.TenantId)
  announcement:Announcement

  @OneToMany(()=> MemberShip,(memberShip)=> memberShip.tenantId)
  memberShips:MemberShip[]

  @OneToMany(()=> CommitteeRoles, (committeeRoles)=> committeeRoles.tenantId,{cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
  committeeRole:CommitteeRoles []

  @OneToMany(()=>Events,(event)=>event.TenantId, {cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
  events: Events[]
}