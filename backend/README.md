# RecoverFlow Backend API

Enterprise Multi-Tenant AI-Powered Debt Recovery & Collection Platform Backend

## Overview

This is the backend API server for the RecoverFlow platform, built with Node.js, Express, TypeScript, PostgreSQL, and Redis. It provides a RESTful API with multi-tenant architecture, JWT authentication, role-based access control, and AI-powered recovery features.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16+
- **Cache**: Redis
- **Authentication**: JWT (Access + Refresh tokens)
- **AI**: OpenAI GPT-4
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Validation**: Joi

## Features

- Multi-tenant architecture with tenant isolation
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- AI-powered recovery assistant
- Priority scoring and risk assessment
- Promise-to-pay tracking
- Customer and loan management
- Recovery case management
- Comprehensive API documentation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.development
```

3. Configure your environment variables in `.env.development`

4. Start PostgreSQL and Redis servers

5. Run database migrations (when implemented):
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Documentation

Once the server is running, access the Swagger documentation at:
`http://localhost:3001/api-docs`

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Data models
│   ├── repositories/     # Database repositories
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── server.ts        # Application entry point
├── dist/                # Compiled JavaScript
├── logs/                # Application logs
├── uploads/             # File uploads
└── package.json
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `DB_HOST`: PostgreSQL host
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `REDIS_HOST`: Redis host
- `JWT_SECRET`: JWT secret key
- `OPENAI_API_KEY`: OpenAI API key for AI features

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Tenants
- `POST /api/v1/tenants` - Create tenant
- `GET /api/v1/tenants` - Get all tenants
- `GET /api/v1/tenants/:id` - Get tenant by ID
- `PUT /api/v1/tenants/:id` - Update tenant
- `DELETE /api/v1/tenants/:id` - Delete tenant

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers` - Get all customers
- `GET /api/v1/customers/:id` - Get customer by ID
- `PUT /api/v1/customers/:id` - Update customer

### Loans
- `POST /api/v1/loans` - Create loan
- `GET /api/v1/loans` - Get all loans
- `GET /api/v1/loans/:id` - Get loan by ID

### Recovery
- `POST /api/v1/recovery/cases` - Create recovery case
- `GET /api/v1/recovery/cases` - Get all recovery cases
- `GET /api/v1/recovery/cases/:id` - Get recovery case by ID
- `POST /api/v1/recovery/ptp` - Create promise to pay
- `GET /api/v1/recovery/ptp/:id` - Get PTP by ID

### AI
- `POST /api/v1/ai/assistant` - Get AI assistant response
- `POST /api/v1/ai/priority-score` - Calculate priority score
- `POST /api/v1/ai/risk-score` - Calculate risk score
- `POST /api/v1/ai/summary` - Generate AI summary

## Development

### Running in development mode:
```bash
npm run dev
```

### Building for production:
```bash
npm run build
```

### Running in production:
```bash
npm start
```

### Running tests:
```bash
npm test
```

### Linting:
```bash
npm run lint
```

## User Roles

- `platform_owner` - Full system access
- `tenant_admin` - Tenant management
- `recovery_manager` - Recovery operations management
- `team_leader` - Team management
- `recovery_agent` - Recovery operations
- `legal_officer` - Legal operations
- `qa` - Quality assurance
- `auditor` - Audit operations
- `read_only` - Read-only access

## Multi-Tenant Architecture

Every request must include the tenant ID in the header:
```
X-Tenant-ID: <tenant-uuid>
```

All database queries are automatically filtered by tenant_id to ensure data isolation.

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet for security headers
- Input validation
- SQL injection prevention (parameterized queries)

## License

Proprietary - All rights reserved
