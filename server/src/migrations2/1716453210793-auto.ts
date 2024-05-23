import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716453210793 implements MigrationInterface {
    name = 'Auto1716453210793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "institute"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "health_group_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "state_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "institute_id" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-23T08:33:33.634Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6768eb95ff867bccf00797c7d32" FOREIGN KEY ("health_group_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e589d18ac4320f3f83fc7891421" FOREIGN KEY ("state_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d11afe6995bfdb198cb9ee0dde2" FOREIGN KEY ("institute_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d11afe6995bfdb198cb9ee0dde2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e589d18ac4320f3f83fc7891421"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6768eb95ff867bccf00797c7d32"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-20 20:16:19.099769'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-20 12:16:04.476'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "institute_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "state_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "health_group_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "institute" character varying`);
    }

}
