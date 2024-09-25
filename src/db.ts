import 'reflect-metadata';
import { DataSource,  } from 'typeorm';
import {Member} from './models/members';
import { Business } from './models/business';
import { Address_ } from './models/address';
import { Tenant } from './models/tenant';
import Announcement from './models/announcement';
import Payment from './models/payment';
import { MemberShip } from './models/memberShip';
import { MemberShipHistory } from './models/memberShipHistory';
import { CommitteeRoles } from './models/committeeRoles';
import { Committee } from './models/committee';
import { Events } from './models/event';

import * as dotenv from 'dotenv';
dotenv.config();
import "./"
import { EnrollEvent } from './models/enrollEvent';
// this is subase database connection
const port = parseInt(process.env.DB_PORT || '5432')
export const dataSource = new DataSource({
    type:'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DATABASE_NAME,
    synchronize:true,
    migrationsRun: true,
    logging: false,
    // cache: {
    //     type: "database",
    //     duration: 30000
    // },
    entities: [Member,Business,Address_,Tenant,Announcement,Payment,MemberShip,MemberShipHistory,CommitteeRoles,Committee,Events,EnrollEvent],
    migrations: ["/migrations/**/*.ts"],
});

//for production
// export const dataSource = new DataSource({
//     type:'postgres',
//     url: process.env.LIVE_DB_URL,
//     port: 5432,
//     synchronize:false,
//     migrationsRun: true,
//     logging: false,
//     ssl:true,
//     entities: [Member,Business,Address_,Tenant,Announcement,Payment,MemberShip,MemberShipHistory,CommitteeRoles,Committee,Events,EnrollEvent],
//     migrations: ["/migrations/**/*.ts"],
// });