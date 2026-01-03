import { MigrationInterface, QueryRunner } from "typeorm";

export class WordsClasses1767457843311 implements MigrationInterface {
    name = 'WordsClasses1767457843311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_classess" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "class_id" uuid NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_fb39ac0e225b712bdba8ed1df2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" ADD CONSTRAINT "FK_459f247396e7a37528ff538bd2d" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" ADD CONSTRAINT "FK_25b5c162a72d7a0943da9e492f2" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" ADD CONSTRAINT "FK_b731c3f5445f956d7364dbb88d1" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" ADD CONSTRAINT "FK_d6523a2add43402eecff3246af9" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_classess" DROP CONSTRAINT "FK_d6523a2add43402eecff3246af9"`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" DROP CONSTRAINT "FK_b731c3f5445f956d7364dbb88d1"`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" DROP CONSTRAINT "FK_25b5c162a72d7a0943da9e492f2"`);
        await queryRunner.query(`ALTER TABLE "dc_word_classess" DROP CONSTRAINT "FK_459f247396e7a37528ff538bd2d"`);
        await queryRunner.query(`DROP TABLE "dc_word_classess"`);
    }

}
