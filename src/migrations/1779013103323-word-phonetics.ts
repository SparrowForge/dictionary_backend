import { MigrationInterface, QueryRunner } from "typeorm";

export class WordPhonetics1779013103323 implements MigrationInterface {
    name = 'WordPhonetics1779013103323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" ADD "phonetics" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" DROP COLUMN "phonetics"`);
    }

}
