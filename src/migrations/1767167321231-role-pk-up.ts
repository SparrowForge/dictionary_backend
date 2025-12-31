import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePkUp1767167321231 implements MigrationInterface {
    name = 'RolePkUp1767167321231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_ad82a9ca8eb418126700d257a52"`);
        await queryRunner.query(`ALTER TABLE "dc_roles" DROP CONSTRAINT "PK_85693d497865ef8ea9d3d334439"`);
        await queryRunner.query(`ALTER TABLE "dc_roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "dc_roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "dc_roles" ADD CONSTRAINT "PK_85693d497865ef8ea9d3d334439" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "roleId" uuid`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_ad82a9ca8eb418126700d257a52" FOREIGN KEY ("roleId") REFERENCES "dc_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_ad82a9ca8eb418126700d257a52"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "roleId" integer`);
        await queryRunner.query(`ALTER TABLE "dc_roles" DROP CONSTRAINT "PK_85693d497865ef8ea9d3d334439"`);
        await queryRunner.query(`ALTER TABLE "dc_roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "dc_roles" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dc_roles" ADD CONSTRAINT "PK_85693d497865ef8ea9d3d334439" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_ad82a9ca8eb418126700d257a52" FOREIGN KEY ("roleId") REFERENCES "dc_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
