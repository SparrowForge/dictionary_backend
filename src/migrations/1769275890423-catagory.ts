import { MigrationInterface, QueryRunner } from "typeorm";

export class Catagory1769275890423 implements MigrationInterface {
    name = 'Catagory1769275890423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_catagory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order_no" integer DEFAULT '0', "status" character varying NOT NULL DEFAULT 'active', "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_925204af0ad1b4b0d381d13d293" UNIQUE ("name"), CONSTRAINT "PK_2f0df23878d0d7f51fcdac0751e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_catagory" ADD CONSTRAINT "FK_af2e011e51ec89355ba3f0c2831" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_catagory" ADD CONSTRAINT "FK_6f3f7eaeb5a6c91ad63bb5f48f4" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_catagory" DROP CONSTRAINT "FK_6f3f7eaeb5a6c91ad63bb5f48f4"`);
        await queryRunner.query(`ALTER TABLE "dc_catagory" DROP CONSTRAINT "FK_af2e011e51ec89355ba3f0c2831"`);
        await queryRunner.query(`DROP TABLE "dc_catagory"`);
    }

}
