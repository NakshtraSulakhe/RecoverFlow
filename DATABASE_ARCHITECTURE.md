# RecoverFlow Database Architecture
## Enterprise Multi-Tenant Recovery Management SaaS

Version: 1.0.0
Last Updated: June 30, 2026
Database: PostgreSQL 16+
Design Philosophy: Normalized with Strategic Denormalization
Multi-Tenant Strategy: Shared Database with Row-Level Security

---

## Document Overview

This document serves as the official Enterprise Database Architecture Specification for the RecoverFlow platform. It defines the complete database schema, relationships, performance strategies, and scalability considerations for supporting millions of customers, loans, recovery cases, payments, AI predictions, audit logs, reports, and multiple tenants.

**Target Scale**
- 10 Million Customers
- 1000+ Tenants
- 100,000 Concurrent Users
- 100 Million Transactions Daily
- 1 Billion Historical Records

**Database Technology**
- PostgreSQL 16+ (Primary Database)
- Redis (Caching)
- Elasticsearch (Search)
- TimescaleDB (Time-series data)
- Snowflake/BigQuery (Data Warehouse)

---

# SECTION 1: Database Design Philosophy

## Normalization Strategy

**Normalization Level: BCNF (Boyce-Codd Normal Form)**

**Rationale**
- Eliminate data redundancy
- Ensure data integrity
- Simplify maintenance
- Enable efficient updates
- Reduce storage requirements

**Normalization Approach**
- 3NF for transactional tables
- BCNF for critical business tables
- Strategic denormalization for performance
- Separate reporting layer for analytics

**Normalization Benefits**
- Single source of truth
- Consistent data across application
- Easier to maintain business rules
- Reduced data anomalies
- Better query performance for OLTP

## Denormalization Strategy

**Strategic Denormalization**

**When to Denormalize**
- Read-heavy reporting queries
- Dashboard aggregations
- Frequently joined tables
- Performance-critical paths
- Historical data analysis

**Denormalization Patterns**
- Summary tables (daily/monthly aggregations)
- Materialized views for complex queries
- Cached computed columns
- Pre-joined tables for common queries
- Read replicas with denormalized data

**Denormalization Trade-offs**
- Increased storage
- Complexity in maintaining consistency
- Potential data staleness
- Requires synchronization mechanisms
- Backup complexity

## Scalability

**Horizontal Scaling**
- Database sharding for large tenants
- Read replicas for reporting
- Connection pooling
- Partitioning for large tables
- Caching layer for read-heavy operations

**Vertical Scaling**
- Optimized hardware
- Memory optimization
- CPU optimization
- Storage optimization (SSD/NVMe)
- Network optimization

**Database Scaling Strategy**
- Start with single instance
- Add read replicas for reporting
- Implement partitioning for large tables
- Shard by tenant for multi-tenant scaling
- Use connection pooling for high concurrency

## Partitioning

**Partitioning Strategy**

**Partition by Range**
- Date-based partitioning (transactions, payments)
- ID range partitioning (customers, loans)
- Tenant-based partitioning (for large tenants)

**Partition by List**
- Tenant-based partitioning
- Region-based partitioning
- Status-based partitioning

**Partition by Hash**
- Customer ID hashing
- Loan ID hashing
- Case ID hashing

**Partitioning Benefits**
- Improved query performance
- Easier maintenance
- Faster data archival
- Better index performance
- Parallel query execution

## Performance

**Performance Optimization**
- Proper indexing strategy
- Query optimization
- Connection pooling
- Caching strategy
- Partitioning
- Materialized views
- Read replicas

**Performance Targets**
- Query response time < 100ms (p95)
- Insert rate > 10,000/second
- Update rate > 5,000/second
- Concurrent connections > 1,000
- Database uptime > 99.9%

## Maintainability

**Maintainability Strategy**
- Clear naming conventions
- Comprehensive documentation
- Version-controlled migrations
- Automated testing
- Monitoring and alerting
- Regular maintenance tasks

**Maintenance Tasks**
- Index maintenance
- Statistics update
- Vacuum and analyze
- Archive old data
- Backup verification
- Performance tuning

## Auditability

**Audit Strategy**
- Comprehensive audit logging
- Change tracking
- History tables
- Event logging
- Session logging

**Audit Requirements**
- Who changed data
- When data was changed
- What was changed
- Why it was changed
- From where it was changed

## Multi-Tenant Strategy

**Tenant Isolation**
- Row-level security (RLS)
- Tenant ID in all tables
- Tenant-aware queries
- Tenant-specific indexes
- Tenant-specific backups

**Tenant Data Separation**
- Logical separation (tenant_id)
- Physical separation (optional for large tenants)
- Schema separation (optional)
- Database separation (optional for enterprise tenants)

## Soft Delete Strategy

**Soft Delete Implementation**
- `deleted_at` timestamp column
- `is_deleted` boolean column
- `deleted_by` user reference
- `deleted_reason` text column
- Unique constraints ignore soft-deleted records

**Soft Delete Benefits**
- Data recovery capability
- Audit trail
- Compliance requirements
- Referential integrity
- Historical analysis

## History Tracking

**History Tracking Strategy**
- Audit tables for critical data
- Temporal tables for time-series data
- Change tracking for sensitive data
- Version history for documents
- Activity timeline for user actions

**History Tables**
- `customers_history`
- `loans_history`
- `payments_history`
- `cases_history`
- `documents_history`

## Event Sourcing Considerations

**Event Sourcing Strategy**
- Event store for critical events
- Event replay capability
- Event versioning
- Event aggregation
- Event projection

**Event Types**
- Customer events
- Loan events
- Payment events
- Case events
- Legal events

## Reporting Optimization

**Reporting Strategy**
- Separate reporting database
- Materialized views
- Pre-aggregated tables
- Columnar storage for analytics
- OLAP cubes for complex analysis

**Reporting Tables**
- Daily aggregations
- Monthly aggregations
- Yearly aggregations
- Custom aggregations
- Summary tables

---

# SECTION 2: Master Data Model

## Tenants Table

**Purpose**: Store tenant/organization information for multi-tenant architecture

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(50),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    address_id UUID REFERENCES addresses(id),
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en_US',
    currency VARCHAR(3) DEFAULT 'USD',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    subscription_plan VARCHAR(50) NOT NULL,
    subscription_start_date DATE NOT NULL,
    subscription_end_date DATE,
    max_users INTEGER DEFAULT 10,
    max_customers INTEGER DEFAULT 1000,
    max_storage_gb INTEGER DEFAULT 10,
    features JSONB,
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_tenants_tenant_code ON tenants(tenant_code);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_subscription ON tenants(subscription_plan);
CREATE INDEX idx_tenants_deleted_at ON tenants(deleted_at) WHERE deleted_at IS NULL;
```

**Columns**
- `id`: Unique identifier
- `tenant_code`: Unique tenant code
- `tenant_name`: Display name
- `legal_name`: Legal entity name
- `business_type`: Type of business (bank, nbfc, etc.)
- `registration_number`: Business registration number
- `tax_id`: Tax identification number
- `logo_url`: Logo image URL
- `website_url`: Company website
- `contact_email`: Primary contact email
- `contact_phone`: Primary contact phone
- `address_id`: Foreign key to addresses
- `timezone`: Tenant timezone
- `locale`: Tenant locale
- `currency`: Default currency
- `date_format`: Date format preference
- `status`: Tenant status (active, suspended, terminated)
- `subscription_plan`: Subscription tier
- `subscription_start_date`: Subscription start
- `subscription_end_date`: Subscription end
- `max_users`: Maximum allowed users
- `max_customers`: Maximum allowed customers
- `max_storage_gb`: Maximum storage in GB
- `features`: JSONB for feature flags
- `settings`: JSONB for tenant settings
- `metadata`: JSONB for additional metadata
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- `created_by`: User who created
- `updated_by`: User who last updated
- `deleted_at`: Soft delete timestamp
- `deleted_by`: User who deleted
- `is_deleted`: Soft delete flag

**Constraints**
- PRIMARY KEY on id
- UNIQUE on tenant_code
- NOT NULL on tenant_name, legal_name, business_type, contact_email
- FOREIGN KEY on address_id
- FOREIGN KEY on created_by
- FOREIGN KEY on updated_by
- FOREIGN KEY on deleted_by

**Indexes**
- idx_tenants_tenant_code: For tenant lookup by code
- idx_tenants_status: For filtering by status
- idx_tenants_subscription: For subscription management
- idx_tenants_deleted_at: For soft delete filtering

## Companies Table

**Purpose**: Store company/branch information within tenants

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_code VARCHAR(50) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(50),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    address_id UUID REFERENCES addresses(id),
    parent_company_id UUID REFERENCES companies(id),
    company_type VARCHAR(50) DEFAULT 'branch',
    region VARCHAR(100),
    territory VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, company_code)
);

-- Indexes
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_company_code ON companies(company_code);
CREATE INDEX idx_companies_parent_company_id ON companies(parent_company_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NULL;
```

## Branches Table

**Purpose**: Store branch/office locations

```sql
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    branch_code VARCHAR(50) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    branch_type VARCHAR(50) DEFAULT 'office',
    address_id UUID REFERENCES addresses(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    manager_id UUID REFERENCES users(id),
    region VARCHAR(100),
    territory VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, branch_code)
);

-- Indexes
CREATE INDEX idx_branches_tenant_id ON branches(tenant_id);
CREATE INDEX idx_branches_company_id ON branches(company_id);
CREATE INDEX idx_branches_branch_code ON branches(branch_code);
CREATE INDEX idx_branches_manager_id ON branches(manager_id);
CREATE INDEX idx_branches_status ON branches(status);
CREATE INDEX idx_branches_deleted_at ON branches(deleted_at) WHERE deleted_at IS NULL;
```

## Departments Table

**Purpose**: Store organizational departments

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    department_code VARCHAR(50) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES users(id),
    department_type VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, department_code)
);

-- Indexes
CREATE INDEX idx_departments_tenant_id ON departments(tenant_id);
CREATE INDEX idx_departments_company_id ON departments(company_id);
CREATE INDEX idx_departments_department_code ON departments(department_code);
CREATE INDEX idx_departments_parent_department_id ON departments(parent_department_id);
CREATE INDEX idx_departments_manager_id ON departments(manager_id);
CREATE INDEX idx_departments_status ON departments(status);
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at) WHERE deleted_at IS NULL;
```

## Teams Table

**Purpose**: Store team information for user grouping

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    branch_id UUID REFERENCES branches(id),
    department_id UUID REFERENCES departments(id),
    team_code VARCHAR(50) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    description TEXT,
    team_type VARCHAR(50) DEFAULT 'recovery',
    manager_id UUID REFERENCES users(id),
    parent_team_id UUID REFERENCES teams(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, team_code)
);

-- Indexes
CREATE INDEX idx_teams_tenant_id ON teams(tenant_id);
CREATE INDEX idx_teams_company_id ON teams(company_id);
CREATE INDEX idx_teams_branch_id ON teams(branch_id);
CREATE INDEX idx_teams_department_id ON teams(department_id);
CREATE INDEX idx_teams_team_code ON teams(team_code);
CREATE INDEX idx_teams_manager_id ON teams(manager_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_deleted_at ON teams(deleted_at) WHERE deleted_at IS NULL;
```

## Users Table

**Purpose**: Store user account information

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    branch_id UUID REFERENCES branches(id),
    department_id UUID REFERENCES departments(id),
    team_id UUID REFERENCES teams(id),
    user_code VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    employee_id VARCHAR(50),
    job_title VARCHAR(100),
    manager_id UUID REFERENCES users(id),
    user_type VARCHAR(50) DEFAULT 'staff',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    password_expires_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en_US',
    preferences JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, user_code)
);

-- Indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
```

## Roles Table

**Purpose**: Store role definitions for RBAC

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    description TEXT,
    role_type VARCHAR(50) DEFAULT 'custom',
    is_system_role BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    permissions JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, role_code)
);

-- Indexes
CREATE INDEX idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX idx_roles_role_code ON roles(role_code);
CREATE INDEX idx_roles_is_system_role ON roles(is_system_role);
CREATE INDEX idx_roles_status ON roles(status);
CREATE INDEX idx_roles_deleted_at ON roles(deleted_at) WHERE deleted_at IS NULL;
```

