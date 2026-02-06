import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRollNumber1770359974599 implements MigrationInterface {
    name = 'UserRollNumber1770359974599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "roll_number" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "roll_number"`);
    }

}
