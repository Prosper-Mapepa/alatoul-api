import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdTypeToKYC1765898278798 implements MigrationInterface {
    name = 'AddIdTypeToKYC1765898278798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if idType column exists before adding it
        const columnExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idType'
        `);
        
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idType" character varying`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if idType column exists before dropping it
        const columnExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idType'
        `);
        
        if (columnExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idType"`);
        }
    }
}
