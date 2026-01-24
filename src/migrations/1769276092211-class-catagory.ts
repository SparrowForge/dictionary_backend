import { MigrationInterface, QueryRunner } from "typeorm";

export class ClassCatagory1769276092211 implements MigrationInterface {
    name = 'ClassCatagory1769276092211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_classess" ADD "catagory_id" uuid`);
        await queryRunner.query(`ALTER TABLE "dc_classess" ADD CONSTRAINT "FK_0a2a6a458d2e36e9a58af1ff095" FOREIGN KEY ("catagory_id") REFERENCES "dc_catagory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_classess" DROP CONSTRAINT "FK_0a2a6a458d2e36e9a58af1ff095"`);
        await queryRunner.query(`ALTER TABLE "dc_classess" DROP COLUMN "catagory_id"`);
    }

}
