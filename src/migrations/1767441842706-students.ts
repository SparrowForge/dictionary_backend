import { MigrationInterface, QueryRunner } from "typeorm";

export class Students1767441842706 implements MigrationInterface {
    name = 'Students1767441842706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_files_file_type_enum" AS ENUM('document', 'receipt', 'photo', 'video', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."dc_files_file_category_enum" AS ENUM('personal', 'financial', 'medical', 'administrative', 'other')`);
        await queryRunner.query(`CREATE TABLE "dc_files" ("id" SERIAL NOT NULL, "file_name" character varying(255) NOT NULL, "original_name" character varying(255) NOT NULL, "file_path" character varying(500) NOT NULL, "file_size" bigint NOT NULL, "mime_type" character varying(100) NOT NULL, "file_type" "public"."dc_files_file_type_enum" NOT NULL DEFAULT 'other', "file_category" "public"."dc_files_file_category_enum" NOT NULL DEFAULT 'other', "uploaded_by" uuid NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f492d1cf98807ed2f0521598cd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "student_id" character varying, "class_id" uuid, "profile_image_id" integer, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_7376b6d8ee92c9e0b8820b7eb2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dc_file_references" ("id" SERIAL NOT NULL, "file_id" integer NOT NULL, "resource" character varying(50) NOT NULL, "resource_id" integer NOT NULL, "reference_type" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d702c9a777864f2861f568ef8f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_files" ADD CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274" FOREIGN KEY ("uploaded_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_students" ADD CONSTRAINT "FK_ebba1d2250318251fc069b505c1" FOREIGN KEY ("user_id") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_students" ADD CONSTRAINT "FK_21982ea9d2cd72b6b593b9a088d" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_students" ADD CONSTRAINT "FK_7b19522b960e46e0c4e1cc09fec" FOREIGN KEY ("profile_image_id") REFERENCES "dc_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_students" ADD CONSTRAINT "FK_3f25b2c4a30b54a9c58d962562d" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_students" ADD CONSTRAINT "FK_2bd2f6b721cf7d82faffa59630a" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_file_references" ADD CONSTRAINT "FK_4b6fcf6277f1b91cc2c12949023" FOREIGN KEY ("file_id") REFERENCES "dc_files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_file_references" DROP CONSTRAINT "FK_4b6fcf6277f1b91cc2c12949023"`);
        await queryRunner.query(`ALTER TABLE "dc_students" DROP CONSTRAINT "FK_2bd2f6b721cf7d82faffa59630a"`);
        await queryRunner.query(`ALTER TABLE "dc_students" DROP CONSTRAINT "FK_3f25b2c4a30b54a9c58d962562d"`);
        await queryRunner.query(`ALTER TABLE "dc_students" DROP CONSTRAINT "FK_7b19522b960e46e0c4e1cc09fec"`);
        await queryRunner.query(`ALTER TABLE "dc_students" DROP CONSTRAINT "FK_21982ea9d2cd72b6b593b9a088d"`);
        await queryRunner.query(`ALTER TABLE "dc_students" DROP CONSTRAINT "FK_ebba1d2250318251fc069b505c1"`);
        await queryRunner.query(`ALTER TABLE "dc_files" DROP CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274"`);
        await queryRunner.query(`DROP TABLE "dc_file_references"`);
        await queryRunner.query(`DROP TABLE "dc_students"`);
        await queryRunner.query(`DROP TABLE "dc_files"`);
        await queryRunner.query(`DROP TYPE "public"."dc_files_file_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."dc_files_file_type_enum"`);
    }

}
