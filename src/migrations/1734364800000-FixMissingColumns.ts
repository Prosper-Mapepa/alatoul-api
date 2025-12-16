import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMissingColumns1734364800000 implements MigrationInterface {
    name = 'FixMissingColumns1734364800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix notifications table - rename 'read' to 'isRead' if it exists
        const notificationsTable = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'notifications' AND column_name = 'read'
        `);
        
        if (notificationsTable.length > 0) {
            await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "read" TO "isRead"`);
        }
        
        // Add missing columns to notifications table
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "link" character varying`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "relatedId" TYPE character varying USING "relatedId"::text`);

        // Fix messages table - rename 'read' to 'isRead' if it exists
        const messagesTable = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'read'
        `);
        
        if (messagesTable.length > 0) {
            await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "read" TO "isRead"`);
        }
        
        // Add missing readAt column to messages
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP`);

        // Add missing columns to KYC table
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "idType" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "idNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "idFrontImage" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "idBackImage" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "idExpiryDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "licenseNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "licenseImage" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "licenseExpiryDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "licenseIssuedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "vehicleMake" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "vehicleModel" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "vehicleYear" integer`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "vehiclePlateNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "vehicleRegistrationImage" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "bankName" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "accountNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "accountHolderName" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "mobileMoneyNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD COLUMN IF NOT EXISTS "mobileMoneyProvider" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove added columns from KYC
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "mobileMoneyProvider"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "mobileMoneyNumber"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "accountHolderName"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "bankName"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "vehicleRegistrationImage"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "vehiclePlateNumber"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "vehicleYear"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "vehicleModel"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "vehicleMake"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "licenseIssuedDate"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "licenseExpiryDate"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "licenseImage"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "licenseNumber"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "idExpiryDate"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "idBackImage"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "idFrontImage"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "idNumber"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN IF EXISTS "idType"`);

        // Remove readAt from messages
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "readAt"`);
        
        // Revert messages column name (if needed)
        const messagesIsRead = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'isRead'
        `);
        if (messagesIsRead.length > 0) {
            await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "isRead" TO "read"`);
        }

        // Remove columns from notifications
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "metadata"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link"`);
        
        // Revert notifications column name (if needed)
        const notificationsIsRead = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'notifications' AND column_name = 'isRead'
        `);
        if (notificationsIsRead.length > 0) {
            await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "isRead" TO "read"`);
        }
    }
}
