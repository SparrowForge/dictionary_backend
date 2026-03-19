import { MigrationInterface, QueryRunner } from "typeorm";

export class FileTypeString1773898848418 implements MigrationInterface {
    name = 'FileTypeString1773898848418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_files" DROP COLUMN "file_type"`);
        await queryRunner.query(`DROP TYPE "public"."dc_files_file_type_enum"`);
        await queryRunner.query(`ALTER TABLE "dc_files" ADD "file_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_files" DROP COLUMN "file_type"`);
        await queryRunner.query(`CREATE TYPE "public"."dc_files_file_type_enum" AS ENUM('audio', 'document', 'other', 'photo', 'receipt', 'video')`);
        await queryRunner.query(`ALTER TABLE "dc_files" ADD "file_type" "public"."dc_files_file_type_enum" NOT NULL DEFAULT 'other'`);
    }

}
