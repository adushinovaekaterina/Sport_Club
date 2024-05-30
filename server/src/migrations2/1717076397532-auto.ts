import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1717076397532 implements MigrationInterface {
    name = 'Auto1717076397532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team_semester_visits" ("id" SERIAL NOT NULL, "max_visits" integer NOT NULL DEFAULT '0', "id_team" integer, "id_semester" integer, CONSTRAINT "PK_0a8a9835af7038be484c2788dcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-30T13:40:01.614Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "team_semester_visits" ADD CONSTRAINT "FK_666c989d613d078b30dfdd5b6a7" FOREIGN KEY ("id_team") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_semester_visits" ADD CONSTRAINT "FK_2da69f360c0f723c3692572836c" FOREIGN KEY ("id_semester") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_semester_visits" DROP CONSTRAINT "FK_2da69f360c0f723c3692572836c"`);
        await queryRunner.query(`ALTER TABLE "team_semester_visits" DROP CONSTRAINT "FK_666c989d613d078b30dfdd5b6a7"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-30 12:00:44.345138'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-30 04:00:34.326'`);
        await queryRunner.query(`DROP TABLE "team_semester_visits"`);
    }

}
