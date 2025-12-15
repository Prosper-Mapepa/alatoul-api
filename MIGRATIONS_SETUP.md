# Database Migrations Setup

## Overview

The backend now uses TypeORM migrations to manage database schema. Migrations will run automatically on application startup.

## How It Works

1. **Automatic Migration Execution**: When the backend starts, it automatically runs any pending migrations
2. **Migration Files**: Located in `src/migrations/`
3. **Compiled Migrations**: After build, migrations are in `dist/migrations/`

## For Railway Deployment

Migrations run automatically when the backend service starts. No manual steps required!

### What Happens on Deploy:

1. Railway builds the application (`npm run build`)
2. Railway starts the application (`npm run start:prod`)
3. On startup, TypeORM checks for pending migrations
4. If migrations exist, they run automatically
5. Application continues to start normally

## Generating New Migrations

If you need to create a new migration after changing entities:

```bash
npm run migration:generate -- src/migrations/MigrationName
```

## Running Migrations Manually

If needed, you can run migrations manually:

```bash
# Development
npm run migration:run

# Production (after build)
npm run migrate
```

## Important Notes

- **Never delete migration files** - They track database schema history
- **Always test migrations locally** before deploying
- **Backup your database** before running migrations in production
- Migrations run automatically on startup - no need to set `RUN_MIGRATIONS=true`

## Troubleshooting

### Migrations Not Running

1. Check that `migrationsRun: true` is set in `database.config.ts`
2. Verify migration files are in `dist/migrations/` after build
3. Check backend logs for migration errors

### Migration Errors

1. Check database connection is working
2. Verify all required environment variables are set
3. Check migration file syntax
4. Review backend logs for specific error messages
