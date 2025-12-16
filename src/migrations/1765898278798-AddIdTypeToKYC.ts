import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdTypeToKYC1765898278798 implements MigrationInterface {
    name = 'AddIdTypeToKYC1765898278798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add idType column if it doesn't exist
        const idTypeExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idType'
        `);
        
        if (idTypeExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idType" character varying`);
        }

        // Add idNumber column if it doesn't exist (this is causing the current error)
        const idNumberExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idNumber'
        `);
        
        if (idNumberExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idNumber" character varying`);
        }

        // Add other ID-related columns if they don't exist
        const idFrontImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idFrontImage'
        `);
        
        if (idFrontImageExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idFrontImage" character varying`);
        }

        const idBackImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idBackImage'
        `);
        
        if (idBackImageExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idBackImage" character varying`);
        }

        const idExpiryDateExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idExpiryDate'
        `);
        
        if (idExpiryDateExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN "idExpiryDate" TIMESTAMP`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns if they exist
        const idExpiryDateExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idExpiryDate'
        `);
        if (idExpiryDateExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idExpiryDate"`);
        }

        const idBackImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idBackImage'
        `);
        if (idBackImageExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idBackImage"`);
        }

        const idFrontImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idFrontImage'
        `);
        if (idFrontImageExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idFrontImage"`);
        }

        const idNumberExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idNumber'
        `);
        if (idNumberExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idNumber"`);
        }

        const idTypeExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'kyc' AND column_name = 'idType'
        `);
        if (idTypeExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "idType"`);
        }
    }
}
