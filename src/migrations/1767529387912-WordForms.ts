import { MigrationInterface, QueryRunner } from "typeorm";

export class WordForms1767529387912 implements MigrationInterface {
    name = 'WordForms1767529387912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "form_type" character varying NOT NULL, "form_value" character varying NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_64127d08d5d7a6bde67ef3b3c20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_word_antonyms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "antonym" character varying NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a51dada4cc24eff48aae3a70cab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" ADD CONSTRAINT "FK_45a9539735d210b9d16511c7951" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" ADD CONSTRAINT "FK_4d24219d647b9f793e955ec3a61" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" ADD CONSTRAINT "FK_f0e3b655c42a1920eda90001220" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" ADD CONSTRAINT "FK_835fdd09a7630a2877c81039a4d" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" ADD CONSTRAINT "FK_414b78857823bb183d41dd1fcea" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" ADD CONSTRAINT "FK_3212c6ce2952835c158879f1caf" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" DROP CONSTRAINT "FK_3212c6ce2952835c158879f1caf"`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" DROP CONSTRAINT "FK_414b78857823bb183d41dd1fcea"`);
        await queryRunner.query(`ALTER TABLE "dc_word_antonyms" DROP CONSTRAINT "FK_835fdd09a7630a2877c81039a4d"`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" DROP CONSTRAINT "FK_f0e3b655c42a1920eda90001220"`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" DROP CONSTRAINT "FK_4d24219d647b9f793e955ec3a61"`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" DROP CONSTRAINT "FK_45a9539735d210b9d16511c7951"`);
        await queryRunner.query(`DROP TABLE "dc_word_antonyms"`);
        await queryRunner.query(`DROP TABLE "dc_word_forms"`);
    }

}
