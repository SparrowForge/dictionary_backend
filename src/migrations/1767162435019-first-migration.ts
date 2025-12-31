import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1767162435019 implements MigrationInterface {
    name = 'FirstMigration1767162435019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_roles_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "dc_roles" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" text, "status" "public"."dc_roles_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_85693d497865ef8ea9d3d334439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."dc_users_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "dc_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "user_name" character varying NOT NULL, "password" character varying NOT NULL, "is_news_letter" boolean NOT NULL DEFAULT false, "phone_no" character varying, "first_name" character varying, "last_name" character varying, "address_line_1" character varying, "address_line_2" character varying, "city" character varying, "post_code" character varying, "state" character varying, "date_of_birth" TIMESTAMP, "roleId" integer, "status" "public"."dc_users_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_479bcff443fbdc318f418dfe3a2" UNIQUE ("email"), CONSTRAINT "UQ_3922e8cdf7bcd3c1850fd5034ed" UNIQUE ("user_name"), CONSTRAINT "PK_59f247d8674a3c2e5c0696cdb8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_refresh_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_de8570e4b6eb2503d0e7edba99d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_password_reset_tokens" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_183fc6f7aedef7378d72b5caf98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_audit_logs" ("id" SERIAL NOT NULL, "userId" character varying, "username" character varying(255), "action" character varying(50) NOT NULL, "resource" character varying(100) NOT NULL, "resourceId" character varying(100), "method" character varying(10) NOT NULL, "url" character varying(500) NOT NULL, "ip" character varying(45) NOT NULL, "userAgent" character varying(500) NOT NULL, "requestBody" json, "responseStatus" integer NOT NULL, "responseTime" integer NOT NULL, "success" boolean NOT NULL, "error" text, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_84dcce51c68089d5c97485080ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_45bd47d83ff89cfb8c7a3a7fb0" ON "dc_audit_logs" ("success", "timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_28445da3a62f7da21427c0db13" ON "dc_audit_logs" ("action", "timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c7b628caead1104247898b555" ON "dc_audit_logs" ("resource", "resourceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_77cd21b27410ba42569b25ee25" ON "dc_audit_logs" ("userId", "timestamp") `);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_ad82a9ca8eb418126700d257a52" FOREIGN KEY ("roleId") REFERENCES "dc_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_refresh_tokens" ADD CONSTRAINT "FK_f8aefb1937253f5b57a2641fc24" FOREIGN KEY ("userId") REFERENCES "dc_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_password_reset_tokens" ADD CONSTRAINT "FK_443f0ae08a1c4741f8c3effa06c" FOREIGN KEY ("userId") REFERENCES "dc_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_password_reset_tokens" DROP CONSTRAINT "FK_443f0ae08a1c4741f8c3effa06c"`);
        await queryRunner.query(`ALTER TABLE "dc_refresh_tokens" DROP CONSTRAINT "FK_f8aefb1937253f5b57a2641fc24"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_ad82a9ca8eb418126700d257a52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77cd21b27410ba42569b25ee25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c7b628caead1104247898b555"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28445da3a62f7da21427c0db13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_45bd47d83ff89cfb8c7a3a7fb0"`);
        await queryRunner.query(`DROP TABLE "dc_audit_logs"`);
        await queryRunner.query(`DROP TABLE "dc_password_reset_tokens"`);
        await queryRunner.query(`DROP TABLE "dc_refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "dc_users"`);
        await queryRunner.query(`DROP TYPE "public"."dc_users_status_enum"`);
        await queryRunner.query(`DROP TABLE "dc_roles"`);
        await queryRunner.query(`DROP TYPE "public"."dc_roles_status_enum"`);
    }

}
