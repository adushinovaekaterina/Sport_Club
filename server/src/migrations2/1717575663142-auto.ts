import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1717575663142 implements MigrationInterface {
    name = 'Auto1717575663142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "capacity" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-06-05T08:21:06.157Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-31 17:53:46.411938'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-31 09:53:25.116'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "capacity"`);
    }

}
