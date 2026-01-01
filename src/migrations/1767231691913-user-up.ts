import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUp1767231691913 implements MigrationInterface {
    name = 'UserUp1767231691913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "UQ_3922e8cdf7bcd3c1850fd5034ed"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "user_name"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "is_news_letter"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "address_line_1"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "address_line_2"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "post_code"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "UQ_d444e192865dd0d18d37bf6ed85" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "updatedBy" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "UQ_d444e192865dd0d18d37bf6ed85"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "date_of_birth" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "post_code" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "address_line_2" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "address_line_1" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "is_news_letter" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "user_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "UQ_3922e8cdf7bcd3c1850fd5034ed" UNIQUE ("user_name")`);
    }

}
