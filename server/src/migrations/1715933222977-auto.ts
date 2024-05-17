import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1715933222977 implements MigrationInterface {
    name = 'Auto1715933222977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "is_national" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "is_set_open" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-17T08:07:06.155Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-17 14:23:38.052578'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-17 06:23:11.445'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "is_set_open"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "is_national"`);
    }

}
