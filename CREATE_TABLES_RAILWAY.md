# Creating Database Tables on Railway

## Problem
Your PostgreSQL database on Railway has no tables because TypeORM's `synchronize` is disabled in production by default for safety.

## Solution: Enable Table Creation

### Step 1: Add Environment Variable

1. Go to your **Railway dashboard**
2. Click on your **backend service** (not the PostgreSQL service)
3. Go to **Settings** → **Variables** tab
4. Click **"+ New Variable"**
5. Add:
   - **Name:** `DB_SYNCHRONIZE`
   - **Value:** `true`
6. Click **"Add"**

### Step 2: Redeploy Backend

1. Go to your backend service
2. Click **"Deployments"** tab
3. Click **"Redeploy"** (or wait for automatic redeploy from git push)
4. Wait for deployment to complete (2-3 minutes)

### Step 3: Verify Tables Created

1. Go to your **PostgreSQL service** in Railway
2. Click **"Database"** tab → **"Data"** sub-tab
3. You should now see tables:
   - `users`
   - `rides`
   - `payments`
   - `kyc`
   - `vehicles`
   - `messages`
   - `ratings`
   - `settings`
   - `notifications`

### Step 4: Disable Synchronize (IMPORTANT!)

After tables are created, **disable synchronize** for production safety:

1. Go back to backend service → **Settings** → **Variables**
2. Find `DB_SYNCHRONIZE`
3. Change value from `true` to `false`
4. Click **"Update"**
5. Redeploy the backend service

**Why?** `synchronize: true` can cause data loss in production if entity definitions change. It's only safe for initial setup.

## Alternative: Check Backend Logs

You can also verify table creation by checking backend logs:

1. Go to backend service → **"Logs"** tab
2. Look for messages like:
   - `query: CREATE TABLE "users"...`
   - `TypeOrmModule dependencies initialized`
   - No database connection errors

## Troubleshooting

### Tables Still Not Created?

1. **Check PostgreSQL is running:**
   - Go to PostgreSQL service → Check status is "Running"
   - Check logs for any errors

2. **Verify DATABASE_URL is set:**
   - Backend service → Settings → Variables
   - Ensure `DATABASE_URL` exists (should be auto-provided by Railway)

3. **Check backend logs for errors:**
   - Look for connection errors or TypeORM errors
   - Verify the backend can connect to the database

4. **Wait for full initialization:**
   - After setting `DB_SYNCHRONIZE=true`, wait 3-5 minutes
   - Tables are created when the backend starts and connects

### After Tables Are Created

Once you see tables in the Railway database console:
1. ✅ Set `DB_SYNCHRONIZE=false` (important for production!)
2. ✅ Redeploy backend
3. ✅ Your application is ready to use!
