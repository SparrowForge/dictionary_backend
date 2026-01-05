import { MigrationInterface, QueryRunner } from "typeorm";

export class WordMedia1767611585173 implements MigrationInterface {
    name = 'WordMedia1767611585173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_word_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "audio_id" integer, "image_id" integer, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c791d3c18fb0fba3c31d215fc1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" ADD CONSTRAINT "FK_d2844878093fe9a912035e831b8" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" ADD CONSTRAINT "FK_5b4a42e22514e5eb76f3c5e5f7f" FOREIGN KEY ("audio_id") REFERENCES "dc_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" ADD CONSTRAINT "FK_efbc528d7fe66e3c9238fdef23a" FOREIGN KEY ("image_id") REFERENCES "dc_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" ADD CONSTRAINT "FK_8e20070c8d6258c46e1d632a193" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" ADD CONSTRAINT "FK_7cc9088d8d1386dd7592b4026ca" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_media" DROP CONSTRAINT "FK_7cc9088d8d1386dd7592b4026ca"`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" DROP CONSTRAINT "FK_8e20070c8d6258c46e1d632a193"`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" DROP CONSTRAINT "FK_efbc528d7fe66e3c9238fdef23a"`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" DROP CONSTRAINT "FK_5b4a42e22514e5eb76f3c5e5f7f"`);
        await queryRunner.query(`ALTER TABLE "dc_word_media" DROP CONSTRAINT "FK_d2844878093fe9a912035e831b8"`);
        await queryRunner.query(`DROP TABLE "dc_word_media"`);
    }

}
