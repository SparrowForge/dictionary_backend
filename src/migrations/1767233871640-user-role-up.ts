import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleUp1767233871640 implements MigrationInterface {
    name = 'UserRoleUp1767233871640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "FK_ad82a9ca8eb418126700d257a52"`);
        await queryRunner.query(`ALTER TABLE "dc_users" RENAME COLUMN "roleId" TO "role"`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."dc_users_role_enum" AS ENUM('ADMIN', 'TEACHER', 'STUDENT')`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "role" "public"."dc_users_role_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."dc_users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD "role" uuid`);
        await queryRunner.query(`ALTER TABLE "dc_users" RENAME COLUMN "role" TO "roleId"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "FK_ad82a9ca8eb418126700d257a52" FOREIGN KEY ("roleId") REFERENCES "dc_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
