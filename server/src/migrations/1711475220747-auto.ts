import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1711475220747 implements MigrationInterface {
    name = 'Auto1711475220747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "max_visits" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-03-26T17:47:03.157Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-03-26 21:48:57.119509'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-03-26 13:48:41.083'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "max_visits"`);
    }

}
