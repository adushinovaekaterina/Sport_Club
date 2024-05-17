import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1715926989021 implements MigrationInterface {
    name = 'Auto1715926989021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "standard_user" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "date_create" TIMESTAMP NOT NULL DEFAULT now(), "standard_name_id" integer, "user_id" integer, CONSTRAINT "PK_8bb65a74d7e1b905ce98c637f08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-17T06:23:11.445Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD CONSTRAINT "FK_20c9bb1fc450dca46375b1013c2" FOREIGN KEY ("standard_name_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "standard_user" ADD CONSTRAINT "FK_63f6e1d455394a1dc53468ff401" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "standard_user" DROP CONSTRAINT "FK_63f6e1d455394a1dc53468ff401"`);
        await queryRunner.query(`ALTER TABLE "standard_user" DROP CONSTRAINT "FK_20c9bb1fc450dca46375b1013c2"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-17 14:20:53.33115'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-17 06:20:39.394'`);
        await queryRunner.query(`DROP TABLE "standard_user"`);
    }

}
