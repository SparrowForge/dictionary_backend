import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1774852946915 implements MigrationInterface {
    name = 'Notification1774852946915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_notification_records_deliverystatus_enum" AS ENUM('Delivered', 'Pending')`);
        await queryRunner.query(`CREATE TABLE "dc_notification_records" ("id" SERIAL NOT NULL, "userId" uuid, "notificationTitle" character varying(255) NOT NULL, "notificationMessage" character varying(255) NOT NULL, "deliveryStatus" "public"."dc_notification_records_deliverystatus_enum" DEFAULT 'Pending', "isSeen" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9250fbdb8b3e85d41e97d74c229" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_user_to_firebase_token_map" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "token" character varying(512) NOT NULL, "lastActiveAt" TIMESTAMP, CONSTRAINT "PK_068b3d7d18b47e5e37f55bdfbcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_notification_records" ADD CONSTRAINT "FK_16207715391b8acf75363694cbb" FOREIGN KEY ("userId") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_user_to_firebase_token_map" ADD CONSTRAINT "FK_64e51342568e0fec1de063ad79f" FOREIGN KEY ("userId") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_user_to_firebase_token_map" DROP CONSTRAINT "FK_64e51342568e0fec1de063ad79f"`);
        await queryRunner.query(`ALTER TABLE "dc_notification_records" DROP CONSTRAINT "FK_16207715391b8acf75363694cbb"`);
        await queryRunner.query(`DROP TABLE "dc_user_to_firebase_token_map"`);
        await queryRunner.query(`DROP TABLE "dc_notification_records"`);
        await queryRunner.query(`DROP TYPE "public"."dc_notification_records_deliverystatus_enum"`);
    }

}
