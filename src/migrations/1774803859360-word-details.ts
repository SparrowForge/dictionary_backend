import { MigrationInterface, QueryRunner } from "typeorm";

export class WordDetails1774803859360 implements MigrationInterface {
    name = 'WordDetails1774803859360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" DROP CONSTRAINT "FK_dad7478339157bc6319406ecafc"`);
        await queryRunner.query(`CREATE TABLE "dc_word_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word_id" uuid NOT NULL, "class_id" uuid NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_19a7aa38a0cf1707cc9ba7cffc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_words" DROP COLUMN "class_id"`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" ADD CONSTRAINT "FK_fb06030078140553142677105c0" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" ADD CONSTRAINT "FK_879256f44fd5f00cbdf84e7c2f7" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" ADD CONSTRAINT "FK_20c8c5361f25970caab4a5fe6f6" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" ADD CONSTRAINT "FK_821f102bc62382c9e083bffdeef" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_details" DROP CONSTRAINT "FK_821f102bc62382c9e083bffdeef"`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" DROP CONSTRAINT "FK_20c8c5361f25970caab4a5fe6f6"`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" DROP CONSTRAINT "FK_879256f44fd5f00cbdf84e7c2f7"`);
        await queryRunner.query(`ALTER TABLE "dc_word_details" DROP CONSTRAINT "FK_fb06030078140553142677105c0"`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD "class_id" uuid`);
        await queryRunner.query(`DROP TABLE "dc_word_details"`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD CONSTRAINT "FK_dad7478339157bc6319406ecafc" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
