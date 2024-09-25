import { Column, Entity, IntegerType, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./tenant";
import { IsPaidEnum } from "../utils/enumData";
import { Member } from "./members";

@Entity({name : 'event' , synchronize:true})
export class Events {
    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(() => Tenant , (tenant) => tenant.events)
    @JoinColumn({name : 'tenantId'})
    TenantId : Tenant

    @Column({type : 'text' , nullable : true})
    Name : string

    @Column ({type : 'boolean' , nullable : true})
    Active : boolean;

    @Column ({type : 'date' , nullable : true})
    CreatedDate : Date;

    @Column ({type : 'date', nullable : true})
    PublishDate : Date;

    @Column ({type : 'int',nullable : true})
    Amount : number;

    @Column ({type : 'text',nullable : true})
    Description : string;

    @Column ({type : 'text',nullable : true})
    Location : string

    @Column ({type : 'date',nullable : true})
    Date : Date;    

    @Column ({type : 'time',nullable : true})
    Time : string

    @Column ({type : 'text',nullable : true})
    Photos : string;

    @Column ({type : 'enum',enum : IsPaidEnum  , default : IsPaidEnum.IsFree ,nullable:true})
    IsPaid : IsPaidEnum

    @Column({ default: false })
    isEventQrScanned: boolean;
    // @OneToMany(() => Member, (member)=> member.events, { nullable: true })    
    // enrolledMembers: Member[];

    @ManyToMany(() => Member, (member) => member.events)
    @JoinTable({
      name: "event_members", // Name of the junction table
      joinColumn: { name: "eventId", referencedColumnName: "Id" },
      inverseJoinColumn: { name: "memberId", referencedColumnName: "id" },
    })
    enrolledMembers: Member[];
}