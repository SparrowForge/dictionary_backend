import { MigrationInterface, QueryRunner } from "typeorm";

export class WordDetails1774804089131 implements MigrationInterface {
    name = 'WordDetails1774804089131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" ADD "english_meaning" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" DROP COLUMN "english_meaning"`);
    }

}
