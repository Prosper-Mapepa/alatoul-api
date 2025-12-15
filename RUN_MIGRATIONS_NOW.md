# Running Migrations Manually on Railway

Since the migrations table exists but no application tables were created, the migration may not have run. Here's how to run it manually:

## Option 1: Use Railway's Database Console

1. Go to your PostgreSQL service in Railway
2. Click **"Database"** tab → **"Data"** sub-tab
3. Click **"Connect"** button to open the database console
4. Run this SQL to check migration status:
   ```sql
   SELECT * FROM migrations;
   ```
5. If the migration shows as executed but tables don't exist, delete the migration record:
   ```sql
   DELETE FROM migrations WHERE name = 'InitialMigration1765830407453';
   ```
6. Redeploy your backend - it will run the migration again

## Option 2: Force Migration via Railway CLI

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link to your project: `railway link`
4. Run migration:
   ```bash
   railway run npm run migrate
   ```

## Option 3: Check Backend Logs

1. Go to your backend service in Railway
2. Check the **"Logs"** tab
3. Look for migration-related messages:
   - "Running migrations..."
   - "Migration InitialMigration1765830407453 has been executed successfully"
   - Any migration errors

## Option 4: Enable Synchronize Temporarily

If migrations continue to fail, you can temporarily enable synchronize:

1. Go to backend service → **Settings** → **Variables**
2. Add/Update: `DB_SYNCHRONIZE=true`
3. Redeploy backend
4. After tables are created, set `DB_SYNCHRONIZE=false` again

## Verify Tables Created

After running migrations, check your PostgreSQL service:
- Go to **Database** → **Data** tab
- You should see these tables:
  - users
  - rides
  - payments
  - kyc
  - vehicles
  - messages
  - ratings
  - notifications
  - settings
  - migrations (already exists)
