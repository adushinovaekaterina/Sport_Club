import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716736531930 implements MigrationInterface {
    name = 'Auto1716736531930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "semester" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "date_start" TIMESTAMP NOT NULL DEFAULT now(), "date_end" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9129c1fd35aa4aded7a9825b38d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "id_semester" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-26T15:15:34.855Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_6f568ce2a074851be525235324e" FOREIGN KEY ("id_semester") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_6f568ce2a074851be525235324e"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-26 11:24:19.885333'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-26 03:23:25.825'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "id_semester"`);
        await queryRunner.query(`DROP TABLE "semester"`);
    }

}
