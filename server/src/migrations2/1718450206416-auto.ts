import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1718450206416 implements MigrationInterface {
    name = 'Auto1718450206416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "health_group_id" integer`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-06-15T11:16:49.065Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_238564700b5da7ee00df0a773cd" FOREIGN KEY ("health_group_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_238564700b5da7ee00df0a773cd"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-06-05 16:21:27.843252'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-06-05 08:21:06.157'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "health_group_id"`);
    }

}
