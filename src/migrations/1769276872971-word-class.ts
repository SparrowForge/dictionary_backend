/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from "typeorm";

export class WordClass1769276872971 implements MigrationInterface {
    name = 'WordClass1769276872971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // This migration is a no-op as the foreign key constraint was already added
        // in ClassCatagory1769276289932 migration
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No-op
    }

}
