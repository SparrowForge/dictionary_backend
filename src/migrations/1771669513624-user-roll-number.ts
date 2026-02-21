import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRollNumber1771669513624 implements MigrationInterface {
    name = 'UserRollNumber1771669513624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578"`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578" FOREIGN KEY ("student_id") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578"`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578" FOREIGN KEY ("student_id") REFERENCES "dc_students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