## Permissions Table

**Purpose**: Store granular permissions

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(50),
    is_system_permission BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_permissions_permission_code ON permissions(permission_code);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_action ON permissions(action);
CREATE INDEX idx_permissions_status ON permissions(status);
```

## User Roles Junction Table

**Purpose**: Many-to-many relationship between users and roles

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

-- Indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
```

## Role Permissions Junction Table

**Purpose**: Many-to-many relationship between roles and permissions

```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    UNIQUE(role_id, permission_id)
);

-- Indexes
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

## Addresses Table

**Purpose**: Store address information (reusable across entities)

```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    address_line3 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_addresses_country_code ON addresses(country_code);
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code);
CREATE INDEX idx_addresses_address_type ON addresses(address_type);
```

## Countries Table

**Purpose**: Store country reference data

```sql
CREATE TABLE countries (
    id CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso3 CHAR(3),
    numeric_code INTEGER,
    currency_code CHAR(3),
    currency_name VARCHAR(50),
    calling_code VARCHAR(10),
    region VARCHAR(50),
    subregion VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active'
);

-- Indexes
CREATE INDEX idx_countries_name ON countries(name);
CREATE INDEX idx_countries_currency_code ON countries(currency_code);
CREATE INDEX idx_countries_region ON countries(region);
CREATE INDEX idx_countries_status ON countries(status);
```

## States Table

**Purpose**: Store state/province reference data

```sql
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL REFERENCES countries(id),
    state_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(country_code, state_code)
);

-- Indexes
CREATE INDEX idx_states_country_code ON states(country_code);
CREATE INDEX idx_states_state_code ON states(state_code);
CREATE INDEX idx_states_name ON states(name);
CREATE INDEX idx_states_status ON states(status);
```

## Cities Table

**Purpose**: Store city reference data

```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL REFERENCES countries(id),
    state_id INTEGER REFERENCES states(id),
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INTEGER,
    timezone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active'
);

-- Indexes
CREATE INDEX idx_cities_country_code ON cities(country_code);
CREATE INDEX idx_cities_state_id ON cities(state_id);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_status ON cities(status);
```

## Recovery Buckets Table

**Purpose**: Store recovery bucket definitions for aging analysis

```sql
CREATE TABLE recovery_buckets (
    id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    bucket_code VARCHAR(50) NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    description TEXT,
    min_days_overdue INTEGER NOT NULL,
    max_days_overdue INTEGER,
    color_code VARCHAR(7),
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(tenant_id, bucket_code)
);

-- Indexes
CREATE INDEX idx_recovery_buckets_tenant_id ON recovery_buckets(tenant_id);
CREATE INDEX idx_recovery_buckets_bucket_code ON recovery_buckets(bucket_code);
CREATE INDEX idx_recovery_buckets_priority ON recovery_buckets(priority);
CREATE INDEX idx_recovery_buckets_status ON recovery_buckets(status);
```

## Loan Types Table

**Purpose**: Store loan product type definitions

```sql
CREATE TABLE loan_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    loan_type_code VARCHAR(50) NOT NULL,
    loan_type_name VARCHAR(255) NOT NULL,
    description TEXT,
    loan_category VARCHAR(50),
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    min_tenure_months INTEGER,
    max_tenure_months INTEGER,
    interest_rate_min DECIMAL(5, 2),
    interest_rate_max DECIMAL(5, 2),
    processing_fee_percent DECIMAL(5, 2),
    prepayment_allowed BOOLEAN DEFAULT TRUE,
    prepayment_penalty_percent DECIMAL(5, 2),
    collateral_required BOOLEAN DEFAULT FALSE,
    guarantor_required BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, loan_type_code)
);

-- Indexes
CREATE INDEX idx_loan_types_tenant_id ON loan_types(tenant_id);
CREATE INDEX idx_loan_types_loan_type_code ON loan_types(loan_type_code);
CREATE INDEX idx_loan_types_loan_category ON loan_types(loan_category);
CREATE INDEX idx_loan_types_status ON loan_types(status);
CREATE INDEX idx_loan_types_deleted_at ON loan_types(deleted_at) WHERE deleted_at IS NULL;
```

## Payment Methods Table

**Purpose**: Store payment method definitions

```sql
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payment_method_code VARCHAR(50) NOT NULL,
    payment_method_name VARCHAR(255) NOT NULL,
    description TEXT,
    payment_type VARCHAR(50) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    is_offline BOOLEAN DEFAULT FALSE,
    processing_time_hours INTEGER,
    fee_percent DECIMAL(5, 2),
    fee_fixed DECIMAL(10, 2),
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, payment_method_code)
);

-- Indexes
CREATE INDEX idx_payment_methods_tenant_id ON payment_methods(tenant_id);
CREATE INDEX idx_payment_methods_payment_method_code ON payment_methods(payment_method_code);
CREATE INDEX idx_payment_methods_payment_type ON payment_methods(payment_type);
CREATE INDEX idx_payment_methods_status ON payment_methods(status);
CREATE INDEX idx_payment_methods_deleted_at ON payment_methods(deleted_at) WHERE deleted_at IS NULL;
```

## Settlement Types Table

**Purpose**: Store settlement type definitions

```sql
CREATE TABLE settlement_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    settlement_type_code VARCHAR(50) NOT NULL,
    settlement_type_name VARCHAR(255) NOT NULL,
    description TEXT,
    settlement_category VARCHAR(50),
    min_discount_percent DECIMAL(5, 2),
    max_discount_percent DECIMAL(5, 2),
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_level VARCHAR(50),
    tax_implication VARCHAR(50),
    accounting_treatment TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, settlement_type_code)
);

-- Indexes
CREATE INDEX idx_settlement_types_tenant_id ON settlement_types(tenant_id);
CREATE INDEX idx_settlement_types_settlement_type_code ON settlement_types(settlement_type_code);
CREATE INDEX idx_settlement_types_settlement_category ON settlement_types(settlement_category);
CREATE INDEX idx_settlement_types_status ON settlement_types(status);
CREATE INDEX idx_settlement_types_deleted_at ON settlement_types(deleted_at) WHERE deleted_at IS NULL;
```

## Document Types Table

**Purpose**: Store document type definitions

```sql
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_type_code VARCHAR(50) NOT NULL,
    document_type_name VARCHAR(255) NOT NULL,
    description TEXT,
    document_category VARCHAR(50),
    entity_type VARCHAR(50),
    is_required BOOLEAN DEFAULT FALSE,
    max_file_size_mb INTEGER,
    allowed_extensions TEXT[],
    retention_days INTEGER,
    is_encrypted BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, document_type_code)
);

-- Indexes
CREATE INDEX idx_document_types_tenant_id ON document_types(tenant_id);
CREATE INDEX idx_document_types_document_type_code ON document_types(document_type_code);
CREATE INDEX idx_document_types_document_category ON document_types(document_category);
CREATE INDEX idx_document_types_entity_type ON document_types(entity_type);
CREATE INDEX idx_document_types_status ON document_types(status);
CREATE INDEX idx_document_types_deleted_at ON document_types(deleted_at) WHERE deleted_at IS NULL;
```

## Notification Templates Table

**Purpose**: Store notification templates for communications

```sql
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    variables JSONB,
    is_system_template BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, template_code, channel, language)
);

-- Indexes
CREATE INDEX idx_notification_templates_tenant_id ON notification_templates(tenant_id);
CREATE INDEX idx_notification_templates_template_code ON notification_templates(template_code);
CREATE INDEX idx_notification_templates_notification_type ON notification_templates(notification_type);
CREATE INDEX idx_notification_templates_channel ON notification_templates(channel);
CREATE INDEX idx_notification_templates_status ON notification_templates(status);
CREATE INDEX idx_notification_templates_deleted_at ON notification_templates(deleted_at) WHERE deleted_at IS NULL;
```

## Communication Channels Table

**Purpose**: Store communication channel configurations

```sql
CREATE TABLE communication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel_code VARCHAR(50) NOT NULL,
    channel_name VARCHAR(255) NOT NULL,
    channel_type VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    configuration JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, channel_code)
);

-- Indexes
CREATE INDEX idx_communication_channels_tenant_id ON communication_channels(tenant_id);
CREATE INDEX idx_communication_channels_channel_code ON communication_channels(channel_code);
CREATE INDEX idx_communication_channels_channel_type ON communication_channels(channel_type);
CREATE INDEX idx_communication_channels_provider ON communication_channels(provider);
CREATE INDEX idx_communication_channels_status ON communication_channels(status);
CREATE INDEX idx_communication_channels_deleted_at ON communication_channels(deleted_at) WHERE deleted_at IS NULL;
```

## Workflow Definitions Table

**Purpose**: Store workflow definitions for business processes

```sql
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_code VARCHAR(50) NOT NULL,
    workflow_name VARCHAR(255) NOT NULL,
    description TEXT,
    workflow_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    version VARCHAR(20) NOT NULL,
    definition JSONB NOT NULL,
    triggers JSONB,
    conditions JSONB,
    actions JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_system_workflow BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, workflow_code, version)
);

-- Indexes
CREATE INDEX idx_workflow_definitions_tenant_id ON workflow_definitions(tenant_id);
CREATE INDEX idx_workflow_definitions_workflow_code ON workflow_definitions(workflow_code);
CREATE INDEX idx_workflow_definitions_workflow_type ON workflow_definitions(workflow_type);
CREATE INDEX idx_workflow_definitions_entity_type ON workflow_definitions(entity_type);
CREATE INDEX idx_workflow_definitions_status ON workflow_definitions(status);
CREATE INDEX idx_workflow_definitions_deleted_at ON workflow_definitions(deleted_at) WHERE deleted_at IS NULL;
```

## AI Model Configuration Table

**Purpose**: Store AI model configurations and versions

```sql
CREATE TABLE ai_model_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    model_code VARCHAR(50) NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    description TEXT,
    model_config JSONB NOT NULL,
    feature_config JSONB,
    training_config JSONB,
    deployment_config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    accuracy_score DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall_score DECIMAL(5, 4),
    f1_score DECIMAL(5, 4),
    trained_at TIMESTAMP WITH TIME ZONE,
    deployed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, model_code, model_version)
);

-- Indexes
CREATE INDEX idx_ai_model_configurations_tenant_id ON ai_model_configurations(tenant_id);
CREATE INDEX idx_ai_model_configurations_model_code ON ai_model_configurations(model_code);
CREATE INDEX idx_ai_model_configurations_model_type ON ai_model_configurations(model_type);
CREATE INDEX idx_ai_model_configurations_model_version ON ai_model_configurations(model_version);
CREATE INDEX idx_ai_model_configurations_status ON ai_model_configurations(status);
CREATE INDEX idx_ai_model_configurations_deleted_at ON ai_model_configurations(deleted_at) WHERE deleted_at IS NULL;
```

---

# SECTION 3: Business Data Model

## Customers Table

**Purpose**: Store customer information

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_code VARCHAR(50) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'individual',
    title VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality CHAR(2) REFERENCES countries(id),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    id_expiry_date DATE,
    tax_id VARCHAR(50),
    pan_number VARCHAR(20),
    aadhaar_number VARCHAR(20),
    primary_address_id UUID REFERENCES addresses(id),
    primary_phone VARCHAR(50),
    primary_email VARCHAR(255),
    secondary_phone VARCHAR(50),
    secondary_email VARCHAR(255),
    preferred_contact_method VARCHAR(50),
    preferred_contact_time VARCHAR(50),
    employment_status VARCHAR(50),
    occupation VARCHAR(100),
    employer_name VARCHAR(255),
    annual_income DECIMAL(15, 2),
    net_income DECIMAL(15, 2),
    credit_score INTEGER,
    credit_score_date DATE,
    risk_score DECIMAL(5, 2),
    risk_level VARCHAR(20),
    customer_segment VARCHAR(50),
    source VARCHAR(50),
    referred_by UUID REFERENCES customers(id),
    relationship_manager_id UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_blacklisted BOOLEAN DEFAULT FALSE,
    blacklist_reason TEXT,
    notes TEXT,
    preferences JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, customer_code)
);

-- Indexes
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_customers_customer_code ON customers(customer_code);
CREATE INDEX idx_customers_display_name ON customers(display_name);
CREATE INDEX idx_customers_primary_phone ON customers(primary_phone);
CREATE INDEX idx_customers_primary_email ON customers(primary_email);
CREATE INDEX idx_customers_id_number ON customers(id_number);
CREATE INDEX idx_customers_risk_level ON customers(risk_level);
CREATE INDEX idx_customers_customer_segment ON customers(customer_segment);
CREATE INDEX idx_customers_relationship_manager_id ON customers(relationship_manager_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_deleted_at ON customers(deleted_at) WHERE deleted_at IS NULL;
```

