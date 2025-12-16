# Fix Database Columns - Quick Guide

## Problem
The database is missing columns that the application expects:
- `KYC.idType` does not exist
- `notifications.isRead` (currently named `read`)
- `messages.isRead` (currently named `read`)
- And many other KYC columns

## Solution: Run SQL Script

### Step 1: Access Railway Database Console

1. Go to **Railway Dashboard**
2. Click on your **PostgreSQL** service
3. Go to **Database** tab → **Data** sub-tab
4. Click **"Connect"** button (top right)
5. This opens the database console

### Step 2: Run the Fix Script

1. Copy the entire contents of `fix-database-columns.sql`
2. Paste it into the Railway database console
3. Click **"Run"** or press Enter
4. Wait for all commands to execute

### Step 3: Verify

After running the script, you can verify the columns exist:

```sql
-- Check KYC columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'kyc' 
ORDER BY column_name;

-- Check notifications columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY column_name;

-- Check messages columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY column_name;
```

### Step 4: Test

1. Try accessing `/api/kyc` endpoint - should work now
2. Try accessing `/api/notifications` endpoint - should work now
3. Check backend logs - no more `QueryFailedError` for missing columns

## Alternative: If SQL Script Fails

If you get errors about columns already existing or can't rename:

1. **Check current column names:**
   ```sql
   SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications';
   SELECT column_name FROM information_schema.columns WHERE table_name = 'messages';
   SELECT column_name FROM information_schema.columns WHERE table_name = 'kyc';
   ```

2. **If `read` column exists but `isRead` doesn't:**
   ```sql
   -- For notifications
   ALTER TABLE notifications ADD COLUMN "isRead" boolean DEFAULT false;
   UPDATE notifications SET "isRead" = "read";
   ALTER TABLE notifications DROP COLUMN "read";
   
   -- For messages
   ALTER TABLE messages ADD COLUMN "isRead" boolean DEFAULT false;
   UPDATE messages SET "isRead" = "read";
   ALTER TABLE messages DROP COLUMN "read";
   ```

3. **Then add missing KYC columns** (use the script above)

## What This Fixes

✅ `KYC.idType` column exists  
✅ `KYC.idNumber` and all other KYC fields exist  
✅ `notifications.isRead` column exists (renamed from `read`)  
✅ `notifications.link` and `metadata` columns exist  
✅ `messages.isRead` column exists (renamed from `read`)  
✅ `messages.readAt` column exists  

After running this, all the 500 errors should be resolved!
