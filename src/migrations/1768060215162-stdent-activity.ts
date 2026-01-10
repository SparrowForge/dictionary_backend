import { MigrationInterface, QueryRunner } from "typeorm";

export class StdentActivity1768060215162 implements MigrationInterface {
    name = 'StdentActivity1768060215162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dc_student_activity_action_enum" AS ENUM('Read', 'Create', 'Update', 'Delete')`);
        await queryRunner.query(`CREATE TABLE "dc_student_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid, "word_id" uuid, "action" "public"."dc_student_activity_action_enum", "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2bde49cb45f914500f0b5386b7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" ADD CONSTRAINT "FK_a2fa65120d0f40145e200139678" FOREIGN KEY ("student_id") REFERENCES "dc_students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" ADD CONSTRAINT "FK_cae76cbe0e4d7939c70e45f375d" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" ADD CONSTRAINT "FK_f6aa92636eb0b135efff25c1d42" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" ADD CONSTRAINT "FK_1b73bc129397d3350f05968a550" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_student_activity" DROP CONSTRAINT "FK_1b73bc129397d3350f05968a550"`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" DROP CONSTRAINT "FK_f6aa92636eb0b135efff25c1d42"`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" DROP CONSTRAINT "FK_cae76cbe0e4d7939c70e45f375d"`);
        await queryRunner.query(`ALTER TABLE "dc_student_activity" DROP CONSTRAINT "FK_a2fa65120d0f40145e200139678"`);
        await queryRunner.query(`DROP TABLE "dc_student_activity"`);
        await queryRunner.query(`DROP TYPE "public"."dc_student_activity_action_enum"`);
    }

}
