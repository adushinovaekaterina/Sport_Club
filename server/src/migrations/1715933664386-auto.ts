import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1715933664386 implements MigrationInterface {
    name = 'Auto1715933664386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "is_set_open"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-17T08:14:27.195Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-17 16:13:52.095845'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-17 08:07:06.155'`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "is_set_open" boolean NOT NULL DEFAULT false`);
    }

}
