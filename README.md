# Alatoul Backend API

Backend API server for Alatoul ride-hailing platform built with NestJS, PostgreSQL, and TypeORM.

## 🚀 Features

- **Authentication & Authorization** - JWT-based authentication with role-based access
- **User Management** - Full CRUD operations for passengers and drivers
- **Ride Management** - Book, schedule, accept, and track rides with fare negotiation
- **Payment Processing** - Handle payments, earnings, and transactions
- **KYC Verification** - Know Your Customer verification for drivers and passengers
- **Real-time Messaging** - In-app messaging between users
- **Ratings & Reviews** - Rate drivers and passengers after rides
- **Vehicle Management** - Driver vehicle registration and management

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - Object-relational mapping
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware
- **Class Validator** - Request validation
- **bcrypt** - Password hashing

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=alatoul

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=3001
NODE_ENV=development
```

3. **Create PostgreSQL database:**
```bash
createdb alatoul
```

4. **Run the application:**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user profile (Protected)

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/statistics` - Get user statistics
- `PATCH /api/users/:id` - Update user
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

### Rides
- `POST /api/rides` - Create new ride request
- `GET /api/rides` - Get all rides (with filters)
- `GET /api/rides/pending` - Get pending ride requests
- `GET /api/rides/:id` - Get ride by ID
- `POST /api/rides/:id/accept` - Accept ride (driver)
- `POST /api/rides/:id/cancel` - Cancel ride
- `PATCH /api/rides/:id` - Update ride status
- `GET /api/rides/statistics` - Get ride statistics

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get user payments
- `GET /api/payments/earnings` - Get earnings (driver)
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/:id/status` - Update payment status

### KYC
- `POST /api/kyc` - Submit KYC information
- `GET /api/kyc` - Get user KYC status
- `PATCH /api/kyc` - Update KYC information
- `PATCH /api/kyc/status` - Update KYC status (admin)

### Vehicles
- `POST /api/vehicles` - Register vehicle (driver)
- `GET /api/vehicles` - Get driver vehicle
- `PATCH /api/vehicles` - Update vehicle information
- `GET /api/vehicles/all` - Get all vehicles

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/unread/count` - Get unread message count
- `POST /api/messages/:id/read` - Mark message as read

### Ratings
- `POST /api/ratings` - Create rating
- `GET /api/ratings/user/:userId` - Get user ratings
- `GET /api/ratings/ride/:rideId` - Get ride ratings

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "passenger"
}
```

### Create Ride
```bash
POST /api/rides
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupLocation": "123 Main St",
  "destination": "456 Oak Ave",
  "proposedFare": 25.00,
  "type": "now",
  "passengers": 2
}
```

### Accept Ride
```bash
POST /api/rides/:rideId/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "counterOffer": 28.00
}
```

## 🗄️ Database Schema

The backend uses the following main entities:
- **User** - Passengers, drivers, and admins
- **Ride** - Ride requests and bookings
- **Payment** - Payment transactions
- **KYC** - Know Your Customer verification
- **Vehicle** - Driver vehicles
- **Message** - In-app messages
- **Rating** - User ratings and reviews

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🔧 Development

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build
npm run start:prod
```

## 📄 License

Private - All rights reserved
