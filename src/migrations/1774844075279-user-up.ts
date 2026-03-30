import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUp1774844075279 implements MigrationInterface {
    name = 'UserUp1774844075279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "verification_token" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "verification_token_expires_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "verification_token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "verification_token"`);
    }

}
