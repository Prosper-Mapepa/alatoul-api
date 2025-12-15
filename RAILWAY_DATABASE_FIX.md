# Fixing PostgreSQL Shutdown Issue on Railway

## Problem
PostgreSQL starts successfully but immediately shuts down, causing `ECONNREFUSED` errors when the backend tries to connect.

## Symptoms
- Logs show: `database system is shut down` right after startup
- Backend gets connection refused errors
- Database appears to start but doesn't stay running

## Solutions

### Solution 1: Restart PostgreSQL Service (Quick Fix)

1. Go to your Railway project dashboard
2. Find your **PostgreSQL** service
3. Click on the service
4. Click the **"Restart"** button (or use the three-dot menu → Restart)
5. Wait 1-2 minutes for the database to fully initialize
6. Check the logs to confirm it stays running

### Solution 2: Verify Service Configuration

1. **Check Service Status:**
   - Go to Railway dashboard
   - Click on your PostgreSQL service
   - Verify it shows as "Running" (green status)
   - If it shows "Stopped" or keeps restarting, proceed to Solution 3

2. **Check Resource Limits:**
   - Railway free tier has resource limits
   - If you're hitting memory/CPU limits, the database may crash
   - Consider upgrading or optimizing your database usage

### Solution 3: Recreate PostgreSQL Service

If restarting doesn't work, recreate the database:

1. **Backup Important Data (if any):**
   - If you have data you need to keep, export it first
   - Use Railway's database console or `pg_dump`

2. **Delete and Recreate:**
   - In Railway dashboard, go to your PostgreSQL service
   - Click **Settings** → **Delete Service**
   - Confirm deletion
   - Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Wait 2-3 minutes for initialization

3. **Re-link to Backend:**
   - Go to your backend service
   - Click **Settings** → **Variables**
   - Verify `DATABASE_URL` is automatically set (Railway auto-links)
   - If not, click **"Reference Variable"** → Select PostgreSQL service → `DATABASE_URL`

4. **Redeploy Backend:**
   - After database is ready, trigger a redeploy of your backend
   - Go to backend service → **Deployments** → **"Redeploy"**

### Solution 4: Check Database Logs

1. Go to PostgreSQL service in Railway
2. Click **"Logs"** tab
3. Look for error messages that might indicate:
   - Out of memory errors
   - Disk space issues
   - Configuration errors
   - Permission problems

### Solution 5: Verify Environment Variables

Ensure your backend has the correct database connection:

1. Go to backend service → **Settings** → **Variables**
2. Verify `DATABASE_URL` is set (should be auto-provided by Railway)
3. The format should be: `postgresql://user:password@host:port/database`
4. If `DATABASE_URL` is missing, manually reference it from PostgreSQL service

### Solution 6: Wait for Full Initialization

Sometimes Railway databases need a few minutes to fully initialize:

1. After creating/restarting PostgreSQL, wait 3-5 minutes
2. Check logs - you should see:
   - `database system is ready to accept connections`
   - No shutdown messages
3. Only then try connecting from your backend

## Verification Steps

After applying a solution, verify it's working:

1. **Check PostgreSQL Logs:**
   ```
   Should see: "database system is ready to accept connections"
   Should NOT see: "database system is shut down" (after startup)
   ```

2. **Check Backend Logs:**
   ```
   Should see: "TypeOrmModule dependencies initialized"
   Should NOT see: "ECONNREFUSED" errors
   ```

3. **Test Connection:**
   - Use Railway's database console
   - Or connect via `psql` using the `DATABASE_URL`

## Common Causes

1. **Resource Constraints:** Railway free tier limits
2. **Service Not Fully Initialized:** Database needs time to start
3. **Configuration Issues:** Missing or incorrect `DATABASE_URL`
4. **Service Not Linked:** Backend can't access database
5. **Database Corruption:** Rare, but possible

## Prevention

1. **Monitor Resource Usage:** Keep an eye on memory/CPU usage
2. **Proper Linking:** Always ensure database is linked to backend service
3. **Wait for Initialization:** Don't deploy backend until database is ready
4. **Use DATABASE_URL:** Prefer Railway's auto-provided `DATABASE_URL` over manual config

## Still Having Issues?

If none of these solutions work:
1. Check Railway status page for service outages
2. Contact Railway support with your service logs
3. Consider using Railway's managed PostgreSQL (if on free tier, upgrade may be needed)
