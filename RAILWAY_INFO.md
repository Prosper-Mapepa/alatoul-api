# Railway Deployment Information

## Backend API URL
**Production:** `https://gracious-growth-production-6d22.up.railway.app`

## API Endpoints
- Base URL: `https://gracious-growth-production-6d22.up.railway.app/api`
- Health Check: `https://gracious-growth-production-6d22.up.railway.app/api/health` (if available)
- Login: `https://gracious-growth-production-6d22.up.railway.app/api/auth/login`
- Register: `https://gracious-growth-production-6d22.up.railway.app/api/auth/register`

## Admin Account Creation

### Method 1: Using Railway CLI (Recommended)

```bash
# 1. Login to Railway
railway login

# 2. Link to your project
railway link

# 3. Create admin account
railway run npx ts-node create-admin-railway.ts
```

### Method 2: Using Public Database URL

1. Go to Railway Dashboard → PostgreSQL Service → Settings → Networking
2. Enable "Public Networking"
3. Copy the PUBLIC `DATABASE_URL`
4. Run locally:
   ```bash
   DATABASE_URL="your-public-url" npx ts-node create-admin-railway.ts
   ```

## Default Admin Credentials

After running the script:
- **Email:** `admin@alatoul.com`
- **Password:** `Admin@123456`

⚠️ **Important:** Change the password after first login!

## Testing the API

### Test Login (after creating admin)
```bash
curl -X POST https://gracious-growth-production-6d22.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alatoul.com",
    "password": "Admin@123456"
  }'
```

### Test Health Check
```bash
curl https://gracious-growth-production-6d22.up.railway.app/api/health
```

## Frontend Integration

Update your frontend `.env` or environment variables:
```
NEXT_PUBLIC_API_URL=https://gracious-growth-production-6d22.up.railway.app/api
```

## Database Connection

Internal URL (for Railway services):
```
postgresql://postgres:BGaQFyKRxiGiXEPiXacMFctHwSeKToqh@postgres.railway.internal:5432/railway
```

⚠️ This internal URL only works from within Railway's network.

## Next Steps

1. ✅ Create admin account (use one of the methods above)
2. ✅ Test API endpoints
3. ✅ Update frontend API URL
4. ✅ Login to admin panel
5. ✅ Change default admin password
6. ✅ Run database migrations (if not already done)