**Business Rules**
- Customer code must be unique within tenant
- At least one contact method (phone or email) required
- ID number required for identity verification
- Credit score validation (0-850)
- Risk score validation (0-100)
- Blacklisted customers cannot create new loans

## Customer Addresses Table

**Purpose**: Store customer address history

```sql
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id),
    address_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    from_date DATE NOT NULL,
    to_date DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(customer_id, address_id, address_type)
);

-- Indexes
CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX idx_customer_addresses_address_id ON customer_addresses(address_id);
CREATE INDEX idx_customer_addresses_address_type ON customer_addresses(address_type);
CREATE INDEX idx_customer_addresses_is_primary ON customer_addresses(is_primary);
```

## Customer Contacts Table

**Purpose**: Store customer contact information

```sql
CREATE TABLE customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    preferred BOOLEAN DEFAULT FALSE,
    do_not_contact BOOLEAN DEFAULT FALSE,
    dnc_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(customer_id, contact_type, contact_value)
);

-- Indexes
CREATE INDEX idx_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX idx_customer_contacts_contact_type ON customer_contacts(contact_type);
CREATE INDEX idx_customer_contacts_contact_value ON customer_contacts(contact_value);
CREATE INDEX idx_customer_contacts_is_primary ON customer_contacts(is_primary);
CREATE INDEX idx_customer_contacts_do_not_contact ON customer_contacts(do_not_contact);
```

## Customer Employment Table

**Purpose**: Store customer employment information

```sql
CREATE TABLE customer_employment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employment_status VARCHAR(50),
    employment_start_date DATE,
    employment_end_date DATE,
    monthly_income DECIMAL(15, 2),
    work_address_id UUID REFERENCES addresses(id),
    work_phone VARCHAR(50),
    work_email VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    is_current_employment BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_customer_employment_customer_id ON customer_employment(customer_id);
CREATE INDEX idx_customer_employment_employer_name ON customer_employment(employer_name);
CREATE INDEX idx_customer_employment_is_current_employment ON customer_employment(is_current_employment);
```

## Customer References Table

**Purpose**: Store customer reference information

```sql
CREATE TABLE customer_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reference_type VARCHAR(50) NOT NULL,
    reference_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address_id UUID REFERENCES addresses(id),
    occupation VARCHAR(100),
    years_known INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_customer_references_customer_id ON customer_references(customer_id);
CREATE INDEX idx_customer_references_reference_type ON customer_references(reference_type);
CREATE INDEX idx_customer_references_reference_name ON customer_references(reference_name);
```

## Guarantors Table

**Purpose**: Store guarantor information for loans

```sql
CREATE TABLE guarantors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    guarantor_code VARCHAR(50) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    loan_id UUID REFERENCES loans(id),
    title VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    id_expiry_date DATE,
    primary_address_id UUID REFERENCES addresses(id),
    primary_phone VARCHAR(50),
    primary_email VARCHAR(255),
    relationship VARCHAR(100),
    guarantee_type VARCHAR(50),
    guarantee_amount DECIMAL(15, 2),
    guarantee_percentage DECIMAL(5, 2),
    is_primary_guarantor BOOLEAN DEFAULT FALSE,
    is_joint_guarantor BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, guarantor_code)
);

-- Indexes
CREATE INDEX idx_guarantors_tenant_id ON guarantors(tenant_id);
CREATE INDEX idx_guarantors_guarantor_code ON guarantors(guarantor_code);
CREATE INDEX idx_guarantors_customer_id ON guarantors(customer_id);
CREATE INDEX idx_guarantors_loan_id ON guarantors(loan_id);
CREATE INDEX idx_guarantors_id_number ON guarantors(id_number);
CREATE INDEX idx_guarantors_status ON guarantors(status);
CREATE INDEX idx_guarantors_deleted_at ON guarantors(deleted_at) WHERE deleted_at IS NULL;
```

## Loans Table

**Purpose**: Store loan information

```sql
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    loan_number VARCHAR(50) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    loan_type_id UUID REFERENCES loan_types(id),
    loan_purpose VARCHAR(255),
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    interest_type VARCHAR(50) NOT NULL,
    tenure_months INTEGER NOT NULL,
    emi_amount DECIMAL(15, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    first_emi_date DATE,
    disbursement_date DATE,
    disbursement_amount DECIMAL(15, 2),
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    outstanding_interest DECIMAL(15, 2) NOT NULL,
    total_outstanding DECIMAL(15, 2) NOT NULL,
    overdue_amount DECIMAL(15, 2) NOT NULL,
    overdue_days INTEGER NOT NULL,
    last_payment_date DATE,
    next_payment_date DATE,
    payment_frequency VARCHAR(50) NOT NULL,
    payment_day INTEGER,
    processing_fee DECIMAL(15, 2),
    insurance_amount DECIMAL(15, 2),
    collateral_type VARCHAR(50),
    collateral_value DECIMAL(15, 2),
    collateral_description TEXT,
    guarantor_required BOOLEAN DEFAULT FALSE,
    guarantor_count INTEGER DEFAULT 0,
    loan_status VARCHAR(50) NOT NULL,
    recovery_status VARCHAR(50),
    recovery_bucket_id REFERENCES recovery_buckets(id),
    assigned_to UUID REFERENCES users(id),
    relationship_manager_id UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    notes TEXT,
    terms_conditions TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, loan_number)
);

-- Indexes
CREATE INDEX idx_loans_tenant_id ON loans(tenant_id);
CREATE INDEX idx_loans_loan_number ON loans(loan_number);
CREATE INDEX idx_loans_customer_id ON loans(customer_id);
CREATE INDEX idx_loans_loan_type_id ON loans(loan_type_id);
CREATE INDEX idx_loans_loan_status ON loans(loan_status);
CREATE INDEX idx_loans_recovery_status ON loans(recovery_status);
CREATE INDEX idx_loans_recovery_bucket_id ON loans(recovery_bucket_id);
CREATE INDEX idx_loans_assigned_to ON loans(assigned_to);
CREATE INDEX idx_loans_relationship_manager_id ON loans(relationship_manager_id);
CREATE INDEX idx_loans_branch_id ON loans(branch_id);
CREATE INDEX idx_loans_start_date ON loans(start_date);
CREATE INDEX idx_loans_end_date ON loans(end_date);
CREATE INDEX idx_loans_next_payment_date ON loans(next_payment_date);
CREATE INDEX idx_loans_overdue_days ON loans(overdue_days);
CREATE INDEX idx_loans_created_at ON loans(created_at);
CREATE INDEX idx_loans_deleted_at ON loans(deleted_at) WHERE deleted_at IS NULL;
```

**Business Rules**
- Loan number must be unique within tenant
- Principal amount must be positive
- Interest rate must be between loan type min and max
- Tenure must be between loan type min and max
- Outstanding principal cannot exceed principal amount
- Overdue days calculated automatically
- Recovery bucket assigned based on overdue days

## EMI Schedule Table

**Purpose**: Store EMI payment schedule

```sql
CREATE TABLE emi_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    paid_principal DECIMAL(15, 2) NOT NULL,
    paid_interest DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) NOT NULL,
    balance_amount DECIMAL(15, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    paid_date DATE,
    payment_id UUID REFERENCES payments(id),
    days_overdue INTEGER,
    late_fee DECIMAL(15, 2),
    penalty_amount DECIMAL(15, 2),
    waived_amount DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(loan_id, installment_number)
);

-- Indexes
CREATE INDEX idx_emi_schedule_loan_id ON emi_schedule(loan_id);
CREATE INDEX idx_emi_schedule_due_date ON emi_schedule(due_date);
CREATE INDEX idx_emi_schedule_payment_status ON emi_schedule(payment_status);
CREATE INDEX idx_emi_schedule_paid_date ON emi_schedule(paid_date);
CREATE INDEX idx_emi_schedule_days_overdue ON emi_schedule(days_overdue);
```

**Business Rules**
- Installment number must be sequential
- Due date calculated based on start date and payment frequency
- Total amount = principal + interest
- Balance amount = total - paid
- Payment status updated when payment received
- Late fee calculated based on overdue days

## Outstanding Balance Table

**Purpose**: Track daily outstanding balance (time-series data)

```sql
CREATE TABLE outstanding_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    as_of_date DATE NOT NULL,
    principal_balance DECIMAL(15, 2) NOT NULL,
    interest_balance DECIMAL(15, 2) NOT NULL,
    fee_balance DECIMAL(15, 2) NOT NULL,
    penalty_balance DECIMAL(15, 2) NOT NULL,
    total_balance DECIMAL(15, 2) NOT NULL,
    overdue_balance DECIMAL(15, 2) NOT NULL,
    days_overdue INTEGER NOT NULL,
    recovery_bucket_id REFERENCES recovery_buckets(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(loan_id, as_of_date)
);

-- Indexes
CREATE INDEX idx_outstanding_balance_loan_id ON outstanding_balance(loan_id);
CREATE INDEX idx_outstanding_balance_as_of_date ON outstanding_balance(as_of_date);
CREATE INDEX idx_outstanding_balance_recovery_bucket_id ON outstanding_balance(recovery_bucket_id);
CREATE INDEX idx_outstanding_balance_days_overdue ON outstanding_balance(days_overdue);
```

## Recovery Cases Table

**Purpose**: Store recovery case information

```sql
CREATE TABLE recovery_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_number VARCHAR(50) NOT NULL,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    case_type VARCHAR(50) NOT NULL,
    case_priority VARCHAR(20) NOT NULL,
    case_status VARCHAR(50) NOT NULL,
    recovery_strategy VARCHAR(50),
    assigned_to UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    branch_id UUID REFERENCES branches(id),
    assigned_date DATE NOT NULL,
    expected_resolution_date DATE,
    actual_resolution_date DATE,
    escalation_level INTEGER DEFAULT 0,
    escalated_to UUID REFERENCES users(id),
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalation_reason TEXT,
    total_outstanding DECIMAL(15, 2) NOT NULL,
    recovered_amount DECIMAL(15, 2) NOT NULL,
    recovery_percentage DECIMAL(5, 2),
    last_action_date DATE,
    last_action_type VARCHAR(50),
    next_action_date DATE,
    next_action_type VARCHAR(50),
    communication_count INTEGER DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    payment_count INTEGER DEFAULT 0,
    legal_action_count INTEGER DEFAULT 0,
    risk_score DECIMAL(5, 2),
    recovery_probability DECIMAL(5, 2),
    ai_recommendations JSONB,
    notes TEXT,
    resolution_summary TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, case_number)
);

-- Indexes
CREATE INDEX idx_recovery_cases_tenant_id ON recovery_cases(tenant_id);
CREATE INDEX idx_recovery_cases_case_number ON recovery_cases(case_number);
CREATE INDEX idx_recovery_cases_loan_id ON recovery_cases(loan_id);
CREATE INDEX idx_recovery_cases_customer_id ON recovery_cases(customer_id);
CREATE INDEX idx_recovery_cases_case_type ON recovery_cases(case_type);
CREATE INDEX idx_recovery_cases_case_priority ON recovery_cases(case_priority);
CREATE INDEX idx_recovery_cases_case_status ON recovery_cases(case_status);
CREATE INDEX idx_recovery_cases_assigned_to ON recovery_cases(assigned_to);
CREATE INDEX idx_recovery_cases_team_id ON recovery_cases(team_id);
CREATE INDEX idx_recovery_cases_branch_id ON recovery_cases(branch_id);
CREATE INDEX idx_recovery_cases_assigned_date ON recovery_cases(assigned_date);
CREATE INDEX idx_recovery_cases_expected_resolution_date ON recovery_cases(expected_resolution_date);
CREATE INDEX idx_recovery_cases_escalation_level ON recovery_cases(escalation_level);
CREATE INDEX idx_recovery_cases_risk_score ON recovery_cases(risk_score);
CREATE INDEX idx_recovery_cases_recovery_probability ON recovery_cases(recovery_probability);
CREATE INDEX idx_recovery_cases_next_action_date ON recovery_cases(next_action_date);
CREATE INDEX idx_recovery_cases_created_at ON recovery_cases(created_at);
CREATE INDEX idx_recovery_cases_deleted_at ON recovery_cases(deleted_at) WHERE deleted_at IS NULL;
```

