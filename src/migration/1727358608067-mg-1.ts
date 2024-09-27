import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg11727358608067 implements MigrationInterface {
    name = 'Mg11727358608067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business" ("id" SERIAL NOT NULL, "Name" text, "DemoColumn" text, "memberId" integer, CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."address_addresstype_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "Address_1" text, "Address_2" text, "MaternalAddress" text, "City" text NOT NULL, "State" text NOT NULL, "Contact" text, "ZipCode" text, "AddressType" "public"."address_addresstype_enum" DEFAULT '1', "memberId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "announcement" ("id" SERIAL NOT NULL, "Tittle" text, "Description" text, "IsActive" boolean, "CreatedDate" date, "ImageUrl" text, "tenantId" integer, "memberId" integer, CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."memberShip_membershiptype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "memberShip" ("id" SERIAL NOT NULL, "memberShipType" "public"."memberShip_membershiptype_enum" NOT NULL, "memberId" integer, "tenantId" integer, CONSTRAINT "PK_21853391398f820505c46e30e09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "committee" ("id" SERIAL NOT NULL, "TenantId" integer, "MemberId" integer, "CommitteeRoleId" integer, CONSTRAINT "REL_8bc9ba09844a3c59193f1206d6" UNIQUE ("MemberId"), CONSTRAINT "PK_29569bbabae77e56711f2310563" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "committeeRoles" ("id" SERIAL NOT NULL, "Name" text, "tenantId" integer, CONSTRAINT "PK_6bc810dbe219652f23c190dab90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_ispaid_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "event" ("Id" SERIAL NOT NULL, "Name" text, "Active" boolean, "CreatedDate" date, "PublishDate" date, "Amount" integer, "Description" text, "Location" text, "Date" date, "Time" TIME, "Photos" text, "IsPaid" "public"."event_ispaid_enum" DEFAULT '2', "isEventQrScanned" boolean NOT NULL DEFAULT false, "tenantId" integer, CONSTRAINT "PK_b9fb457d103820051de041bc196" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" SERIAL NOT NULL, "Name" text NOT NULL, "CreatedDate" date, "ContactPersonName" text, "ContactPersonNumber" text, "ContactPersonEmail" text, "HeadOfficeAddress" text, "Active" boolean, CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "status" text NOT NULL, "transactionId" text, "amount" text, "discount" text, "firstname" text, "email" text, "phone" text, "paymentSource" text, "PG_TYPE" text, "bank_ref_num" text, "bankCode" text, "date" date NOT NULL, "mihPayId" text NOT NULL, "mode" text NOT NULL, "unMappedStatus" text NOT NULL, "errorMessage" text NOT NULL, "memberId" integer, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "memberShipHistory" ("id" SERIAL NOT NULL, "amount" text, "paymentType" text, "paymentDate" date, "startingDate" date, "endingDate" date, "memberId" integer, CONSTRAINT "PK_b993d7e0333271a56e74dfb195f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."member_relation_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TYPE "public"."member_gender_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."member_maritalstatus_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."member_bloodgroup_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TYPE "public"."member_roleid_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "Email" text NOT NULL, "UserName" text, "Password" text, "Name" text NOT NULL, "Relation" "public"."member_relation_enum" NOT NULL DEFAULT '4', "Gender" "public"."member_gender_enum" DEFAULT '1', "DOB" date NOT NULL, "Study" text, "MaritalStatus" "public"."member_maritalstatus_enum" NOT NULL DEFAULT '1', "BloodGroup" "public"."member_bloodgroup_enum", "MaternalName" text, "MaternalVillage" text, "Status" boolean NOT NULL, "Contact" text, "RoleId" "public"."member_roleid_enum" NOT NULL, "parentId" integer, "tenantId" integer, "committeeId" integer, CONSTRAINT "REL_7d82121bf8cc7462e214e0b45e" UNIQUE ("committeeId"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."enrollEvent_eventtype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "enrollEvent" ("id" SERIAL NOT NULL, "memberId" text, "eventId" text, "eventType" "public"."enrollEvent_eventtype_enum" DEFAULT '2', CONSTRAINT "PK_9280d77c1a82af69c4ec66eab7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_members" ("eventId" integer NOT NULL, "memberId" integer NOT NULL, CONSTRAINT "PK_e601684edc9bdaeba20d81a3293" PRIMARY KEY ("eventId", "memberId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37c13d44805876650e348b8af0" ON "event_members" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8b19dfb017039fd2f14e34fec" ON "event_members" ("memberId") `);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_28ebcb060b60e776937116743ea" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_00383702dc368a8993d1d0cee54" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_26e70ab8a2e6f97cb234fa7d50c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_e4bfe9af71648e8573517fec082" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberShip" ADD CONSTRAINT "FK_f453841e3eaca5b7b6165328ecf" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberShip" ADD CONSTRAINT "FK_95114a12fb440ad7dfbe6b8a5ea" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "committee" ADD CONSTRAINT "FK_751240b6be44d1caf1df13475f7" FOREIGN KEY ("TenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "committee" ADD CONSTRAINT "FK_8bc9ba09844a3c59193f1206d6f" FOREIGN KEY ("MemberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "committee" ADD CONSTRAINT "FK_75ff79f1bfe896fea102e3ef17c" FOREIGN KEY ("CommitteeRoleId") REFERENCES "committeeRoles"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "committeeRoles" ADD CONSTRAINT "FK_8a1718ea4342ffe706c26d7d972" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_4daf810855c05534a30a83f1720" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_89ce346f102c90b97ee97a94d75" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberShipHistory" ADD CONSTRAINT "FK_ec7de70ded557ef193d849d4f1f" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_693246d1c6fe3b4cd1d591c48fd" FOREIGN KEY ("parentId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_cfcff2edaa3497202e956d1733b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_7d82121bf8cc7462e214e0b45e5" FOREIGN KEY ("committeeId") REFERENCES "committee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_members" ADD CONSTRAINT "FK_37c13d44805876650e348b8af02" FOREIGN KEY ("eventId") REFERENCES "event"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_members" ADD CONSTRAINT "FK_a8b19dfb017039fd2f14e34fecf" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_members" DROP CONSTRAINT "FK_a8b19dfb017039fd2f14e34fecf"`);
        await queryRunner.query(`ALTER TABLE "event_members" DROP CONSTRAINT "FK_37c13d44805876650e348b8af02"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_7d82121bf8cc7462e214e0b45e5"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_cfcff2edaa3497202e956d1733b"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_693246d1c6fe3b4cd1d591c48fd"`);
        await queryRunner.query(`ALTER TABLE "memberShipHistory" DROP CONSTRAINT "FK_ec7de70ded557ef193d849d4f1f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_89ce346f102c90b97ee97a94d75"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_4daf810855c05534a30a83f1720"`);
        await queryRunner.query(`ALTER TABLE "committeeRoles" DROP CONSTRAINT "FK_8a1718ea4342ffe706c26d7d972"`);
        await queryRunner.query(`ALTER TABLE "committee" DROP CONSTRAINT "FK_75ff79f1bfe896fea102e3ef17c"`);
        await queryRunner.query(`ALTER TABLE "committee" DROP CONSTRAINT "FK_8bc9ba09844a3c59193f1206d6f"`);
        await queryRunner.query(`ALTER TABLE "committee" DROP CONSTRAINT "FK_751240b6be44d1caf1df13475f7"`);
        await queryRunner.query(`ALTER TABLE "memberShip" DROP CONSTRAINT "FK_95114a12fb440ad7dfbe6b8a5ea"`);
        await queryRunner.query(`ALTER TABLE "memberShip" DROP CONSTRAINT "FK_f453841e3eaca5b7b6165328ecf"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_e4bfe9af71648e8573517fec082"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_26e70ab8a2e6f97cb234fa7d50c"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_00383702dc368a8993d1d0cee54"`);
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_28ebcb060b60e776937116743ea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8b19dfb017039fd2f14e34fec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37c13d44805876650e348b8af0"`);
        await queryRunner.query(`DROP TABLE "event_members"`);
        await queryRunner.query(`DROP TABLE "enrollEvent"`);
        await queryRunner.query(`DROP TYPE "public"."enrollEvent_eventtype_enum"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TYPE "public"."member_roleid_enum"`);
        await queryRunner.query(`DROP TYPE "public"."member_bloodgroup_enum"`);
        await queryRunner.query(`DROP TYPE "public"."member_maritalstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."member_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."member_relation_enum"`);
        await queryRunner.query(`DROP TABLE "memberShipHistory"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TYPE "public"."event_ispaid_enum"`);
        await queryRunner.query(`DROP TABLE "committeeRoles"`);
        await queryRunner.query(`DROP TABLE "committee"`);
        await queryRunner.query(`DROP TABLE "memberShip"`);
        await queryRunner.query(`DROP TYPE "public"."memberShip_membershiptype_enum"`);
        await queryRunner.query(`DROP TABLE "announcement"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TYPE "public"."address_addresstype_enum"`);
        await queryRunner.query(`DROP TABLE "business"`);
    }

}
