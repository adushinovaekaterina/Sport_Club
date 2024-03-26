import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1711460918422 implements MigrationInterface {
    name = 'Auto1711460918422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_visits" ADD "id_team" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-03-26T13:48:41.083Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "team_visits" ADD CONSTRAINT "FK_d789e17a6e74bf1a88eb9c3db21" FOREIGN KEY ("id_team") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_visits" DROP CONSTRAINT "FK_d789e17a6e74bf1a88eb9c3db21"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-03-20 15:18:18.54621'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-03-12 15:05:50.026'`);
        await queryRunner.query(`ALTER TABLE "team_visits" DROP COLUMN "id_team"`);
    }

}
