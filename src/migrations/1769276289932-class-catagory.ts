import { MigrationInterface, QueryRunner } from "typeorm";

export class ClassCatagory1769276289932 implements MigrationInterface {
    name = 'ClassCatagory1769276289932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" ADD "class_id" uuid`);
        await queryRunner.query(`ALTER TABLE "dc_words" ADD CONSTRAINT "FK_dad7478339157bc6319406ecafc" FOREIGN KEY ("class_id") REFERENCES "dc_classess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_words" DROP CONSTRAINT "FK_dad7478339157bc6319406ecafc"`);
        await queryRunner.query(`ALTER TABLE "dc_words" DROP COLUMN "class_id"`);
    }

}