**Business Rules**
- Case number must be unique within tenant
- Case must be assigned to a user or team
- Escalation level increases on each escalation
- Recovery percentage = recovered / total * 100
- Risk score updated by AI
- Recovery probability updated by AI

## Follow-ups Table

**Purpose**: Store follow-up schedules and records

```sql
CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    follow_up_number VARCHAR(50) NOT NULL,
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    follow_up_type VARCHAR(50) NOT NULL,
    follow_up_method VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    completed_date DATE,
    completed_time TIME,
    outcome VARCHAR(50),
    next_follow_up_date DATE,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, follow_up_number)
);

-- Indexes
CREATE INDEX idx_follow_ups_tenant_id ON follow_ups(tenant_id);
CREATE INDEX idx_follow_ups_follow_up_number ON follow_ups(follow_up_number);
CREATE INDEX idx_follow_ups_case_id ON follow_ups(case_id);
CREATE INDEX idx_follow_ups_loan_id ON follow_ups(loan_id);
CREATE INDEX idx_follow_ups_customer_id ON follow_ups(customer_id);
CREATE INDEX idx_follow_ups_follow_up_type ON follow_ups(follow_up_type);
CREATE INDEX idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX idx_follow_ups_assigned_to ON follow_ups(assigned_to);
CREATE INDEX idx_follow_ups_priority ON follow_ups(priority);
CREATE INDEX idx_follow_ups_status ON follow_ups(status);
CREATE INDEX idx_follow_ups_completed_date ON follow_ups(completed_date);
CREATE INDEX idx_follow_ups_next_follow_up_date ON follow_ups(next_follow_up_date);
CREATE INDEX idx_follow_ups_deleted_at ON follow_ups(deleted_at) WHERE deleted_at IS NULL;
```

## Tasks Table

**Purpose**: Store task information for users

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    task_number VARCHAR(50) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    task_category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    due_time TIME,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    completed_date TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id),
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    tags TEXT[],
    attachments JSONB,
    checklist JSONB,
    recurring_task_id UUID REFERENCES tasks(id),
    parent_task_id UUID REFERENCES tasks(id),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, task_number)
);

-- Indexes
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_task_number ON tasks(task_number);
CREATE INDEX idx_tasks_task_type ON tasks(task_type);
CREATE INDEX idx_tasks_task_category ON tasks(task_category);
CREATE INDEX idx_tasks_related_entity_type ON tasks(related_entity_type);
CREATE INDEX idx_tasks_related_entity_id ON tasks(related_entity_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_completed_date ON tasks(completed_date);
CREATE INDEX idx_tasks_recurring_task_id ON tasks(recurring_task_id);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL;
```

## Call Logs Table

**Purpose**: Store call communication logs

```sql
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    call_type VARCHAR(50) NOT NULL,
    call_direction VARCHAR(20) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    call_duration_seconds INTEGER,
    call_status VARCHAR(20) NOT NULL,
    call_outcome VARCHAR(50),
    call_purpose VARCHAR(255),
    call_notes TEXT,
    recording_url VARCHAR(500),
    transcription TEXT,
    sentiment_score DECIMAL(5, 2),
    sentiment_label VARCHAR(20),
    keywords TEXT[],
    compliance_score DECIMAL(5, 2),
    called_by UUID NOT NULL REFERENCES users(id),
    call_start_time TIMESTAMP WITH TIME ZONE,
    call_end_time TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_call_logs_tenant_id ON call_logs(tenant_id);
CREATE INDEX idx_call_logs_case_id ON call_logs(case_id);
CREATE INDEX idx_call_logs_loan_id ON call_logs(loan_id);
CREATE INDEX idx_call_logs_customer_id ON call_logs(customer_id);
CREATE INDEX idx_call_logs_call_type ON call_logs(call_type);
CREATE INDEX idx_call_logs_call_direction ON call_logs(call_direction);
CREATE INDEX idx_call_logs_call_status ON call_logs(call_status);
CREATE INDEX idx_call_logs_called_by ON call_logs(called_by);
CREATE INDEX idx_call_logs_call_start_time ON call_logs(call_start_time);
CREATE INDEX idx_call_logs_sentiment_label ON call_logs(sentiment_label);
```

## Visit Logs Table

**Purpose**: Store field visit logs

```sql
CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL,
    visit_purpose VARCHAR(255),
    visit_address_id UUID REFERENCES addresses(id),
    visit_date DATE NOT NULL,
    visit_start_time TIMESTAMP WITH TIME ZONE,
    visit_end_time TIMESTAMP WITH TIME ZONE,
    visit_duration_minutes INTEGER,
    visit_status VARCHAR(20) NOT NULL,
    visit_outcome VARCHAR(50),
    visit_notes TEXT,
    photos JSONB,
    gps_location_latitude DECIMAL(10, 8),
    gps_location_longitude DECIMAL(11, 8),
    distance_km DECIMAL(10, 2),
    visited_by UUID NOT NULL REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_visit_logs_tenant_id ON visit_logs(tenant_id);
CREATE INDEX idx_visit_logs_case_id ON visit_logs(case_id);
CREATE INDEX idx_visit_logs_loan_id ON visit_logs(loan_id);
CREATE INDEX idx_visit_logs_customer_id ON visit_logs(customer_id);
CREATE INDEX idx_visit_logs_visit_type ON visit_logs(visit_type);
CREATE INDEX idx_visit_logs_visit_date ON visit_logs(visit_date);
CREATE INDEX idx_visit_logs_visit_status ON visit_logs(visit_status);
CREATE INDEX idx_visit_logs_visited_by ON visit_logs(visited_by);
```

## SMS History Table

**Purpose**: Store SMS communication history

```sql
CREATE TABLE sms_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    sms_type VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    template_id UUID REFERENCES notification_templates(id),
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    delivery_status VARCHAR(20),
    cost DECIMAL(10, 2),
    sent_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sms_history_tenant_id ON sms_history(tenant_id);
CREATE INDEX idx_sms_history_case_id ON sms_history(case_id);
CREATE INDEX idx_sms_history_loan_id ON sms_history(loan_id);
CREATE INDEX idx_sms_history_customer_id ON sms_history(customer_id);
CREATE INDEX idx_sms_history_sms_type ON sms_history(sms_type);
CREATE INDEX idx_sms_history_phone_number ON sms_history(phone_number);
CREATE INDEX idx_sms_history_status ON sms_history(status);
CREATE INDEX idx_sms_history_sent_at ON sms_history(sent_at);
CREATE INDEX idx_sms_history_sent_by ON sms_history(sent_by);
```

## Email History Table

**Purpose**: Store email communication history

```sql
CREATE TABLE email_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    cc_email TEXT[],
    bcc_email TEXT[],
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    template_id UUID REFERENCES notification_templates(id),
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    sent_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_email_history_tenant_id ON email_history(tenant_id);
CREATE INDEX idx_email_history_case_id ON email_history(case_id);
CREATE INDEX idx_email_history_loan_id ON email_history(loan_id);
CREATE INDEX idx_email_history_history_customer_id ON email_history(customer_id);
CREATE INDEX idx_email_history_email_type ON email_history(email_type);
CREATE INDEX idx_email_history_to_email ON email_history(to_email);
CREATE INDEX idx_email_history_status ON email_history(status);
CREATE INDEX idx_email_history_sent_at ON email_history(sent_at);
CREATE INDEX idx_email_history_sent_by ON email_history(sent_by);
```

## WhatsApp History Table

**Purpose**: Store WhatsApp communication history

```sql
CREATE TABLE whatsapp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    media_url VARCHAR(500),
    media_type VARCHAR(50),
    template_id UUID REFERENCES notification_templates(id),
    status VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    sent_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_whatsapp_history_tenant_id ON whatsapp_history(tenant_id);
CREATE INDEX idx_whatsapp_history_case_id ON whatsapp_history(case_id);
CREATE INDEX idx_whatsapp_history_loan_id ON whatsapp_history(loan_id);
CREATE INDEX idx_whatsapp_history_customer_id ON whatsapp_history(customer_id);
CREATE INDEX idx_whatsapp_history_message_type ON whatsapp_history(message_type);
CREATE INDEX idx_whatsapp_history_phone_number ON whatsapp_history(phone_number);
CREATE INDEX idx_whatsapp_history_status ON whatsapp_history(status);
CREATE INDEX idx_whatsapp_history_sent_at ON whatsapp_history(sent_at);
CREATE INDEX idx_whatsapp_history_sent_by ON whatsapp_history(sent_by);
```

## Documents Table

**Purpose**: Store document information and metadata

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_number VARCHAR(50) NOT NULL,
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    document_name VARCHAR(500) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    file_url VARCHAR(500),
    file_hash VARCHAR(255),
    is_encrypted BOOLEAN DEFAULT FALSE,
    encryption_key_id VARCHAR(255),
    document_status VARCHAR(20) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    expiry_date DATE,
    tags TEXT[],
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, document_number)
);

-- Indexes
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_documents_document_number ON documents(document_number);
CREATE INDEX idx_documents_document_type_id ON documents(document_type_id);
CREATE INDEX idx_documents_entity_type ON documents(entity_type);
CREATE INDEX idx_documents_entity_id ON documents(entity_id);
CREATE INDEX idx_documents_document_status ON documents(document_status);
CREATE INDEX idx_documents_verified ON documents(verified);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NULL;
```

## Payments Table

**Purpose**: Store payment information

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payment_number VARCHAR(50) NOT NULL,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id),
    payment_type VARCHAR(50) NOT NULL,
    payment_method_id UUID REFERENCES payment_methods(id),
    payment_amount DECIMAL(15, 2) NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    fee_amount DECIMAL(15, 2),
    penalty_amount DECIMAL(15, 2),
    waived_amount DECIMAL(15, 2),
    payment_date DATE NOT NULL,
    payment_time TIME,
    received_by UUID REFERENCES users(id),
    reference_number VARCHAR(100),
    transaction_id VARCHAR(100),
    bank_name VARCHAR(255),
    bank_account VARCHAR(50),
    cheque_number VARCHAR(50),
    cheque_date DATE,
    utr_number VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL,
    reconciliation_status VARCHAR(20),
    reconciliation_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, payment_number)
);

-- Indexes
CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_payments_payment_number ON payments(payment_number);
CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_case_id ON payments(case_id);
CREATE INDEX idx_payments_payment_type ON payments(payment_type);
CREATE INDEX idx_payments_payment_method_id ON payments(payment_method_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
CREATE INDEX idx_payments_reconciliation_status ON payments(reconciliation_status);
CREATE INDEX idx_payments_reference_number ON payments(reference_number);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_received_by ON payments(received_by);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_deleted_at ON payments(deleted_at) WHERE deleted_at IS NULL;
```

**Business Rules**
- Payment number must be unique within tenant
- Payment amount = principal + interest + fee + penalty - waived
- Payment status updated automatically
- Reconciliation status updated after bank reconciliation
- Reference number must be unique for bank transfers

## Payment Allocations Table

**Purpose**: Store payment allocation details

```sql
CREATE TABLE payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    emi_schedule_id UUID REFERENCES emi_schedule(id),
    allocation_type VARCHAR(50) NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    fee_amount DECIMAL(15, 2),
    penalty_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2) NOT NULL,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    allocated_by UUID REFERENCES users(id),
    notes TEXT
);

