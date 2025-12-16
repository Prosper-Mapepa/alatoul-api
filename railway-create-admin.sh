#!/bin/bash
# Script to create admin account on Railway
# This can be run as a Railway one-off service

echo "🚂 Creating admin account on Railway..."

# The DATABASE_URL is automatically provided by Railway
npx ts-node create-admin-railway.ts
