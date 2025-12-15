# Reset Migration to Fix Database Schema

Since the migration has already run but created incorrect columns, you need to reset it:

## Option 1: Delete Migration Record and Re-run (Recommended)

1. **Go to Railway → PostgreSQL Service → Database → Data tab**
2. **Click "Connect" to open database console**
3. **Delete the migration record:**
   ```sql
   DELETE FROM migrations WHERE name = 'InitialMigration1765830407453';
   ```
4. **Drop and recreate tables (if needed):**
   ```sql
   -- Drop all tables (be careful - this deletes all data!)
   DROP TABLE IF EXISTS notifications CASCADE;
   DROP TABLE IF EXISTS messages CASCADE;
   DROP TABLE IF EXISTS kyc CASCADE;
   DROP TABLE IF EXISTS ratings CASCADE;
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS rides CASCADE;
   DROP TABLE IF EXISTS vehicles CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP TABLE IF EXISTS settings CASCADE;
   ```
5. **Redeploy backend** - Migration will run again with correct schema

## Option 2: Create a New Migration to Fix Columns

If you want to keep existing data, create a new migration to alter the tables:

1. The backend will automatically create a new migration
2. Or manually add columns using SQL:
   ```sql
   -- Fix notifications table
   ALTER TABLE notifications RENAME COLUMN "read" TO "isRead";
   ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "link" character varying;
   ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "metadata" jsonb;
   ALTER TABLE notifications ALTER COLUMN "relatedId" TYPE character varying;

   -- Fix messages table
   ALTER TABLE messages RENAME COLUMN "read" TO "isRead";
   ALTER TABLE messages ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP;

   -- Fix KYC table - add missing columns
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
   ```

## Option 3: Use DB_SYNCHRONIZE (Quick Fix for Development)

1. **Go to Railway → Backend Service → Settings → Variables**
2. **Add/Update:** `DB_SYNCHRONIZE=true`
3. **Redeploy backend**
4. **After tables are fixed, set:** `DB_SYNCHRONIZE=false`

## Verify Fix

After applying the fix, check that:
- ✅ `notifications.isRead` column exists (not `read`)
- ✅ `notifications.link` column exists
- ✅ `notifications.metadata` column exists
- ✅ `messages.isRead` column exists (not `read`)
- ✅ `messages.readAt` column exists
- ✅ `kyc.idType` column exists
- ✅ All other KYC columns exist
