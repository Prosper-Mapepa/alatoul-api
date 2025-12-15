# Railway Deployment Setup Guide

## Database Setup

### 1. Add PostgreSQL Service
1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a PostgreSQL database and provide connection details

### 2. Link Database to Backend Service
1. Go to your backend service settings
2. Click **"Variables"** tab
3. Railway automatically provides a `DATABASE_URL` variable when you link the database
4. If not automatically linked, click **"Reference Variable"** and select your PostgreSQL service's `DATABASE_URL`

### 3. Required Environment Variables

Add these environment variables in Railway (Settings → Variables):

#### Database (Auto-provided by Railway if linked)
- `DATABASE_URL` - Automatically set when PostgreSQL is linked (preferred)
- OR use individual variables:
  - `DB_HOST` - PostgreSQL host
  - `DB_PORT` - PostgreSQL port (usually 5432)
  - `DB_USERNAME` - PostgreSQL username
  - `DB_PASSWORD` - PostgreSQL password
  - `DB_DATABASE` - Database name

#### Application
- `JWT_SECRET` - Your JWT secret key (use the one generated: `3594d2b5974f54410bcece341b1fe44f179986bc77aca9bd71f4a861e4b5ec196d8523996d50e2689f486809db428e4b83b9591920915de563021be68cd3ebf4`)
- `JWT_EXPIRES_IN` - Token expiration (e.g., `7d`)
- `NODE_ENV` - Set to `production`
- `PORT` - Automatically set by Railway (don't override)
- `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)

### 4. Database Connection

The backend now supports:
- **Railway's DATABASE_URL** (automatically provided when PostgreSQL is linked) - **Recommended**
- Individual database variables (DB_HOST, DB_PORT, etc.)

### 5. Verify Connection

After deployment, check the logs to ensure:
- Database connection is successful
- No `ECONNREFUSED` errors
- Application starts on the correct port

## Troubleshooting

### Database Connection Errors

If you see `ECONNREFUSED` errors:
1. Ensure PostgreSQL service is added and running
2. Verify `DATABASE_URL` is set in environment variables
3. Check that the database service is linked to your backend service
4. Wait a few minutes after creating the database - it may take time to initialize

### Build Errors

If build fails:
- Check that `package.json` has the `engines` field specifying Node.js version
- Verify all dependencies are listed in `package.json`
- Check Railway build logs for specific errors

## Admin Account

After successful deployment, you can create an admin account by:
1. Connecting to your Railway database
2. Running the create-admin script locally with Railway database credentials
3. Or using Railway's database console to insert an admin user

Admin credentials (if already created):
- Email: `admin@alatoul.com`
- Password: `Admin@123456`
