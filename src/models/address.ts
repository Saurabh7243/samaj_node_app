import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./members";
import { AddressTypeEnum } from "../utils/enumData";

@Entity({name:'address', synchronize:true})

export class Address_ {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Member, (member) => member.addresses)
    member: Member;
    
    @Column({type: 'text', nullable:true})
    Address_1: string;

    @Column({type: 'text', nullable:true})
    Address_2: string;

    @Column({type: 'text', nullable:true})
    MaternalAddress: string;
    
    @Column({type: 'text', nullable:false})
    City: string;

    @Column({type: 'text', nullable:false})
    State:string;

    @Column({ type: 'text', nullable:true})
    Contact: string;

    @Column({ type: 'text', nullable:true})
    ZipCode: string;

    @Column({ type: 'enum', enum:AddressTypeEnum, nullable:true, default:AddressTypeEnum.Current})
    AddressType:AddressTypeEnum
}