import { MigrationInterface, QueryRunner } from "typeorm";

export class FilePublicUrl1773468043676 implements MigrationInterface {
    name = 'FilePublicUrl1773468043676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_files" ADD "public_url" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."dc_files_file_type_enum" RENAME TO "dc_files_file_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."dc_files_file_type_enum" AS ENUM('document', 'receipt', 'photo', 'video', 'audio', 'other')`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" TYPE "public"."dc_files_file_type_enum" USING "file_type"::"text"::"public"."dc_files_file_type_enum"`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."dc_files_file_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_files_file_type_enum_old" AS ENUM('document', 'other', 'photo', 'receipt', 'video')`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" TYPE "public"."dc_files_file_type_enum_old" USING "file_type"::"text"::"public"."dc_files_file_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "file_type" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."dc_files_file_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."dc_files_file_type_enum_old" RENAME TO "dc_files_file_type_enum"`);
        await queryRunner.query(`ALTER TABLE "dc_files" DROP COLUMN "public_url"`);
    }

}
