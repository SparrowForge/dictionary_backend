import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUp1770358179801 implements MigrationInterface {
    name = 'UserUp1770358179801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "image_file_id" integer`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "class_id" uuid`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "section" character varying`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_96964ce565693c438e74139068e" FOREIGN KEY ("image_file_id") REFERENCES "dc_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_b197a3e610050911fb1f27c6e58" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_b197a3e610050911fb1f27c6e58"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_96964ce565693c438e74139068e"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "section"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "class_id"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "image_file_id"`);
    }

}
