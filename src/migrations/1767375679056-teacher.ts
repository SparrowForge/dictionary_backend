import { MigrationInterface, QueryRunner } from "typeorm";

export class Teacher1767375679056 implements MigrationInterface {
    name = 'Teacher1767375679056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "designation" character varying, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b2658155188e81d7c3db17d8081" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_users" DROP CONSTRAINT "UQ_d444e192865dd0d18d37bf6ed85"`);
        await queryRunner.query(`ALTER TABLE "dc_teachers" ADD CONSTRAINT "FK_e2c501d16ca7e1b02814602ef76" FOREIGN KEY ("user_id") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_teachers" ADD CONSTRAINT "FK_36442e66a4a81b737f5a395e6ff" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_teachers" ADD CONSTRAINT "FK_ba0bbb1096119d21574e0759a17" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_teachers" DROP CONSTRAINT "FK_ba0bbb1096119d21574e0759a17"`);
        await queryRunner.query(`ALTER TABLE "dc_teachers" DROP CONSTRAINT "FK_36442e66a4a81b737f5a395e6ff"`);
        await queryRunner.query(`ALTER TABLE "dc_teachers" DROP CONSTRAINT "FK_e2c501d16ca7e1b02814602ef76"`);
        await queryRunner.query(`ALTER TABLE "dc_users" ADD CONSTRAINT "UQ_d444e192865dd0d18d37bf6ed85" UNIQUE ("name")`);
        await queryRunner.query(`DROP TABLE "dc_teachers"`);
    }

}
