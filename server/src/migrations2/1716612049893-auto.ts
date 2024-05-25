import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716612049893 implements MigrationInterface {
    name = 'Auto1716612049893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-25T04:40:52.597Z"'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthdate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "standard_user" DROP COLUMN "semester"`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD "semester" double precision NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "standard_user" DROP COLUMN "semester"`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD "semester" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-23 16:35:00.265486'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthdate" date`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-23 08:33:33.634'`);
    }

}
