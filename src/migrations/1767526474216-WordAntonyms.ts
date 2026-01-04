import { MigrationInterface, QueryRunner } from "typeorm";

export class WordAntonyms1767526474216 implements MigrationInterface {
    name = 'WordAntonyms1767526474216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_antonymss" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "antonym" character varying NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_acfed0dd77c37e42c386638e81a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" ADD CONSTRAINT "FK_cd2334deccce81d6eff9ab9ceae" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" ADD CONSTRAINT "FK_8ecd3928a4d449d89c7cd3e8d41" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" ADD CONSTRAINT "FK_91f543a5aec34bd76abdd315457" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" DROP CONSTRAINT "FK_91f543a5aec34bd76abdd315457"`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" DROP CONSTRAINT "FK_8ecd3928a4d449d89c7cd3e8d41"`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonymss" DROP CONSTRAINT "FK_cd2334deccce81d6eff9ab9ceae"`);
        await queryRunner.query(`DROP TABLE "dc_word_antonymss"`);
    }

}
