import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./members";
import { PaymentMode } from "../utils/enumData";

@Entity({name: "memberShipHistory",synchronize:true})
export class MemberShipHistory {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Member, (member)=> member.MemberShipHistory)
    @JoinColumn({name:"memberId"})
    meberId:Member

    @Column({type: "text",nullable:true})
    amount:number

    @Column({type: "text",enum:PaymentMode,nullable:true})
    paymentType:PaymentMode

    @Column({type: "date",nullable:true})
    paymentDate:Date

    @Column({type: "date",nullable:true})
    startingDate:Date

    @Column({type: "date",nullable:true})
    endingDate:Date
}