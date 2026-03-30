import { MigrationInterface, QueryRunner } from "typeorm";

export class WordView1774846774475 implements MigrationInterface {
    name = 'WordView1774846774475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "word_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_62b15f485af5a3af1ac53ce0e02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dc_word_views_user_word_unique" ON "dc_word_views" ("user_id", "word_id") `);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD "view_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "dc_word_views" ADD CONSTRAINT "FK_fc47ad5535f5ac34e9b7d60c13a" FOREIGN KEY ("user_id") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_views" ADD CONSTRAINT "FK_c9a5fd2ec46c14cf4529cad5bf8" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_views" DROP CONSTRAINT "FK_c9a5fd2ec46c14cf4529cad5bf8"`);
        await queryRunner.query(`ALTER TABLE "dc_word_views" DROP CONSTRAINT "FK_fc47ad5535f5ac34e9b7d60c13a"`);
        await queryRunner.query(`ALTER TABLE "dc_words" DROP COLUMN "view_count"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc_word_views_user_word_unique"`);
        await queryRunner.query(`DROP TABLE "dc_word_views"`);
    }

}
