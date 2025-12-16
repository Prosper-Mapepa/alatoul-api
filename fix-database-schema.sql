-- Fix Database Schema for Alatoul Backend
-- Run this in Railway PostgreSQL Database Console

-- Fix notifications table
ALTER TABLE notifications RENAME COLUMN "read" TO "isRead";
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "link" character varying;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "metadata" jsonb;
ALTER TABLE notifications ALTER COLUMN "relatedId" TYPE character varying;

-- Fix messages table
ALTER TABLE messages RENAME COLUMN "read" TO "isRead";
ALTER TABLE messages ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP;

-- Fix KYC table - add all missing columns
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "idType" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "idNumber" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "idFrontImage" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "idBackImage" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "idExpiryDate" TIMESTAMP;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "licenseNumber" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "licenseImage" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "licenseExpiryDate" TIMESTAMP;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "licenseIssuedDate" TIMESTAMP;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "vehicleMake" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "vehicleModel" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "vehicleYear" integer;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "vehiclePlateNumber" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "vehicleRegistrationImage" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "bankName" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "accountNumber" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "accountHolderName" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "mobileMoneyNumber" character varying;
ALTER TABLE kyc ADD COLUMN IF NOT EXISTS "mobileMoneyProvider" character varying;

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'kyc' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;
