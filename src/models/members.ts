import { BeforeInsert, Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Business } from "./business";
import { Address_ } from "./address";
import { RelationEnum, MaritalStatusEnum, BloodGroupEnum, GenderEnum, MemberRoleEnum } from "../utils/enumData";
import * as bcrypt from 'bcrypt';
import { Tenant } from "./tenant";
import Announcement from "./announcement";
import Payment from "./payment";
import { MemberShip } from "./memberShip";
import { MemberShipHistory } from "./memberShipHistory";
import { Committee } from "./committee";
import { Events } from "./event";

@Entity({ name: 'member', synchronize: true })

export class Member {
  @PrimaryGeneratedColumn() //auto increment ids
  id: number;

  @Column({ type: 'text'})
  Email: string

  @Column({type: 'text',nullable:true})   
  UserName: string

  @Column({type: 'text',nullable:true})
  Password: string

  @Column({ nullable: false, type: 'text', })
  Name: string;

  //enum 
  @Column({ type: 'enum', enum:RelationEnum, default: RelationEnum.Head})
  Relation: RelationEnum; 

  @Column({ type: 'enum', enum:GenderEnum, nullable:true, default:GenderEnum.Male })
  Gender:GenderEnum;

  @Column({ type: 'date' })
  DOB: Date;

  @Column({ nullable: true, type: 'text' })
  Study: string;

  //enum type int
  @Column({ type: 'enum', enum: MaritalStatusEnum, default: MaritalStatusEnum.Married ,nullable: false})
  MaritalStatus: MaritalStatusEnum;

  //enum type int
  @Column({ type: 'enum', enum: BloodGroupEnum, nullable: true })
  BloodGroup: BloodGroupEnum;

  @Column({ type: 'text', nullable: true })
  MaternalName: string;

  @Column({ type: 'text', nullable: true })
  MaternalVillage:string

  @Column({ type: 'boolean' })
  Status: boolean;

  @OneToMany(() => Address_, (address) => address.member, { nullable: true, cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE' })
  addresses: Address_[];

  @Column({ type: 'text', nullable:true})
  Contact: string;

  @OneToMany(() => Business, (business) => business.member, {nullable:true, cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'}) 
  businesses: Business[];

  @OneToMany(() => MemberShip, (memberShip) => memberShip.memberId, {nullable:true, cascade:true, onDelete:'CASCADE',onUpdate:'CASCADE'})
  memberShips:MemberShip[];

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: "parentId" })
  ParentId: Member;

  @ManyToOne(() => Tenant, (tenant) => tenant.members)
  @JoinColumn({ name: "tenantId" })
  TenantId: Tenant;

  @Column({type:"enum", enum:MemberRoleEnum})
  RoleId: MemberRoleEnum;

  @OneToMany(()=>Announcement, (announcement)=> announcement.MemberId)
  Announcements: Announcement[];

  @OneToMany(()=>Payment, (payment)=> payment.memberId, {cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
  Payments: Payment[];

  @OneToMany(()=>MemberShipHistory,(history)=> history.meberId, {cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
  MemberShipHistory: MemberShipHistory []

  @OneToOne(()=>Committee,(committee)=>committee.memberId, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({name:"committeeId"})
  committee:Committee

  // @ManyToOne(() => Events, (event) => event.enrolledMembers)
  // @JoinColumn({ name: "events" })
  // events: Events;

  @ManyToMany(() => Events, (event) => event.enrolledMembers)
  @JoinTable({
    name: "event_members", // Same junction table name
    joinColumn: { name: "memberId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "eventId", referencedColumnName: "Id" },
  })
  events: Event[];
  
  @BeforeInsert()
  async hashPassword() {    
    if(this.Password) {
      const saltRounds = 10;
      this.Password = await bcrypt.hash(this.Password, saltRounds);
    }
  }
}