import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingVehicleColumns1765901487146 implements MigrationInterface {
    name = 'AddMissingVehicleColumns1765901487146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add capacity column if it doesn't exist
        const capacityExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'capacity'
        `);
        
        if (capacityExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" ADD COLUMN "capacity" integer`);
        }

        // Add registrationImage column if it doesn't exist
        const registrationImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'registrationImage'
        `);
        
        if (registrationImageExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" ADD COLUMN "registrationImage" character varying`);
        }

        // Add insuranceImage column if it doesn't exist
        const insuranceImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'insuranceImage'
        `);
        
        if (insuranceImageExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" ADD COLUMN "insuranceImage" character varying`);
        }

        // Add insuranceExpiry column if it doesn't exist
        const insuranceExpiryExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'insuranceExpiry'
        `);
        
        if (insuranceExpiryExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" ADD COLUMN "insuranceExpiry" TIMESTAMP`);
        }

        // Add isActive column if it doesn't exist
        const isActiveExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'isActive'
        `);
        
        if (isActiveExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" ADD COLUMN "isActive" boolean NOT NULL DEFAULT true`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns if they exist
        const isActiveExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'isActive'
        `);
        if (isActiveExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "isActive"`);
        }

        const insuranceExpiryExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'insuranceExpiry'
        `);
        if (insuranceExpiryExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "insuranceExpiry"`);
        }

        const insuranceImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'insuranceImage'
        `);
        if (insuranceImageExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "insuranceImage"`);
        }

        const registrationImageExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'registrationImage'
        `);
        if (registrationImageExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "registrationImage"`);
        }

        const capacityExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = 'capacity'
        `);
        if (capacityExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "capacity"`);
        }
    }
}