-- Indexes
CREATE INDEX idx_payment_allocations_payment_id ON payment_allocations(payment_id);
CREATE INDEX idx_payment_allocations_loan_id ON payment_allocations(loan_id);
CREATE INDEX idx_payment_allocations_emi_schedule_id ON payment_allocations(emi_schedule_id);
CREATE INDEX idx_payment_allocations_allocation_type ON payment_allocations(allocation_type);
CREATE INDEX idx_payment_allocations_allocated_at ON payment_allocations(allocated_at);
```

## Settlements Table

**Purpose**: Store settlement information

```sql
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    settlement_number VARCHAR(50) NOT NULL,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    case_id UUID REFERENCES recovery_cases(id),
    settlement_type_id UUID REFERENCES settlement_types(id),
    original_outstanding DECIMAL(15, 2) NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    settlement_terms TEXT,
    payment_plan JSONB,
    settlement_status VARCHAR(20) NOT NULL,
    proposed_date DATE,
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    completed_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, settlement_number)
);

-- Indexes
CREATE INDEX idx_settlements_tenant_id ON settlements(tenant_id);
CREATE INDEX idx_settlements_settlement_number ON settlements(settlement_number);
CREATE INDEX idx_settlements_loan_id ON settlements(loan_id);
CREATE INDEX idx_settlements_customer_id ON settlements(customer_id);
CREATE INDEX idx_settlements_case_id ON settlements(case_id);
CREATE INDEX idx_settlements_settlement_type_id ON settlements(settlement_type_id);
CREATE INDEX idx_settlements_settlement_status ON settlements(settlement_status);
CREATE INDEX idx_settlements_proposed_date ON settlements(proposed_date);
CREATE INDEX idx_settlements_approved_date ON settlements(approved_date);
CREATE INDEX idx_settlements_completed_date ON settlements(completed_date);
CREATE INDEX idx_settlements_deleted_at ON settlements(deleted_at) WHERE deleted_at IS NULL;
```

## Legal Cases Table

**Purpose**: Store legal case information

```sql
CREATE TABLE legal_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    legal_case_number VARCHAR(50) NOT NULL,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    recovery_case_id UUID REFERENCES recovery_cases(id),
    case_type VARCHAR(50) NOT NULL,
    case_category VARCHAR(50),
    court_name VARCHAR(255),
    court_location VARCHAR(255),
    case_number VARCHAR(100),
    filing_date DATE,
    case_status VARCHAR(20) NOT NULL,
    case_outcome VARCHAR(50),
    outcome_date DATE,
    assigned_lawyer_id UUID REFERENCES users(id),
    assigned_lawyer_firm VARCHAR(255),
    external_lawyer BOOLEAN DEFAULT FALSE,
    lawyer_contact VARCHAR(255),
    principal_claim DECIMAL(15, 2),
    interest_claim DECIMAL(15, 2),
    legal_fees DECIMAL(15, 2),
    other_expenses DECIMAL(15, 2),
    total_claim DECIMAL(15, 2),
    amount_recovered DECIMAL(15, 2),
    recovery_percentage DECIMAL(5, 2),
    next_hearing_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, legal_case_number)
);

-- Indexes
CREATE INDEX idx_legal_cases_tenant_id ON legal_cases(tenant_id);
CREATE INDEX idx_legal_cases_legal_case_number ON legal_cases(legal_case_number);
CREATE INDEX idx_legal_cases_loan_id ON legal_cases(loan_id);
CREATE INDEX idx_legal_cases_customer_id ON legal_cases(customer_id);
CREATE INDEX idx_legal_cases_recovery_case_id ON legal_cases(recovery_case_id);
CREATE INDEX idx_legal_cases_case_type ON legal_cases(case_type);
CREATE INDEX idx_legal_cases_case_status ON legal_cases(case_status);
CREATE INDEX idx_legal_cases_assigned_lawyer_id ON legal_cases(assigned_lawyer_id);
CREATE INDEX idx_legal_cases_filing_date ON legal_cases(filing_date);
CREATE INDEX idx_legal_cases_next_hearing_date ON legal_cases(next_hearing_date);
CREATE INDEX idx_legal_cases_deleted_at ON legal_cases(deleted_at) WHERE deleted_at IS NULL;
```

## Court Hearings Table

**Purpose**: Store court hearing information

```sql
CREATE TABLE court_hearings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_case_id UUID NOT NULL REFERENCES legal_cases(id) ON DELETE CASCADE,
    hearing_number VARCHAR(50) NOT NULL,
    hearing_type VARCHAR(50) NOT NULL,
    hearing_date DATE NOT NULL,
    hearing_time TIME,
    court_room VARCHAR(100),
    judge_name VARCHAR(255),
    hearing_purpose TEXT,
    hearing_outcome VARCHAR(50),
    next_hearing_date DATE,
    notes TEXT,
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(legal_case_id, hearing_number)
);

-- Indexes
CREATE INDEX idx_court_hearings_legal_case_id ON court_hearings(legal_case_id);
CREATE INDEX idx_court_hearings_hearing_number ON court_hearings(hearing_number);
CREATE INDEX idx_court_hearings_hearing_type ON court_hearings(hearing_type);
CREATE INDEX idx_court_hearings_hearing_date ON court_hearings(hearing_date);
CREATE INDEX idx_court_hearings_hearing_outcome ON court_hearings(hearing_outcome);
```

## Expenses Table

**Purpose**: Store legal and recovery expenses

```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    expense_number VARCHAR(50) NOT NULL,
    expense_type VARCHAR(50) NOT NULL,
    expense_category VARCHAR(50),
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expense_date DATE NOT NULL,
    description TEXT,
    vendor_name VARCHAR(255),
    vendor_invoice_number VARCHAR(100),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    reimbursement_status VARCHAR(20),
    reimbursed_amount DECIMAL(15, 2),
    reimbursed_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, expense_number)
);

-- Indexes
CREATE INDEX idx_expenses_tenant_id ON expenses(tenant_id);
CREATE INDEX idx_expenses_expense_number ON expenses(expense_number);
CREATE INDEX idx_expenses_expense_type ON expenses(expense_type);
CREATE INDEX idx_expenses_expense_category ON expenses(expense_category);
CREATE INDEX idx_expenses_related_entity_type ON expenses(related_entity_type);
CREATE INDEX idx_expenses_related_entity_id ON expenses(related_entity_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_approved_by ON expenses(approved_by);
CREATE INDEX idx_expenses_deleted_at ON expenses(deleted_at) WHERE deleted_at IS NULL;
```

## AI Predictions Table

**Purpose**: Store AI prediction results

```sql
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50) NOT NULL,
    model_id UUID NOT NULL REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    prediction_value DECIMAL(10, 4) NOT NULL,
    prediction_label VARCHAR(100),
    confidence_score DECIMAL(5, 4),
    features JSONB,
    prediction_date DATE NOT NULL,
    prediction_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by UUID REFERENCES users(id),
    actual_value DECIMAL(10, 4),
    actual_label VARCHAR(100),
    accuracy_score DECIMAL(5, 4),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ai_predictions_tenant_id ON ai_predictions(tenant_id);
CREATE INDEX idx_ai_predictions_prediction_type ON ai_predictions(prediction_type);
CREATE INDEX idx_ai_predictions_model_id ON ai_predictions(model_id);
CREATE INDEX idx_ai_predictions_entity_type ON ai_predictions(entity_type);
CREATE INDEX idx_ai_predictions_entity_id ON ai_predictions(entity_id);
CREATE INDEX idx_ai_predictions_prediction_date ON ai_predictions(prediction_date);
CREATE INDEX idx_ai_predictions_confidence_score ON ai_predictions(confidence_score);
CREATE INDEX idx_ai_predictions_is_valid ON ai_predictions(is_valid);
```

## AI Recommendations Table

**Purpose**: Store AI-generated recommendations

```sql
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    model_id UUID NOT NULL REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    recommendation_text TEXT NOT NULL,
    recommendation_priority VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(5, 4),
    reasoning TEXT,
    expected_outcome TEXT,
    action_items JSONB,
    recommendation_date DATE NOT NULL,
    recommendation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_accepted BOOLEAN,
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    actual_outcome TEXT,
    effectiveness_score DECIMAL(5, 4),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ai_recommendations_tenant_id ON ai_recommendations(tenant_id);
CREATE INDEX idx_ai_recommendations_recommendation_type ON ai_recommendations(recommendation_type);
CREATE INDEX idx_ai_recommendations_model_id ON ai_recommendations(model_id);
CREATE INDEX idx_ai_recommendations_entity_type ON ai_recommendations(entity_type);
CREATE INDEX idx_ai_recommendations_entity_id ON ai_recommendations(entity_id);
CREATE INDEX idx_ai_recommendations_recommendation_priority ON ai_recommendations(recommendation_priority);
CREATE INDEX idx_ai_recommendations_recommendation_date ON ai_recommendations(recommendation_date);
CREATE INDEX idx_ai_recommendations_is_accepted ON ai_recommendations(is_accepted);
```

---

# SECTION 4: Audit Tables

## Audit Log Table

**Purpose**: Store comprehensive audit logs for all data changes

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_from VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(100),
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_audit_log_tenant_id ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_changed_by ON audit_log(changed_by);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
CREATE INDEX idx_audit_log_request_id ON audit_log(request_id);
```

**Retention Policy**: 7 years for compliance, then archive to cold storage

## Login History Table

**Purpose**: Store user login history for security monitoring

```sql
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id),
    login_time TIMESTAMP WITH TIME ZONE NOT NULL,
    logout_time TIMESTAMP WITH TIME ZONE,
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    login_status VARCHAR(20) NOT NULL,
    failure_reason TEXT,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_tenant_id ON login_history(tenant_id);
CREATE INDEX idx_login_history_login_time ON login_history(login_time);
CREATE INDEX idx_login_history_ip_address ON login_history(ip_address);
CREATE INDEX idx_login_history_login_status ON login_history(login_status);
```

**Retention Policy**: 2 years, then archive

## Data Change History Table

**Purpose**: Store detailed history for critical data changes

```sql
CREATE TABLE data_change_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    change_type VARCHAR(20) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    change_reason TEXT,
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_data_change_history_tenant_id ON data_change_history(tenant_id);
CREATE INDEX idx_data_change_history_entity_type ON data_change_history(entity_type);
CREATE INDEX idx_data_change_history_entity_id ON data_change_history(entity_id);
CREATE INDEX idx_data_change_history_change_type ON data_change_history(change_type);
CREATE INDEX idx_data_change_history_changed_by ON data_change_history(changed_by);
CREATE INDEX idx_data_change_history_changed_at ON data_change_history(changed_at);
```

**Retention Policy**: 5 years for critical data, then archive

## Approval History Table

**Purpose**: Store approval workflow history

```sql
CREATE TABLE approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    approval_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    approval_level INTEGER NOT NULL,
    approver_id UUID REFERENCES users(id),
    approval_status VARCHAR(20) NOT NULL,
    approval_comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_approval_history_tenant_id ON approval_history(tenant_id);
CREATE INDEX idx_approval_history_approval_type ON approval_history(approval_type);
CREATE INDEX idx_approval_history_entity_type ON approval_history(entity_type);
CREATE INDEX idx_approval_history_entity_id ON approval_history(entity_id);
CREATE INDEX idx_approval_history_approver_id ON approval_history(approver_id);
CREATE INDEX idx_approval_history_approval_status ON approval_history(approval_status);
CREATE INDEX idx_approval_history_approved_at ON approval_history(approved_at);
```

**Retention Policy**: 7 years for compliance

## API Logs Table

**Purpose**: Store API request/response logs for monitoring

```sql
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    request_method VARCHAR(10) NOT NULL,
    request_path VARCHAR(500) NOT NULL,
    request_headers JSONB,
    request_body TEXT,
    response_status INTEGER NOT NULL,
    response_headers JSONB,
    response_body TEXT,
    response_time_ms INTEGER,
    request_time TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    error_message TEXT,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_api_logs_tenant_id ON api_logs(tenant_id);
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_request_method ON api_logs(request_method);
CREATE INDEX idx_api_logs_request_path ON api_logs(request_path);
CREATE INDEX idx_api_logs_response_status ON api_logs(response_status);
CREATE INDEX idx_api_logs_request_time ON api_logs(request_time);
CREATE INDEX idx_api_logs_ip_address ON api_logs(ip_address);
```

