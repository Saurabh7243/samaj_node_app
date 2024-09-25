import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./members";
import { MemberShipTypeEnum } from "../utils/enumData";
import { Tenant } from "./tenant";

@Entity({name: "memberShip",synchronize: true})
export class MemberShip {
    @PrimaryGeneratedColumn()
    id:string;

    @ManyToOne(()=>Member,(member)=>member.memberShips)
    @JoinColumn({name: "memberId",})
    memberId:Member;

    @ManyToOne(()=>Tenant,(tenant)=>tenant.id)
    @JoinColumn({name: "tenantId",})
    tenantId:Tenant;

    @Column({type: "enum", enum:MemberShipTypeEnum})
    memberShipType:MemberShipTypeEnum;
}