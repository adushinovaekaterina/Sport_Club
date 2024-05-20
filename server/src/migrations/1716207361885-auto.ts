import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716207361885 implements MigrationInterface {
    name = 'Auto1716207361885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "standard_user" ADD "semester" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD "team_id" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-20T12:16:04.476Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD CONSTRAINT "FK_cd49b89c1d978c5fe6b72986405" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "standard_user" DROP CONSTRAINT "FK_cd49b89c1d978c5fe6b72986405"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-17 16:16:09.010528'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-17 08:14:27.195'`);
        await queryRunner.query(`ALTER TABLE "standard_user" DROP COLUMN "team_id"`);
        await queryRunner.query(`ALTER TABLE "standard_user" DROP COLUMN "semester"`);
    }

}
