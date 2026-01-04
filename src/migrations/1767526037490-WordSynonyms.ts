import { MigrationInterface, QueryRunner } from "typeorm";

export class WordSynonyms1767526037490 implements MigrationInterface {
    name = 'WordSynonyms1767526037490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_synonymss" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "synonym" character varying NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c043a0f7a36b48eeb06ec90f92b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" ADD CONSTRAINT "FK_e8289aeb3a629f1bdb64fed1299" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" ADD CONSTRAINT "FK_50c8d652b8c1c0ccf2652f5c73b" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" ADD CONSTRAINT "FK_332d2d07702c499b1b7fde8d7d5" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" DROP CONSTRAINT "FK_332d2d07702c499b1b7fde8d7d5"`);
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" DROP CONSTRAINT "FK_50c8d652b8c1c0ccf2652f5c73b"`);
        await queryRunner.query(`ALTER TABLE "dc_word_synonymss" DROP CONSTRAINT "FK_e8289aeb3a629f1bdb64fed1299"`);
        await queryRunner.query(`DROP TABLE "dc_word_synonymss"`);
    }

}
