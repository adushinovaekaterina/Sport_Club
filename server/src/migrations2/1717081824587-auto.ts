import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1717081824587 implements MigrationInterface {
    name = 'Auto1717081824587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "max_visits"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-30T15:10:28.137Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-30 21:40:26.185321'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-30 13:40:01.614'`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "max_visits" integer`);
    }

}
