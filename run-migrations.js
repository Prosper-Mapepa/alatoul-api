#!/usr/bin/env node

/**
 * Script to run database migrations in production
 * Usage: node run-migrations.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Running database migrations...');

try {
  // Run migrations using TypeORM CLI with the compiled config
  const typeormConfigPath = path.resolve(__dirname, 'dist/config/typeorm.config.js');
  
  // Use node to run the migration via DataSource
  const fs = require('fs');
  const migrationScript = `
const dataSource = require('${typeormConfigPath}').default;
dataSource.initialize()
  .then(() => {
    console.log('Database connected, running migrations...');
    return dataSource.runMigrations();
  })
  .then((migrations) => {
    if (migrations.length > 0) {
      console.log('Migrations executed:');
      migrations.forEach(m => console.log('  -', m.name));
    } else {
      console.log('No pending migrations.');
    }
    return dataSource.destroy();
  })
  .catch((error) => {
    console.error('Migration error:', error);
    process.exit(1);
  });
  `;
  
  // Write script to temp file and execute
  const tempScript = path.resolve(__dirname, 'temp-migrate.js');
  fs.writeFileSync(tempScript, migrationScript);
  
  try {
    execSync(`node ${tempScript}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname),
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    });
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempScript)) {
      fs.unlinkSync(tempScript);
    }
  }
  console.log('✅ Migrations completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
