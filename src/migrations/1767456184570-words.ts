import { MigrationInterface, QueryRunner } from "typeorm";

export class Words1767456184570 implements MigrationInterface {
    name = 'Words1767456184570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_words_status_enum" AS ENUM('APPROVED', 'PENDING', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "dc_words" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "english_word" character varying NOT NULL, "bangla_word" character varying NOT NULL, "part_of_speech" character varying, "description" character varying, "status" "public"."dc_words_status_enum" NOT NULL DEFAULT 'PENDING', "approved_by_user_id" uuid, "approved_at" TIMESTAMP DEFAULT now(), "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_f0991768bd0f7bc4921dc037e35" UNIQUE ("english_word"), CONSTRAINT "PK_30b9e4936fca4b35ab757d8d9fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD CONSTRAINT "FK_0e7c98e928348adced36ec8928c" FOREIGN KEY ("approved_by_user_id") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD CONSTRAINT "FK_f315eafeaa0b036eb6d05519855" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD CONSTRAINT "FK_2f203e012159271454f7f2181b7" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" DROP CONSTRAINT "FK_2f203e012159271454f7f2181b7"`);
        await queryRunner.query(`ALTER TABLE "dc_words" DROP CONSTRAINT "FK_f315eafeaa0b036eb6d05519855"`);
        await queryRunner.query(`ALTER TABLE "dc_words" DROP CONSTRAINT "FK_0e7c98e928348adced36ec8928c"`);
        await queryRunner.query(`DROP TABLE "dc_words"`);
        await queryRunner.query(`DROP TYPE "public"."dc_words_status_enum"`);
    }

}
