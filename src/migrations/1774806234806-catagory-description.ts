import { MigrationInterface, QueryRunner } from "typeorm";

export class CatagoryDescription1774806234806 implements MigrationInterface {
    name = 'CatagoryDescription1774806234806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_catagory" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_catagory" DROP COLUMN "description"`);
    }

}
