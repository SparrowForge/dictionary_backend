import { MigrationInterface, QueryRunner } from "typeorm";

export class WordFormTypeEnum1784719719580 implements MigrationInterface {
    name = 'WordFormTypeEnum1784719719580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_word_forms_form_type_enum" AS ENUM('base_form', 'past_tense', 'past_participle', 'present_participle', 'third_person_singular')`);
        await queryRunner.query(`ALTER TABLE "dc_word_forms" ALTER COLUMN "form_type" TYPE "public"."dc_word_forms_form_type_enum" USING "form_type"::"public"."dc_word_forms_form_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_word_forms" ALTER COLUMN "form_type" TYPE character varying USING "form_type"::character varying`);
        await queryRunner.query(`DROP TYPE "public"."dc_word_forms_form_type_enum"`);
    }

}
