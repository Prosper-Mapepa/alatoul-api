import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1765830407453 implements MigrationInterface {
    name = 'InitialMigration1765830407453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "baseRatePerMile" SET DEFAULT '1.5'`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "baseRatePerMinute" SET DEFAULT '0.3'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "baseRatePerMinute" SET DEFAULT 0.3`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "baseRatePerMile" SET DEFAULT 1.5`);
    }

}
