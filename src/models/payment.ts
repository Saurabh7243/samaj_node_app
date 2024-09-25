import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./members";

@Entity({name:"payment",synchronize:true})
class Payment {
    @PrimaryGeneratedColumn()
    id:string

    @Column({type:'text',nullable:false})
    status:string

    @Column({type:'text',nullable:true})
    transactionId:string
    
    @Column({type:'text',nullable:true})
    amount:string

    @Column({type:'text',nullable:true})
    discount:string

    @Column({type:'text',nullable:true})
    firstname:string

    @Column({type:'text',nullable:true})
    email:string

    @Column({type:'text',nullable:true})
    phone:string

    @Column({type:'text',nullable:true})
    paymentSource:string

    @Column({type:'text',nullable:true})
    PG_TYPE:string

    @Column({type:'text',nullable:true})
    bank_ref_num:string

    @Column({type:'text',nullable:true})
    bankCode:string

    @Column({type:'date'})
    date:Date

    @Column({type:'text'})
    mihPayId:string

    @Column({type:'text'})
    mode:string

    @Column({type:'text'})
    unMappedStatus:string

    @Column({type:'text'})
    errorMessage:string
    
    
    @ManyToOne(()=>Member, (member)=> member.id)
    @JoinColumn({name:"memberId"})
    memberId:Member[]
}

export default Payment;