**Retention Policy**: 90 days, then archive

## Security Events Table

**Purpose**: Store security events for monitoring and compliance

```sql
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_severity VARCHAR(20) NOT NULL,
    event_description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    event_data JSONB,
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_security_events_tenant_id ON security_events(tenant_id);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_event_severity ON security_events(event_severity);
CREATE INDEX idx_security_events_event_time ON security_events(event_time);
CREATE INDEX idx_security_events_is_resolved ON security_events(is_resolved);
```

**Retention Policy**: 5 years for compliance

## User Sessions Table

**Purpose**: Store active user session information

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id),
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    device_type VARCHAR(50),
    device_id VARCHAR(255),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address VARCHAR(45),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    login_time TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP WITH TIME ZONE,
    session_status VARCHAR(20) NOT NULL,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_tenant_id ON user_sessions(tenant_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_device_id ON user_sessions(device_id);
CREATE INDEX idx_user_sessions_ip_address ON user_sessions(ip_address);
CREATE INDEX idx_user_sessions_login_time ON user_sessions(login_time);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity);
CREATE INDEX idx_user_sessions_session_status ON user_sessions(session_status);
```

**Retention Policy**: 30 days for active sessions, 1 year for historical data

---

# SECTION 5: Relationships

## ER Diagram

```
┌─────────────┐
│   tenants    │
└──────┬──────┘
       │
       ├──────────────────────────────────────────────────────────────┐
       │                                                              │
┌──────▼──────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  companies   │  │    users     │  │  customers   │  │    loans     │
└──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘
       │                 │                  │                  │
       │                 │                  │                  │
┌──────▼──────┐  ┌──────▼───────┐  ┌──────▼──────┐  ┌──────▼──────┐
│  branches   │  │   roles      │  │ customer_    │  │ emi_         │
└─────────────┘  └──────┬───────┘  │ addresses   │  │ schedule     │
                      │          └─────────────┘  └─────────────┘
                      │                  │
                      │                  │
              ┌───────▼────────┐  ┌──────▼──────┐
              │  user_roles    │  │ customer_    │
              └─────────────────┘  │ contacts    │
                                     └─────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ recovery_    │  │ follow_ups    │  │ payments      │  │ legal_cases   │
│ cases        │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
└──────┬───────┘         │                  │                  │
       │                 │                  │                  │
       │                 │                  │                  │
┌──────▼──────┐  ┌──────▼───────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ call_logs    │  │ sms_history   │  │ payment_     │  │ court_      │
│ visit_logs   │  │ email_history │  │ allocations  │  │ hearings     │
└─────────────┘  └───────────────┘  └─────────────┘  └─────────────┘
```

## One-to-One Relationships

**Users ↔ User Profiles**
- Each user has one profile
- Optional relationship

**Loans ↔ Primary Recovery Case**
- Each loan has one primary recovery case
- Optional relationship

**Customers ↔ Primary Address**
- Each customer has one primary address
- Optional relationship

## One-to-Many Relationships

**Tenants → Companies**
- One tenant has many companies
- CASCADE DELETE on tenant

**Companies → Branches**
- One company has many branches
- CASCADE DELETE on company

**Branches → Users**
- One branch has many users
- SET NULL on branch delete

**Users → Tasks**
- One user can have many tasks
- CASCADE DELETE on user

**Customers → Loans**
- One customer can have many loans
- CASCADE DELETE on customer

**Loans → EMI Schedule**
- One loan has many EMI installments
- CASCADE DELETE on loan

**Loans → Recovery Cases**
- One loan can have multiple recovery cases
- CASCADE DELETE on loan

**Recovery Cases → Follow-ups**
- One recovery case can have many follow-ups
- CASCADE DELETE on case

**Recovery Cases → Call Logs**
- One recovery case can have many call logs
- CASCADE DELETE on case

**Payments → Payment Allocations**
- One payment can have multiple allocations
- CASCADE DELETE on payment

**Legal Cases → Court Hearings**
- One legal case can have many hearings
- CASCADE DELETE on case

## Many-to-Many Relationships

**Users ↔ Roles**
- Junction table: user_roles
- CASCADE DELETE on both sides

**Roles ↔ Permissions**
- Junction table: role_permissions
- CASCADE DELETE on both sides

**Customers ↔ Guarantors**
- Junction table: guarantors (with loan_id)
- CASCADE DELETE on customer

**Users ↔ Teams**
- Junction table: team_members (if needed)
- CASCADE DELETE on user

## Junction Tables

**user_roles**
- user_id (FK to users)
- role_id (FK to roles)
- UNIQUE(user_id, role_id)

**role_permissions**
- role_id (FK to roles)
- permission_id (FK to permissions)
- UNIQUE(role_id, permission_id)

## Cascading Rules

**CASCADE DELETE**
- tenant_id in all child tables
- customer_id in loans, recovery cases
- loan_id in EMI schedule, recovery cases, payments
- user_id in user_roles, tasks, call logs

**SET NULL**
- branch_id in users
- manager_id in teams
- assigned_to in recovery cases

**NO ACTION**
- Critical relationships that require manual handling
- Financial transactions
- Audit records

---

# SECTION 6: Indexes

## Search Indexes

**Customer Search**
```sql
CREATE INDEX idx_customers_search_name ON customers USING gin(to_tsvector('english', display_name));
CREATE INDEX idx_customers_search_phone ON customers USING gin(to_tsvector('english', primary_phone));
CREATE INDEX idx_customers_search_email ON customers USING gin(to_tsvector('english', primary_email));
```

**Loan Search**
```sql
CREATE INDEX idx_loans_search_number ON loans USING gin(to_tsvector('english', loan_number));
CREATE INDEX idx_loans_search_customer ON loans(customer_id);
CREATE INDEX idx_loans_search_status ON loans(loan_status, recovery_status);
```

**Case Search**
```sql
CREATE INDEX idx_recovery_cases_search_number ON recovery_cases USING gin(to_tsvector('english', case_number));
CREATE INDEX idx_recovery_cases_search_customer ON recovery_cases(customer_id);
CREATE INDEX idx_recovery_cases_search_status ON recovery_cases(case_status, case_priority);
```

## Dashboard Indexes

**KPI Calculations**
```sql
CREATE INDEX idx_loans_dashboard ON loans(tenant_id, loan_status, start_date);
CREATE INDEX idx_payments_dashboard ON payments(tenant_id, payment_date, payment_status);
CREATE INDEX idx_recovery_cases_dashboard ON recovery_cases(tenant_id, case_status, assigned_date);
CREATE INDEX idx_customers_dashboard ON customers(tenant_id, customer_segment, status);
```

## Report Indexes

**Reporting Queries**
```sql
CREATE INDEX idx_payments_report ON payments(tenant_id, payment_date, payment_type, payment_status);
CREATE INDEX idx_loans_report ON loans(tenant_id, loan_type_id, loan_status, start_date);
CREATE INDEX idx_recovery_cases_report ON recovery_cases(tenant_id, case_type, case_status, created_at);
CREATE INDEX idx_call_logs_report ON call_logs(tenant_id, call_type, call_status, call_start_time);
```

## AI Indexes

**AI Queries**
```sql
CREATE INDEX idx_ai_predictions_entity ON ai_predictions(entity_type, entity_id, prediction_type, prediction_date);
CREATE INDEX idx_ai_recommendations_entity ON ai_recommendations(entity_type, entity_id, recommendation_type, recommendation_date);
CREATE INDEX idx_ai_predictions_confidence ON ai_predictions(confidence_score) WHERE confidence_score > 0.7;
```

## Payment Indexes

**Payment Processing**
```sql
CREATE INDEX idx_payments_processing ON payments(tenant_id, payment_date, payment_status, reconciliation_status);
CREATE INDEX idx_payments_reference ON payments(tenant_id, reference_number) WHERE reference_number IS NOT NULL;
CREATE INDEX idx_payments_transaction ON payments(tenant_id, transaction_id) WHERE transaction_id IS NOT NULL;
```

## Customer Indexes

**Customer Operations**
```sql
CREATE INDEX idx_customers_operations ON customers(tenant_id, status, created_at);
CREATE INDEX idx_customers_segment ON customers(tenant_id, customer_segment, risk_level);
CREATE INDEX idx_customers_manager ON customers(tenant_id, relationship_manager_id, status);
```

## Recovery Case Indexes

**Case Management**
```sql
CREATE INDEX idx_recovery_cases_management ON recovery_cases(tenant_id, case_status, assigned_to, next_action_date);
CREATE INDEX idx_recovery_cases_priority ON recovery_cases(tenant_id, case_priority, case_status, escalation_level);
CREATE INDEX idx_recovery_cases_aging ON recovery_cases(tenant_id, case_status, assigned_date);
```

---

# SECTION 7: Database Performance

## Query Optimization

**Query Optimization Techniques**
- Use EXPLAIN ANALYZE for query analysis
- Optimize JOIN order
- Use appropriate JOIN types
- Limit result sets with LIMIT
- Use subqueries appropriately
- Use CTEs for complex queries
- Avoid SELECT *
- Use covering indexes
- Optimize WHERE clauses

**Query Patterns**
```sql
-- Bad: SELECT *
SELECT * FROM customers WHERE tenant_id = ?;

-- Good: Select specific columns
SELECT id, customer_code, display_name, primary_phone 
FROM customers 
WHERE tenant_id = ? AND is_deleted = false;

-- Bad: Function on column in WHERE
WHERE DATE(created_at) = CURRENT_DATE;

-- Good: Range query
WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL '1 day';
```

## Partitioning

**Partitioning Strategy**

**Partition by Date**
```sql
-- Partition payments by month
CREATE TABLE payments (
    -- columns
) PARTITION BY RANGE (payment_date);

CREATE TABLE payments_2024_01 PARTITION OF payments
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE payments_2024_02 PARTITION OF payments
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

**Partition by Tenant**
```sql
-- Partition large tables by tenant_id
CREATE TABLE recovery_cases (
    -- columns
) PARTITION BY HASH (tenant_id);

CREATE TABLE recovery_cases_0 PARTITION OF recovery_cases
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE recovery_cases_1 PARTITION OF recovery_cases
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
```

**Partitioning Benefits**
- Improved query performance
- Easier maintenance
- Faster archival
- Better index performance
- Parallel query execution

## Archiving

**Archival Strategy**

**Archive Old Data**
```sql
-- Archive old payments to archive table
INSERT INTO payments_archive
SELECT * FROM payments
WHERE payment_date < CURRENT_DATE - INTERVAL '3 years';

-- Delete archived data
DELETE FROM payments
WHERE payment_date < CURRENT_DATE - INTERVAL '3 years';
```

**Archive Tables**
- payments_archive
- recovery_cases_archive
- call_logs_archive
- sms_history_archive
- email_history_archive

**Archival Schedule**
- Daily: Archive logs older than 90 days
- Monthly: Archive payments older than 3 years
- Quarterly: Archive cases older than 5 years
- Yearly: Archive customer data older than 7 years

## Compression

**Compression Techniques**
- Table compression (TOAST)
- Column compression
- Index compression
- Backup compression

**PostgreSQL Compression**
```sql
-- Enable compression for large text columns
ALTER TABLE call_logs ALTER COLUMN call_notes SET STORAGE EXTENDED;
ALTER TABLE documents ALTER COLUMN metadata SET STORAGE EXTENDED;
```

## Read Replicas

**Read Replica Configuration**
- Primary database for writes
- Read replicas for reads
- Connection pooling for replicas
- Replica lag monitoring
- Automatic failover

**Read Replica Usage**
- Reporting queries
- Dashboard queries
- Analytics queries
- Backup queries
- Export queries

## Materialized Views

**Materialized View Examples**

