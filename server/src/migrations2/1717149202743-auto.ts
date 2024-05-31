import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1717149202743 implements MigrationInterface {
    name = 'Auto1717149202743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_723091d08c3c5415a1999597464"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "team_visits" ADD "id_semester" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-31T09:53:25.116Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "team_visits" ADD CONSTRAINT "FK_e99d203b56d3e96eafe15a2fa66" FOREIGN KEY ("id_semester") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_visits" DROP CONSTRAINT "FK_e99d203b56d3e96eafe15a2fa66"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-30 23:10:54.113064'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-30 15:10:28.137'`);
        await queryRunner.query(`ALTER TABLE "team_visits" DROP COLUMN "id_semester"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "status_id" integer`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_723091d08c3c5415a1999597464" FOREIGN KEY ("status_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
