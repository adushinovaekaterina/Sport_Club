import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1715871974216 implements MigrationInterface {
    name = 'Auto1715871974216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "competition" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "sport_type" character varying NOT NULL, "city" character varying NOT NULL, "date_start" TIMESTAMP NOT NULL, "date_end" TIMESTAMP NOT NULL, "level_id" integer, CONSTRAINT "PK_a52a6248db574777b226e9445bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_competition" ("id" SERIAL NOT NULL, "result" character varying NOT NULL, "result_type" character varying NOT NULL, "user_id" integer, "competition_id" integer, CONSTRAINT "PK_61894501e631e83c0ae953eddd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '"2024-05-16T15:06:17.278Z"'`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "competition" ADD CONSTRAINT "FK_777ee169487d497815d85a7825f" FOREIGN KEY ("level_id") REFERENCES "dictionary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_competition" ADD CONSTRAINT "FK_abefd082e772d6b13776cdbb862" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_competition" ADD CONSTRAINT "FK_fb3004862e4fb1a1886e9319988" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_competition" DROP CONSTRAINT "FK_fb3004862e4fb1a1886e9319988"`);
        await queryRunner.query(`ALTER TABLE "user_competition" DROP CONSTRAINT "FK_abefd082e772d6b13776cdbb862"`);
        await queryRunner.query(`ALTER TABLE "competition" DROP CONSTRAINT "FK_777ee169487d497815d85a7825f"`);
        await queryRunner.query(`ALTER TABLE "cabinets_time" ALTER COLUMN "date" SET DEFAULT '2024-05-16 22:59:58.538542'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date_update" SET DEFAULT '2024-05-16 14:59:35.123'`);
        await queryRunner.query(`DROP TABLE "user_competition"`);
        await queryRunner.query(`DROP TABLE "competition"`);
    }

}