**Daily Payment Summary**
```sql
CREATE MATERIALIZED VIEW mv_daily_payment_summary AS
SELECT 
    tenant_id,
    payment_date,
    COUNT(*) as payment_count,
    SUM(payment_amount) as total_amount,
    SUM(principal_amount) as total_principal,
    SUM(interest_amount) as total_interest
FROM payments
WHERE payment_status = 'completed'
GROUP BY tenant_id, payment_date;

-- Refresh schedule
CREATE UNIQUE INDEX idx_mv_daily_payment_summary ON mv_daily_payment_summary(tenant_id, payment_date);
```

**Refresh Strategy**
- Real-time: REFRESH CONCURRENTLY
- Scheduled: REFRESH EVERY 1 HOUR
- Manual: REFRESH MATERIALIZED VIEW

## Database Views

**View Examples**

**Active Cases View**
```sql
CREATE VIEW v_active_cases AS
SELECT 
    rc.id,
    rc.case_number,
    rc.case_status,
    rc.assigned_to,
    c.display_name as customer_name,
    l.loan_number,
    l.outstanding_amount,
    rc.next_action_date
FROM recovery_cases rc
JOIN customers c ON rc.customer_id = c.id
JOIN loans l ON rc.loan_id = l.id
WHERE rc.case_status IN ('active', 'in_progress')
  AND rc.is_deleted = false;
```

## Stored Procedures

**Stored Procedure Examples**

**Calculate Outstanding Balance**
```sql
CREATE OR REPLACE FUNCTION calculate_outstanding_balance(p_loan_id UUID)
RETURNS DECIMAL(15, 2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(total_amount - paid_amount), 0)
        FROM emi_schedule
        WHERE loan_id = p_loan_id
        AND payment_status != 'paid'
    );
END;
$$ LANGUAGE plpgsql;
```

## Bulk Imports

**Bulk Import Strategy**
- Use COPY command for large imports
- Disable indexes during import
- Use transactions for rollback
- Validate data before import
- Use temporary tables for staging

**Import Process**
```sql
-- Create temporary table
CREATE TEMP TABLE temp_customers AS SELECT * FROM customers WITH NO DATA;

-- Import data
COPY temp_customers FROM '/path/to/file.csv' DELIMITER ',' CSV HEADER;

-- Validate and insert
INSERT INTO customers
SELECT * FROM temp_customers;
```

## Batch Processing

**Batch Processing Strategy**
- Process in batches of 1000 records
- Use transactions for each batch
- Commit after each batch
- Log batch progress
- Handle errors gracefully

**Batch Update Example**
```sql
DO $$
DECLARE
    batch_size INTEGER := 1000;
    offset_val INTEGER := 0;
BEGIN
    LOOP
        UPDATE customers
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id IN (
            SELECT id FROM customers
            ORDER BY created_at
            LIMIT batch_size OFFSET offset_val
        );
        
        EXIT WHEN NOT FOUND;
        
        offset_val := offset_val + batch_size;
        COMMIT;
    END LOOP;
END $$;
```

---

# SECTION 8: Multi-Tenant Database Strategy

## Strategy Comparison

### Shared Database / Shared Schema

**Description**
- Single database
- Shared schema
- Tenant ID column in all tables
- Row-level security

**Advantages**
- Cost-effective
- Easy to manage
- Single backup strategy
- Cross-tenant analytics
- Simpler deployment

**Disadvantages**
- Limited isolation
- Performance impact
- Security concerns
- Scaling limitations
- Tenant interference

**Best For**
- Small to medium tenants
- Cost-sensitive deployments
- Startups
- MVP phase

### Shared Database / Separate Schema

**Description**
- Single database
- Separate schema per tenant
- Schema-level permissions
- Tenant context middleware

**Advantages**
- Better security than row-level
- Logical separation
- Shared database benefits
- Moderate complexity
- Better performance

**Disadvantages**
- Schema management complexity
- Cross-schema queries
- Migration complexity
- Limited scaling
- Moderate cost

**Best For**
- Medium tenants
- Security-sensitive applications
- Growing SaaS
- Multi-tenant with moderate isolation

### Separate Database

**Description**
- Separate database per tenant
- Complete isolation
- Database per tenant provisioning
- Tenant routing middleware

**Advantages**
- Complete isolation
- Better security
- Independent scaling
- Custom configurations
- Performance isolation

**Disadvantages**
- Higher cost
- Complex management
- Multiple backups
- Cross-tenant analytics complexity
- Deployment complexity

**Best For**
- Large enterprise tenants
- High-security requirements
- Custom configurations
- Performance-critical applications
- Regulatory compliance

### Hybrid Approach

**Description**
- Shared database for small tenants
- Separate database for large tenants
- Dynamic scaling
- Cost optimization
- Flexible isolation

**Advantages**
- Cost optimization
- Flexible isolation
- Scalable architecture
- Performance optimization
- Tenant-specific configurations

**Disadvantages**
- Complex routing
- Mixed management
- Deployment complexity
- Monitoring complexity
- Backup complexity

**Best For**
- Mixed tenant sizes
- Growing SaaS platforms
- Cost-sensitive with enterprise clients
- Scalable architecture

## Recommendation for RecoverFlow

**Recommended Strategy: Shared Database / Separate Schema**

**Justification**

1. **Cost Optimization**
   - Single database reduces infrastructure costs
   - Shared resources for efficiency
   - Economies of scale

2. **Security Requirements**
   - Schema-level isolation provides adequate security
   - Row-level security for additional protection
   - Tenant-aware queries prevent cross-tenant access

3. **Performance**
   - Better performance than row-level isolation
   - Connection pooling efficiency
   - Query optimization across tenants
   - Caching benefits

4. **Scalability**
   - Can migrate large tenants to separate databases
   - Horizontal scaling with read replicas
   - Partitioning for large tables
   - Sharding by tenant if needed

5. **Manageability**
   - Single backup strategy
   - Unified monitoring
   - Simplified deployment
   - Easier maintenance

6. **Compliance**
   - Schema-level isolation meets most regulatory requirements
   - Audit logging per tenant
   - Data retention policies per schema
   - Compliance reporting

**Implementation Plan**

**Phase 1: Initial Deployment**
- Shared database with row-level security
- Tenant ID in all tables
- RLS policies for tenant isolation

**Phase 2: Schema Isolation**
- Migrate to schema-per-tenant for medium tenants
- Tenant routing middleware
- Schema-level permissions

**Phase 3: Database Separation**
- Separate databases for large enterprise tenants
- Tenant routing by database
- Independent scaling

**Migration Strategy**
- Gradual migration based on tenant size
- Zero-downtime migration
- Data validation
- Performance testing

---

# SECTION 9: Naming Standards

## Table Naming

**Convention**: snake_case, plural nouns

**Examples**
- customers
- loans
- recovery_cases
- payment_allocations
- user_roles

**Rules**
- Use lowercase letters
- Use underscores for spaces
- Use plural nouns
- No abbreviations (except common ones)
- No prefixes (like tbl_)

## Column Naming

**Convention**: snake_case

**Examples**
- customer_id
- first_name
- created_at
- is_deleted
- metadata

**Rules**
- Use lowercase letters
- Use underscores for spaces
- No abbreviations (except common ones)
- Boolean columns start with is_
- Timestamp columns end with _at
- ID columns end with _id

## Constraints

**Primary Key**
- Convention: pk_table_name
- Example: pk_customers

**Foreign Key**
- Convention: fk_table_name_column_name
- Example: fk_loans_customer_id

**Unique Constraint**
- Convention: uk_table_name_column_name
- Example: uk_customers_tenant_id_customer_code

**Check Constraint**
- Convention: ck_table_name_column_name
- Example: ck_loans_principal_amount_positive

## Indexes

**Index Naming**
- Convention: idx_table_name_column_name
- Example: idx_customers_tenant_id

**Unique Index**
- Convention: uidx_table_name_column_name
- Example: uidx_users_email

**Composite Index**
- Convention: idx_table_name_column1_column2
- Example: idx_recovery_cases_tenant_id_case_status

**GIN Index**
- Convention: idx_table_name_column_name_gin
- Example: idx_customers_display_name_gin

## Foreign Keys

**Foreign Key Naming**
- Convention: fk_table_name_column_name
- Example: fk_loans_customer_id

**Rules**
- Reference the table and column
- Use the foreign key column name
- Maintain consistency

## Triggers

**Trigger Naming**
- Convention: trg_table_name_action
- Example: trg_customers_before_update
- Example: trg_loans_after_insert

**Trigger Function Naming**
- Convention: fn_table_name_action
- Example: fn_customers_update_timestamp
- Example: fn_loans_calculate_outstanding

## Views

**View Naming**
- Convention: v_view_name
- Example: v_active_cases
- Example: v_payment_summary

**Materialized View Naming**
- Convention: mv_view_name
- Example: mv_daily_payment_summary
- Example: mv_monthly_recovery_stats

## Procedures

**Stored Procedure Naming**
- Convention: sp_procedure_name
- Example: sp_calculate_outstanding_balance
- Example: sp_generate_monthly_report

**Function Naming**
- Convention: fn_function_name
- Example: fn_format_phone_number
- Example: fn_calculate_age

---

# SECTION 10: Migration Strategy

## Versioned Migrations

**Migration Framework**
- Use migration framework (Flyway, Liquibase, or custom)
- Version-controlled migration files
- Up and down migrations
- Migration checksums
- Migration tracking table

**Migration File Naming**
- Convention: V{version}__{description}.sql
- Example: V1__create_tenants_table.sql
- Example: V2__create_customers_table.sql
- Example: V3__add_customer_indexes.sql

