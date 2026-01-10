import { MigrationInterface, QueryRunner } from "typeorm";

export class FavWords1768057263640 implements MigrationInterface {
    name = 'FavWords1768057263640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dc_favourite_words" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "word_id" uuid NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_acbcdb5da403f42889f9eef0f47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578" FOREIGN KEY ("student_id") REFERENCES "dc_students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_5edfd2114ee3cdddd184f203ef1" FOREIGN KEY ("word_id") REFERENCES "dc_words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_6078273e259f52c7e5a96d91bad" FOREIGN KEY ("created_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" ADD CONSTRAINT "FK_606f3d6125d7f4a17b67623e6c7" FOREIGN KEY ("updated_by") REFERENCES "dc_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_606f3d6125d7f4a17b67623e6c7"`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_6078273e259f52c7e5a96d91bad"`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_5edfd2114ee3cdddd184f203ef1"`);
        await queryRunner.query(`ALTER TABLE "dc_favourite_words" DROP CONSTRAINT "FK_3b7e0a47f2c20c9062d0aaa5578"`);
        await queryRunner.query(`DROP TABLE "dc_favourite_words"`);
    }

}
