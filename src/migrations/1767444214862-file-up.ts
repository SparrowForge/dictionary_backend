import { MigrationInterface, QueryRunner } from "typeorm";

export class FileUp1767444214862 implements MigrationInterface {
    name = 'FileUp1767444214862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_files" DROP CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274"`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "uploaded_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dc_files" ADD CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274" FOREIGN KEY ("uploaded_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_files" DROP CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274"`);
        await queryRunner.query(`ALTER TABLE "dc_files" ALTER COLUMN "uploaded_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dc_files" ADD CONSTRAINT "FK_9e4ba6383e7353ed170dbb48274" FOREIGN KEY ("uploaded_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