**Migration Tracking Table**
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    success BOOLEAN NOT NULL,
    checksum VARCHAR(255)
);
```

## Seed Data

**Seed Data Strategy**
- Master data in seed files
- Tenant-specific seed data
- Environment-specific seed data
- Idempotent seed scripts

**Seed Data Files**
- countries_seed.sql
- states_seed.sql
- cities_seed.sql
- loan_types_seed.sql
- payment_methods_seed.sql
- notification_templates_seed.sql

**Seed Data Execution**
- Run after schema migrations
- Run in transaction
- Validate seed data
- Log seed data insertion

## Rollback Strategy

**Rollback Planning**
- Down migrations for each up migration
- Rollback testing
- Rollback validation
- Rollback documentation

**Rollback Execution**
- Stop application
- Run down migrations
- Validate rollback
- Restart application
- Monitor for issues

**Rollback Best Practices**
- Test rollbacks in staging
- Have rollback plan for each migration
- Document rollback procedures
- Monitor rollback performance
- Validate data integrity

## Tenant Onboarding

**Tenant Onboarding Process**
1. Create tenant record
2. Create tenant schema (if using schema isolation)
3. Seed tenant-specific data
4. Create default users
5. Configure tenant settings
6. Set up tenant permissions
7. Validate tenant setup

**Tenant Onboarding Automation**
- Automated tenant creation
- Automated schema creation
- Automated data seeding
- Automated configuration
- Automated validation

## Zero-Downtime Migrations

**Zero-Downtime Strategy**
- Use online schema changes
- Use pg_repack for reindexing
- Use transactional DDL
- Use incremental data migration
- Use feature flags

**Online Schema Changes**
- Add column (with default)
- Add index (CONCURRENTLY)
- Add constraint (VALIDATE CONSTRAINT)
- Change column type (USING)
- Drop column (if safe)

**Migration Process**
1. Create new table structure
2. Copy data incrementally
3. Validate data
4. Switch to new structure
5. Drop old structure

---

# SECTION 11: Backup & Disaster Recovery

## Backup Frequency

**Backup Schedule**
- Full backup: Daily at 2 AM UTC
- Incremental backup: Every 6 hours
- WAL backup: Continuous
- Archive backup: Weekly

**Backup Types**
- Full database backup
- Schema-only backup
- Data-only backup
- Configuration backup

## Retention

**Retention Policy**
- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months
- Yearly backups: 7 years
- Archive backups: Permanent

**Retention by Data Type**
- Transactional data: 7 years
- Audit logs: 7 years
- User data: 3 years after account closure
- System logs: 1 year
- Temporary data: 90 days

## Point-in-Time Recovery

**PITR Configuration**
- WAL archiving enabled
- WAL retention: 7 days
- PITR window: 7 days
- Recovery point granularity: 1 minute

**PITR Process**
1. Stop application
2. Restore base backup
3. Replay WAL logs
4. Stop at recovery point
5. Validate recovery
6. Restart application

## Replication

**Replication Strategy**
- Streaming replication
- Synchronous replication for critical data
- Asynchronous replication for reporting
- Cascading replication for read replicas

**Replication Configuration**
- Primary database: Write operations
- Standby database: Read operations
- Read replicas: Reporting and analytics
- Lag monitoring: < 1 second

## Disaster Recovery Procedures

**DR Site Configuration**
- Secondary region deployment
- Data replication to DR site
- Application failover capability
- DNS failover configuration
- Regular DR testing

**DR Process**
1. Detect failure
2. Initiate failover
3. Promote standby to primary
4. Update DNS
5. Validate failover
6. Monitor performance
7. Failback when primary recovered

**RTO/RPO**
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 5 minutes

---

# SECTION 12: Database Security

## Encryption at Rest

**Encryption Implementation**
- Transparent Data Encryption (TDE)
- Database encryption keys
- Key rotation policy
- Encryption algorithm: AES-256

**Encryption Scope**
- All database files
- Backup files
- WAL files
- Temporary files

## Encryption in Transit

**Encryption Implementation**
- SSL/TLS for all connections
- Certificate management
- Certificate rotation
- TLS 1.3 enforcement

**Configuration**
- Force SSL connections
- Require valid certificates
- Disable weak ciphers
- Perfect forward secrecy

## Sensitive Fields

**Sensitive Data Identification**
- PII (Personally Identifiable Information)
- Financial data
- Contact information
- Government IDs
- Authentication credentials

**Encryption Strategy**
- Column-level encryption for sensitive fields
- Application-level encryption
- Key management service (KMS)
- Encryption key rotation

**Encrypted Fields**
- password_hash (bcrypt)
- mfa_secret (encrypted)
- id_number (encrypted)
- pan_number (encrypted)
- aadhaar_number (encrypted)
- account_number (encrypted)
- card_number (encrypted)

## Row-Level Security

**RLS Implementation**
```sql
-- Enable RLS on tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation_policy ON customers
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Apply policy to all tables
```

**RLS Benefits**
- Automatic tenant isolation
- No application-level filtering
- Security at database level
- Compliance with regulations

## Tenant Isolation

**Isolation Implementation**
- Tenant ID in all tables
- RLS policies for tenant access
- Tenant-aware queries
- Tenant-specific backups

**Isolation Validation**
- Regular access audits
- Cross-tenant access testing
- Data leakage prevention
- Compliance validation

## Data Masking

**Masking Strategy**
- Dynamic data masking for non-production
- Partial masking for display
- Full masking for sensitive fields
- Role-based masking

**Masking Examples**
- Credit card: ****-****-****-1234
- Phone: +1 (***) ***-1234
- Email: j***@example.com
- ID: 123-**-4567

## Backup Encryption

**Backup Encryption**
- Encrypt all backups
- Separate encryption keys
- Key rotation policy
- Secure key storage

**Encryption Configuration**
- AES-256 encryption
- Key management service
- Secure key storage
- Access control

## Access Control

**Access Control Implementation**
- Database users with least privilege
- Role-based access control
- Connection limits
- IP whitelisting

**User Roles**
- app_admin: Full access
- app_read: Read-only access
- app_write: Write access
- app_backup: Backup access

---

# SECTION 13: Reporting Database

## Data Warehouse

**Data Warehouse Architecture**
- Separate reporting database
- Columnar storage (ClickHouse, Snowflake)
- Star schema design
- Dimension tables
- Fact tables

**Data Warehouse Benefits**
- Optimized for analytics
- Faster reporting queries
- Better compression
- Scalable architecture
- Separate from OLTP

## ETL

**ETL Process**
1. Extract from OLTP database
2. Transform data
3. Load into data warehouse
4. Validate data
5. Update metadata

**ETL Schedule**
- Real-time: Critical data
- Hourly: Transactional data
- Daily: Master data
- Weekly: Historical data

## OLTP vs OLAP

**OLTP (Online Transaction Processing)**
- Transactional database
- Normalized schema
- Real-time updates
- ACID compliance
- Optimized for writes

**OLAP (Online Analytical Processing)**
- Reporting database
- Denormalized schema
- Batch updates
- Query optimization
- Optimized for reads

## Reporting Views

**Reporting View Examples**

**Monthly Recovery Report**
```sql
CREATE VIEW v_monthly_recovery_report AS
SELECT 
    t.tenant_id,
    t.tenant_name,
    DATE_TRUNC('month', rc.assigned_date) as report_month,
    COUNT(*) as total_cases,
    SUM(rc.total_outstanding) as total_outstanding,
    SUM(rc.recovered_amount) as total_recovered,
    AVG(rc.recovery_percentage) as avg_recovery_rate
FROM recovery_cases rc
JOIN tenants t ON rc.tenant_id = t.id
WHERE rc.is_deleted = false
GROUP BY t.tenant_id, t.tenant_name, DATE_TRUNC('month', rc.assigned_date);
```

## Analytics Optimization

**Optimization Techniques**
- Materialized views
- Pre-aggregated tables
- Columnar storage
- Partitioning
- Indexing
- Query optimization

**Pre-Aggregated Tables**
- Daily aggregations
- Monthly aggregations
- Yearly aggregations
- Custom aggregations

---

# SECTION 14: AI Data Layer

## AI Summaries

**Storage Strategy**
- Separate table for AI summaries
- JSONB for summary content
- Version tracking
- Entity association

**Table Schema**
```sql
CREATE TABLE ai_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    summary_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    summary_text TEXT NOT NULL,
    summary_points JSONB,
    model_id UUID REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_valid BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Predictions

**Storage Strategy**
- Time-series data for predictions
- Model versioning
- Feature storage
- Confidence tracking

**Table Schema**
```sql
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    prediction_type VARCHAR(50) NOT NULL,
    model_id UUID NOT NULL REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    prediction_value DECIMAL(10, 4) NOT NULL,
    prediction_label VARCHAR(100),
    confidence_score DECIMAL(5, 4),
    features JSONB,
    prediction_date DATE NOT NULL,
    prediction_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by UUID REFERENCES users(id),
    actual_value DECIMAL(10, 4),
    actual_label VARCHAR(100),
    accuracy_score DECIMAL(5, 4),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Risk Scores

**Storage Strategy**
- Historical risk scores
- Risk score trends
- Risk factors
- Risk level changes

**Table Schema**
```sql
CREATE TABLE ai_risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    risk_score DECIMAL(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    risk_factors JSONB,
    model_id UUID REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50),
    score_date DATE NOT NULL,
    score_time TIMESTAMP WITH TIME ZONE NOT NULL,
    previous_score DECIMAL(5, 2),
    score_change DECIMAL(5, 2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Embeddings

**Storage Strategy**
- Vector embeddings for semantic search
- Embedding versioning
- Dimension tracking
- Similarity search

**Table Schema**
```sql
CREATE TABLE ai_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    embedding_model VARCHAR(50) NOT NULL,
    embedding_version VARCHAR(50),
    embedding_vector VECTOR(1536),
    embedding_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Model Versions

**Storage Strategy**
- Model version tracking
- Model performance metrics
- Model deployment history
- Model training data

**Table Schema**
```sql
CREATE TABLE ai_model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_code VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    model_file_path VARCHAR(500),
    model_config JSONB,
    training_data_start_date DATE,
    training_data_end_date DATE,
    training_data_count INTEGER,
    accuracy_score DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall_score DECIMAL(5, 4),
    f1_score DECIMAL(5, 4),
    deployed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, model_code, model_version)
);
```

## Feedback

**Storage Strategy**
- User feedback on AI predictions
- Feedback validation
- Feedback analysis
- Model improvement

**Table Schema**
```sql
CREATE TABLE ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    prediction_id UUID NOT NULL REFERENCES ai_predictions(id),
    feedback_type VARCHAR(50) NOT NULL,
    feedback_value TEXT NOT NULL,
    feedback_rating INTEGER,
    feedback_category VARCHAR(50),
    provided_by UUID REFERENCES users(id),
    provided_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);
```

## Prompt History

**Storage Strategy**
- Chat prompt history
- Prompt templates
- Prompt performance
- Prompt optimization

**Table Schema**
```sql
CREATE TABLE ai_prompt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    session_id UUID NOT NULL,
    prompt_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    prompt_tokens INTEGER,
    response_tokens INTEGER,
    model_id UUID REFERENCES ai_model_configurations(id),
    model_version VARCHAR(50),
    prompt_type VARCHAR(50),
    prompt_category VARCHAR(50),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Confidence Scores

**Storage Strategy**
- Historical confidence scores
- Confidence trends
- Confidence calibration
- Model performance

**Table Schema**
```sql
CREATE TABLE ai_confidence_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    prediction_id UUID NOT NULL REFERENCES ai_predictions(id),
    confidence_score DECIMAL(5, 4) NOT NULL,
    confidence_level VARCHAR(20) NOT NULL,
    calibration_score DECIMAL(5, 4),
    accuracy_at_confidence DECIMAL(5, 4),
    score_date DATE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

# SECTION 15: Future Scalability

## 10 Million Customers

**Scaling Strategy**
- Database sharding by tenant
- Partitioning by customer_id
- Read replicas for reporting
- Caching layer for hot data
- Connection pooling

**Performance Optimization**
- Partition customers table by range
- Index optimization
- Query optimization
- Materialized views for aggregations
- Archive old customer data

## 1000+ Tenants

**Scaling Strategy**
- Schema-per-tenant for large tenants
- Database-per-tenant for enterprise tenants
- Tenant routing middleware
- Resource allocation per tenant
- Tenant-specific backups

**Performance Optimization**
- Connection pooling per tenant
- Resource quotas per tenant
- Query optimization per tenant
- Caching per tenant
- Monitoring per tenant

## 100,000 Concurrent Users

**Scaling Strategy**
- Connection pooling
- Read replicas
- Load balancing
- Horizontal scaling
- Caching layer

**Performance Optimization**
- Optimize connection pool size
- Use PgBouncer for connection pooling
- Implement query caching
- Optimize frequently executed queries
- Monitor connection usage

## Horizontal Scaling

**Scaling Strategy**
- Database sharding
- Read replicas
- Connection pooling
- Load balancing
- Auto-scaling

**Implementation**
- Shard by tenant_id
- Shard by customer_id
- Shard by date range
- Consistent hashing
- Shard rebalancing

## Sharding

**Sharding Strategy**
- Shard by tenant_id for multi-tenant
- Shard by customer_id for data distribution
- Shard by date for time-series data
- Shard by region for geographic distribution

**Sharding Implementation**
- Hash-based sharding
- Range-based sharding
- Directory-based sharding
- Geographic sharding

## Event Streaming

**Event Streaming Architecture**
- Kafka for event streaming
- Event sourcing for critical events
- CQRS for read/write separation
- Event replay capability
- Event versioning

**Event Types**
- Customer events
- Loan events
- Payment events
- Case events
- Legal events

## Data Lake Integration

**Data Lake Strategy**
- S3 for data lake storage
- Parquet format for data
- Partitioning by date and tenant
- Glue/Athena for querying
- Spectrum for Redshift integration

**Data Pipeline**
- Extract from PostgreSQL
- Transform using Spark/EMR
- Load to S3 in Parquet format
- Catalog using Glue Data Catalog
- Query using Athena/Redshift Spectrum

---

## Conclusion

This Database Architecture document serves as the official specification for the RecoverFlow platform's data layer. All development teams should reference this document to ensure consistency and alignment with the data architecture vision.

**Next Steps**
1. Review and approve database architecture
2. Create detailed ER diagrams
3. Implement database schema
4. Set up development database
5. Create migration scripts
6. Implement RLS policies
7. Set up backup and replication
8. Configure monitoring
9. Conduct performance testing
10. Begin development

**Version History**
- v1.0.0 - June 30, 2026: Initial Database Architecture
