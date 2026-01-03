import { MigrationInterface, QueryRunner } from "typeorm";

export class Classes1767414737034 implements MigrationInterface {
    name = 'Classes1767414737034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_classess" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order_no" integer DEFAULT '0', "status" character varying NOT NULL DEFAULT 'active', "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_daac4a3d36cb72fd22a181c1c25" UNIQUE ("name"), CONSTRAINT "PK_37c4c1ecf2bddad3b58221c5312" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_classess" ADD CONSTRAINT "FK_4c9339443ef1df27eae316ca08c" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_classess" ADD CONSTRAINT "FK_4059b17ec2740e16ec3e851543e" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_classess" DROP CONSTRAINT "FK_4059b17ec2740e16ec3e851543e"`);
        await queryRunner.query(`ALTER TABLE "dc_classess" DROP CONSTRAINT "FK_4c9339443ef1df27eae316ca08c"`);
        await queryRunner.query(`DROP TABLE "dc_classess"`);
    }
}
