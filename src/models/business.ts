import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Member } from "./members";

@Entity({ name: "business", synchronize: true })
export class Business {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type:'text', nullable:true})
  Name: string;

  @Column({type:'text', nullable:true})
  DemoColumn: string

  @ManyToOne(() => Member, (member) => member.businesses, { nullable: true })
  @JoinColumn({ name: "memberId" })
  member: Member;
}