import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIsvarified1774806726688 implements MigrationInterface {
    name = 'UserIsvarified1774806726688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "is_verified"`);
    }

}
