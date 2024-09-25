import { EventTypeEnum } from "../utils/enumData";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'enrollEvent', synchronize:true})

export class EnrollEvent {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'text', nullable:true})
    memberId:number

    @Column({type:'text', nullable:true})
    eventId:number

    @Column({type:'enum', enum: EventTypeEnum, default:EventTypeEnum.Free, nullable:true})
    eventType:EventTypeEnum
}