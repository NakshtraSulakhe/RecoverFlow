#!/bin/bash

# RecoverFlow Database Setup Script
# This script sets up the PostgreSQL database for RecoverFlow

echo "Setting up RecoverFlow database..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running on localhost:5432"
    echo "Please start PostgreSQL service and try again"
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database..."
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS recoverflow_dev;" 2>/dev/null || psql -U postgres -c "CREATE DATABASE recoverflow_dev;"

# Run schema
echo "Creating database schema..."
psql -U postgres -d recoverflow_dev -f database/schema.sql

# Run seed data
echo "Inserting seed data..."
psql -U postgres -d recoverflow_dev -f database/seed.sql

echo "Database setup complete!"
echo ""
echo "Test credentials:"
echo "  Email: admin@testorg.com"
echo "  Password: password123"
echo ""
echo "Note: You need to generate proper bcrypt hashes for passwords in production."
