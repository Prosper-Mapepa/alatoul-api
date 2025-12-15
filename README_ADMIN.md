# Creating an Admin User

There are two ways to create an admin user:

## Method 1: Using the Admin Panel (Recommended)

1. First, you need to have at least one admin user to access the admin panel. If you don't have one yet, use Method 2.

2. Once you have admin access:
   - Go to `/admin/users`
   - Click "Add User"
   - Fill in the form:
     - Name: Admin's full name
     - Email: Admin's email address
     - Phone: (Optional) Admin's phone number
     - Role: Select "Admin"
     - Password: Enter a secure password (minimum 8 characters)
     - Status: Select "Active"
   - Click "Create User"

## Method 2: Using the Command Line Script

If you don't have an admin user yet, you can create one using the command line script:

### Prerequisites

1. Make sure your database is running and configured
2. Set up your `.env` file in the backend directory with database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=alatoul
   ```

### Steps

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the script:
   ```bash
   npx ts-node create-admin.ts <email> <password> <name> [phone]
   ```

   Example:
   ```bash
   npx ts-node create-admin.ts admin@alatoul.com Admin123! "Admin User" "+1234567890"
   ```

   Parameters:
   - `email`: Admin's email address (required)
   - `password`: Admin's password, must be at least 8 characters (required)
   - `name`: Admin's full name (required)
   - `phone`: Admin's phone number (optional)

4. The script will:
   - Connect to your database
   - Check if a user with that email already exists
   - If the user exists but is not an admin, it will update them to admin
   - If the user doesn't exist, it will create a new admin user
   - Set the user status to "Active"
   - Hash the password securely

5. After successful creation, you can login with the admin credentials at `/signin`

### Troubleshooting

- **"Database connection failed"**: Check your `.env` file and make sure your database is running
- **"User already exists"**: The script will update the existing user to admin if they're not already an admin
- **"Password too short"**: Make sure your password is at least 8 characters long

## Security Notes

- Always use a strong password for admin accounts
- Keep admin credentials secure
- Consider using environment variables for sensitive data in production
- Regularly review and audit admin user accounts
