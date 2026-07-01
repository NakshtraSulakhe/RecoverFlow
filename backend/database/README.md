# Database Setup

This directory contains the database schema and seed data for RecoverFlow.

## Prerequisites

- PostgreSQL installed and running on localhost:5432
- User 'postgres' with password 'postgres' (or update .env.development)

## Setup Instructions

### Option 1: Using the setup script (Linux/Mac)

```bash
cd backend
chmod +x database/setup.sh
./database/setup.sh
```

### Option 2: Manual setup (Windows/Linux/Mac)

1. **Create the database:**
```bash
psql -U postgres -c "CREATE DATABASE recoverflow_dev;"
```

2. **Run the schema:**
```bash
psql -U postgres -d recoverflow_dev -f database/schema.sql
```

3. **Run the seed data:**
```bash
psql -U postgres -d recoverflow_dev -f database/seed.sql
```

### Option 3: Using pgAdmin or other GUI tool

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Create a new database named `recoverflow_dev`
4. Open the SQL query tool
5. Execute the contents of `schema.sql`
6. Execute the contents of `seed.sql`

## Test Credentials

After running the seed script, you can use these credentials to test:

- **Email:** admin@testorg.com
- **Password:** password123
- **Role:** tenant_admin

**Note:** The seed data uses placeholder password hashes. For proper authentication, you need to generate real bcrypt hashes.

## Generating Password Hashes

To generate proper bcrypt hashes for passwords, you can use Node.js:

```javascript
const bcrypt = require('bcrypt');
const password = 'password123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Or use an online bcrypt generator (not recommended for production).

## Environment Variables

Make sure your `.env.development` file has the correct database settings:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recoverflow_dev
DB_USER=postgres
DB_PASSWORD=postgres
```

## Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check that PostgreSQL is on port 5432
- Verify your firewall settings

### "Database does not exist" error
- Run the schema.sql file first to create the database

### "Password authentication failed" error
- Update the DB_USER and DB_PASSWORD in .env.development
- Make sure the PostgreSQL user exists and has the correct password

## Resetting the Database

To reset the database (drop and recreate):

```bash
psql -U postgres -c "DROP DATABASE IF EXISTS recoverflow_dev;"
psql -U postgres -c "CREATE DATABASE recoverflow_dev;"
psql -U postgres -d recoverflow_dev -f database/schema.sql
psql -U postgres -d recoverflow_dev -f database/seed.sql
```
