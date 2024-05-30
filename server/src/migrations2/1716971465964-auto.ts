import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716971465964 implements MigrationInterface {
    name = 'Auto1716971465964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_schedule" ADD "id_semester" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-29T08:31:09.868Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "team_schedule" ADD CONSTRAINT "FK_62ef450eb4e0c647eb2aacb8136" FOREIGN KEY ("id_semester") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_schedule" DROP CONSTRAINT "FK_62ef450eb4e0c647eb2aacb8136"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-26 23:15:44.95399'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-26 15:15:34.855'`);
        await queryRunner.query(`ALTER TABLE "team_schedule" DROP COLUMN "id_semester"`);
    }

}
