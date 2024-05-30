import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1717041631128 implements MigrationInterface {
    name = 'Auto1717041631128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" DROP CONSTRAINT "FK_d2321248ef3678a824334c6619d"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-30T04:00:34.326Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ADD CONSTRAINT "FK_d2321248ef3678a824334c6619d" FOREIGN KEY ("id_team_schedule") REFERENCES "team_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cabinets_time" DROP CONSTRAINT "FK_d2321248ef3678a824334c6619d"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-29 16:32:13.299675'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-29 08:31:09.868'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ADD CONSTRAINT "FK_d2321248ef3678a824334c6619d" FOREIGN KEY ("id_team_schedule") REFERENCES "team_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
