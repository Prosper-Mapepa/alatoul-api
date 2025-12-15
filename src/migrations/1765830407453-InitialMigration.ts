import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1765830407453 implements MigrationInterface {
    name = 'InitialMigration1765830407453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create enums
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('passenger', 'driver', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'active', 'suspended', 'verified')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('cash', 'card', 'wallet', 'mobile_money')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."rides_type_enum" AS ENUM('now', 'scheduled')`);
        await queryRunner.query(`CREATE TYPE "public"."rides_status_enum" AS ENUM('pending', 'accepted', 'driver_assigned', 'driver_arrived', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_status_enum" AS ENUM('pending', 'in_progress', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('text', 'image', 'system')`);
        await queryRunner.query(`CREATE TYPE "public"."vehicles_type_enum" AS ENUM('sedan', 'suv', 'van', 'motorcycle')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('ride_request', 'ride_accepted', 'ride_cancelled', 'ride_completed', 'payment_received', 'kyc_approved', 'kyc_rejected', 'driver_approved', 'driver_suspended', 'system_alert', 'safety_report')`);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'passenger',
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
                "avatar" character varying,
                "dateOfBirth" TIMESTAMP,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "emailVerificationToken" character varying,
                "passwordResetToken" character varying,
                "passwordResetExpires" TIMESTAMP,
                "totalRides" integer NOT NULL DEFAULT 0,
                "averageRating" numeric(3,2) NOT NULL DEFAULT 0,
                "isOnline" boolean NOT NULL DEFAULT false,
                "lastSeen" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);

        // Create vehicles table
        await queryRunner.query(`
            CREATE TABLE "vehicles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "driver_id" uuid NOT NULL,
                "make" character varying NOT NULL,
                "model" character varying NOT NULL,
                "year" integer NOT NULL,
                "color" character varying,
                "plateNumber" character varying NOT NULL,
                "type" "public"."vehicles_type_enum" NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_vehicles" PRIMARY KEY ("id"),
                CONSTRAINT "FK_vehicles_driver" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_vehicles_driver" ON "vehicles" ("driver_id")`);

        // Create kyc table
        await queryRunner.query(`
            CREATE TABLE "kyc" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "status" "public"."kyc_status_enum" NOT NULL DEFAULT 'pending',
                "firstName" character varying,
                "lastName" character varying,
                "dateOfBirth" TIMESTAMP,
                "nationality" character varying,
                "address" character varying,
                "city" character varying,
                "state" character varying,
                "zipCode" character varying,
                "country" character varying,
                "idType" character varying,
                "idNumber" character varying,
                "idFrontImage" character varying,
                "idBackImage" character varying,
                "idExpiryDate" TIMESTAMP,
                "licenseNumber" character varying,
                "licenseImage" character varying,
                "licenseExpiryDate" TIMESTAMP,
                "licenseIssuedDate" TIMESTAMP,
                "vehicleMake" character varying,
                "vehicleModel" character varying,
                "vehicleYear" integer,
                "vehiclePlateNumber" character varying,
                "vehicleRegistrationImage" character varying,
                "bankName" character varying,
                "accountNumber" character varying,
                "accountHolderName" character varying,
                "mobileMoneyNumber" character varying,
                "mobileMoneyProvider" character varying,
                "rejectionReason" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_kyc_user" UNIQUE ("user_id"),
                CONSTRAINT "PK_kyc" PRIMARY KEY ("id"),
                CONSTRAINT "FK_kyc_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create rides table
        await queryRunner.query(`
            CREATE TABLE "rides" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "passenger_id" uuid NOT NULL,
                "driver_id" uuid,
                "type" "public"."rides_type_enum" NOT NULL DEFAULT 'now',
                "status" "public"."rides_status_enum" NOT NULL DEFAULT 'pending',
                "pickupLocation" character varying NOT NULL,
                "pickupLatitude" numeric(10,7),
                "pickupLongitude" numeric(10,7),
                "destination" character varying NOT NULL,
                "destinationLatitude" numeric(10,7),
                "destinationLongitude" numeric(10,7),
                "proposedFare" numeric(8,2) NOT NULL,
                "acceptedFare" numeric(8,2),
                "finalFare" numeric(8,2),
                "distance" numeric(8,2),
                "estimatedDuration" integer,
                "passengers" integer NOT NULL DEFAULT 1,
                "scheduledDate" TIMESTAMP,
                "scheduledTime" character varying,
                "startedAt" TIMESTAMP,
                "completedAt" TIMESTAMP,
                "cancelledAt" TIMESTAMP,
                "cancellationReason" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rides" PRIMARY KEY ("id"),
                CONSTRAINT "FK_rides_passenger" FOREIGN KEY ("passenger_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_rides_driver" FOREIGN KEY ("driver_id") REFERENCES "users"("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_rides_passenger" ON "rides" ("passenger_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_rides_driver" ON "rides" ("driver_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_rides_status" ON "rides" ("status")`);

        // Create payments table
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "ride_id" uuid,
                "amount" numeric(10,2) NOT NULL,
                "method" "public"."payments_method_enum" NOT NULL,
                "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
                "transactionId" character varying,
                "processedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_payments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_payments_ride" FOREIGN KEY ("ride_id") REFERENCES "rides"("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_payments_user" ON "payments" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_status" ON "payments" ("status")`);

        // Create ratings table
        await queryRunner.query(`
            CREATE TABLE "ratings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "rated_by_id" uuid NOT NULL,
                "ride_id" uuid NOT NULL,
                "rating" integer NOT NULL,
                "comment" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ratings" PRIMARY KEY ("id"),
                CONSTRAINT "FK_ratings_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_ratings_ratedBy" FOREIGN KEY ("rated_by_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_ratings_ride" FOREIGN KEY ("ride_id") REFERENCES "rides"("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_ratings_user" ON "ratings" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ratings_ride" ON "ratings" ("ride_id")`);

        // Create messages table
        await queryRunner.query(`
            CREATE TABLE "messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sender_id" uuid NOT NULL,
                "receiver_id" uuid NOT NULL,
                "ride_id" uuid,
                "content" text NOT NULL,
                "type" "public"."messages_type_enum" NOT NULL DEFAULT 'text',
                "isRead" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_messages" PRIMARY KEY ("id"),
                CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_messages_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_messages_ride" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_messages_ride" ON "messages" ("ride_id")`);

        // Create notifications table
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "type" "public"."notifications_type_enum" NOT NULL,
                "title" character varying NOT NULL,
                "message" text NOT NULL,
                "isRead" boolean NOT NULL DEFAULT false,
                "relatedId" character varying,
                "link" character varying,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
                CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user" ON "notifications" ("user_id")`);

        // Create settings table
        await queryRunner.query(`
            CREATE TABLE "settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL DEFAULT 'default',
                "platformFeePercent" numeric(5,2) NOT NULL DEFAULT 20,
                "minimumFare" numeric(10,2) NOT NULL DEFAULT 5,
                "baseRatePerMile" numeric(10,2) NOT NULL DEFAULT 1.5,
                "baseRatePerMinute" numeric(10,2) NOT NULL DEFAULT 0.3,
                "platformName" character varying,
                "supportEmail" character varying,
                "supportPhone" character varying,
                "timezone" character varying,
                "defaultLanguage" character varying DEFAULT 'en',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_settings_key" UNIQUE ("key"),
                CONSTRAINT "PK_settings" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_user"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_messages_ride"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ratings_ride"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ratings_user"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_user"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_rides_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_rides_driver"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_rides_passenger"`);
        await queryRunner.query(`DROP TABLE "rides"`);
        await queryRunner.query(`DROP TABLE "kyc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_vehicles_driver"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vehicles_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rides_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rides_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
