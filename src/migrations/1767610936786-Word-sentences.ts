import { MigrationInterface, QueryRunner } from "typeorm";

export class WordSentences1767610936786 implements MigrationInterface {
    name = 'WordSentences1767610936786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_sentences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "sentence" character varying NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b209a404e036eafde0c021d329a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" ADD CONSTRAINT "FK_89da662485cbf4dfbf7ec7d660a" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" ADD CONSTRAINT "FK_5eeead15b4cbcef86113d7977ff" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" ADD CONSTRAINT "FK_e58d5effd59c1c6f75762f898c8" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" DROP CONSTRAINT "FK_e58d5effd59c1c6f75762f898c8"`);
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" DROP CONSTRAINT "FK_5eeead15b4cbcef86113d7977ff"`);
        await queryRunner.query(`ALTER TABLE "dc_word_sentences" DROP CONSTRAINT "FK_89da662485cbf4dfbf7ec7d660a"`);
        await queryRunner.query(`DROP TABLE "dc_word_sentences"`);
    }

}
