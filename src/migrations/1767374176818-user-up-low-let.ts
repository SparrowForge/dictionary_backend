import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUpLowLet1767374176818 implements MigrationInterface {
    name = 'UserUpLowLet1767374176818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "created_by" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "updated_by" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "updatedBy" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
