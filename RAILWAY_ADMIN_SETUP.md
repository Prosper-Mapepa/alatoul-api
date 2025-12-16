# Creating Admin Account on Railway

This guide will help you create an admin account for your Alatoul backend deployed on Railway.

## Method 1: Using the Script (Recommended)

### Step 1: Get Railway Database Credentials

1. Go to your [Railway Dashboard](https://railway.app)
2. Select your project
3. Click on your **PostgreSQL** service
4. Go to the **"Variables"** tab
5. Copy the `DATABASE_URL` (recommended) or note the individual connection details:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### Step 2: Run the Script Locally

**Option A: Using DATABASE_URL (Easiest)**

```bash
cd backend
DATABASE_URL="your-railway-database-url" npx ts-node create-admin-railway.ts
```

**Option B: Using Individual Variables**

```bash
cd backend
DB_HOST=your-host \
DB_PORT=5432 \
DB_USERNAME=postgres \
DB_PASSWORD=your-password \
DB_DATABASE=railway \
npx ts-node create-admin-railway.ts
```

**Option C: Create a temporary .env file**

Create a `.env.railway` file (don't commit this):

```env
DATABASE_URL=postgresql://user:password@host:port/database
# OR
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=railway
```

Then run:
```bash
npx ts-node create-admin-railway.ts
```

### Step 3: Verify Admin Account

The script will output the admin credentials:
- **Email:** `admin@alatoul.com`
- **Password:** `Admin@123456`

You can now login at: `https://your-app.railway.app/api/auth/login`

## Method 2: Using Railway's Database Console

### Step 1: Open Railway Database Console

1. Go to your Railway project
2. Click on your PostgreSQL service
3. Click **"Query"** tab
4. This opens Railway's database console

### Step 2: Run SQL to Create Admin

First, you need to hash the password. You can use an online bcrypt generator or run this in Node.js:

```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('Admin@123456', 10).then(hash => console.log(hash));
```

Then run this SQL in Railway's database console:

```sql
-- Insert admin user (replace the hashed password with your generated hash)
INSERT INTO users (
  id, 
  email, 
  password, 
  name, 
  role, 
  status, 
  "isEmailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@alatoul.com',
  '$2b$10$YOUR_HASHED_PASSWORD_HERE',  -- Replace with actual bcrypt hash
  'Admin User',
  'admin',
  'active',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  status = 'active',
  password = EXCLUDED.password;
```

## Method 3: Using Railway CLI

If you have Railway CLI installed:

```bash
# Connect to Railway database
railway connect postgres

# Then run the script
npx ts-node create-admin-railway.ts
```

## Default Admin Credentials

After running any of the methods above, you can login with:

- **Email:** `admin@alatoul.com`
- **Password:** `Admin@123456`

⚠️ **Important:** Change the password after first login in production!

## Customizing Admin Credentials

You can customize the admin credentials by setting environment variables:

```bash
ADMIN_EMAIL=your-email@example.com \
ADMIN_PASSWORD=YourSecurePassword123! \
ADMIN_NAME="Your Name" \
ADMIN_PHONE="+1234567890" \
npx ts-node create-admin-railway.ts
```

## Troubleshooting

### Error: "Database connection failed"

- Verify your `DATABASE_URL` or database credentials are correct
- Check that your Railway database service is running
- Ensure your IP is allowed (Railway databases are usually accessible from anywhere)
- Wait a few minutes if you just created the database - it may need time to initialize

### Error: "relation 'users' does not exist"

- Run migrations first: `npm run migration:run`
- Or check that your database tables have been created

### Error: "User already exists"

- The script will update the existing user to admin if needed
- If you want to create a different admin, use custom credentials with environment variables

### SSL Connection Errors

- Railway databases require SSL connections
- The script automatically handles SSL for Railway databases
- If you still get SSL errors, verify your `DATABASE_URL` includes SSL parameters

## Security Notes

1. **Never commit** `.env` files with database credentials
2. **Change the default password** after first login
3. **Use strong passwords** for admin accounts
4. **Limit admin access** to trusted personnel only
5. **Regularly audit** admin user accounts

## Next Steps

After creating the admin account:

1. Login to your frontend admin panel
2. Change the default password
3. Configure platform settings
4. Review and approve KYC submissions
5. Monitor users and rides
