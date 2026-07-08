# Sprint 5: Dynamic Organization Configuration

## Overview
Transform RecoverFlow into an industry-neutral recovery platform by replacing fixed organizational structures with configurable business structures.

---

## 1. Domain Model

### Core Entities

#### 1.1. **Industry Template**
- **Purpose**: Pre-configured templates for different industries
- **Attributes**:
  - `id`: UUID
  - `industry_code`: String (e.g., "BANKING", "NBFC", "INSURANCE")
  - `industry_name`: String
  - `description`: Text
  - `default_business_units`: JSONB array of default business units
  - `default_workflows`: JSONB array of default workflow templates
  - `default_modules`: JSONB array of enabled modules
  - `is_active`: Boolean
  - `created_at`, `updated_at`: TIMESTAMP

#### 1.2. **Business Unit** (Replaces Departments)
- **Purpose**: Configurable organizational units (can be departments, branches, regions, etc.)
- **Attributes**:
  - `id`: UUID
  - `tenant_id`: UUID (FK to tenants)
  - `parent_id`: UUID (FK to business_units, for hierarchy)
  - `business_unit_code`: String (unique per tenant)
  - `business_unit_name`: String
  - `business_unit_type`: String (e.g., "DEPARTMENT", "BRANCH", "REGION", "DIVISION")
  - `description`: Text
  - `manager_id`: UUID (FK to users)
  - `address`: Text
  - `city`: String
  - `state`: String
  - `country`: String
  - `postal_code`: String
  - `is_active`: Boolean
  - `deleted_at`: TIMESTAMP
  - `created_at`, `updated_at`: TIMESTAMP

#### 1.3. **Workflow Template**
- **Purpose**: Defines configurable recovery lifecycles
- **Attributes**:
  - `id`: UUID
  - `tenant_id`: UUID (FK to tenants) - NULL for system templates
  - `template_code`: String
  - `template_name`: String
  - `description`: Text
  - `industry_code`: String (for industry-specific templates)
  - `stages`: JSONB (ordered list of stages)
  - `is_system_template`: Boolean
  - `is_active`: Boolean
  - `created_at`, `updated_at`: TIMESTAMP

#### 1.4. **Workflow Stage** (Embedded in WorkflowTemplate)
- **Attributes**:
  - `stage_code`: String
  - `stage_name`: String
  - `description`: Text
  - `order`: Integer
  - `color`: String
  - `is_initial`: Boolean
  - `is_final`: Boolean
  - `allowed_next_stages`: Array
  - `auto_actions`: JSONB (automations to trigger at this stage)

#### 1.5. **Business Rule**
- **Purpose**: Configurable rules for automation and logic
- **Attributes**:
  - `id`: UUID
  - `tenant_id`: UUID (FK to tenants)
  - `rule_code`: String
  - `rule_name`: String
  - `description`: Text
  - `rule_type`: String (e.g., "ASSIGNMENT", "NOTIFICATION", "ESCALATION")
  - `conditions`: JSONB (rule conditions)
  - `actions`: JSONB (rule actions)
  - `is_active`: Boolean
  - `priority`: Integer
  - `created_at`, `updated_at`: TIMESTAMP

#### 1.6. **Dashboard Widget Config**
- **Purpose**: Role-based widget configurations
- **Attributes**:
  - `id`: UUID
  - `tenant_id`: UUID (FK to tenants)
  - `role_id`: UUID (FK to roles)
  - `widget_type`: String
  - `widget_config`: JSONB
  - `position_x`: Integer
  - `position_y`: Integer
  - `width`: Integer
  - `height`: Integer
  - `is_default`: Boolean
  - `is_active`: Boolean
  - `created_at`, `updated_at`: TIMESTAMP

#### 1.7. **Role-Business Unit Association**
- **Purpose**: Associates roles with business units for granular access control
- **Attributes**:
  - `id`: UUID
  - `role_id`: UUID (FK to roles)
  - `business_unit_id`: UUID (FK to business_units)
  - `created_at`: TIMESTAMP

---

## 2. Database Schema Design

### 2.1. New Tables

```sql
-- =============================================
-- Industry Templates
-- =============================================
CREATE TABLE IF NOT EXISTS industry_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_code VARCHAR(100) UNIQUE NOT NULL,
    industry_name VARCHAR(255) NOT NULL,
    description TEXT,
    default_business_units JSONB DEFAULT '[]',
    default_workflows JSONB DEFAULT '[]',
    default_modules JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Business Units (Replaces Departments)
-- =============================================
CREATE TABLE IF NOT EXISTS business_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES business_units(id) ON DELETE SET NULL,
    business_unit_code VARCHAR(100) NOT NULL,
    business_unit_name VARCHAR(255) NOT NULL,
    business_unit_type VARCHAR(50) NOT NULL DEFAULT 'DEPARTMENT',
    description TEXT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, business_unit_code)
);

CREATE INDEX IF NOT EXISTS idx_business_units_tenant_id ON business_units(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_units_parent_id ON business_units(parent_id);

-- =============================================
-- Workflow Templates
-- =============================================
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    template_code VARCHAR(100) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    industry_code VARCHAR(100),
    stages JSONB NOT NULL DEFAULT '[]',
    is_system_template BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, template_code),
    UNIQUE(industry_code, template_code) WHERE tenant_id IS NULL
);

CREATE INDEX IF NOT EXISTS idx_workflow_templates_tenant_id ON workflow_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_industry_code ON workflow_templates(industry_code);

-- =============================================
-- Business Rules
-- =============================================
CREATE TABLE IF NOT EXISTS business_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    rule_code VARCHAR(100) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL,
    conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, rule_code)
);

CREATE INDEX IF NOT EXISTS idx_business_rules_tenant_id ON business_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_rules_rule_type ON business_rules(rule_type);

-- =============================================
-- Dashboard Widget Configurations
-- =============================================
CREATE TABLE IF NOT EXISTS dashboard_widget_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSONB NOT NULL DEFAULT '{}',
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 2,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_tenant_id ON dashboard_widget_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_role_id ON dashboard_widget_configs(role_id);

-- =============================================
-- Role-Business Unit Associations
-- =============================================
CREATE TABLE IF NOT EXISTS role_business_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, business_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_role_business_units_role_id ON role_business_units(role_id);
CREATE INDEX IF NOT EXISTS idx_role_business_units_business_unit_id ON role_business_units(business_unit_id);
```

### 2.2. Modifications to Existing Tables

```sql
-- Enhance tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS workflow_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL;

-- Enhance users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL;

-- Enhance roles table
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS dashboard_layout JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS menu_items JSONB DEFAULT '[]';

-- Enhance teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL;

-- Create index for new columns
CREATE INDEX IF NOT EXISTS idx_tenants_workflow_template_id ON tenants(workflow_template_id);
CREATE INDEX IF NOT EXISTS idx_users_business_unit_id ON users(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_teams_business_unit_id ON teams(business_unit_id);
```

---

## 3. UI Flow & Wireframes

### 3.1. Tenant Onboarding Flow (Step-by-Step)

#### Step 1: Industry Selection
- **Screen**: Select Industry
- **Components**:
  - Grid of industry cards (Banking, NBFC, Insurance, Fintech, etc.)
  - Each card shows industry name, description, and default features
  - "Custom" option for unique industries
- **Action**: Select industry → loads default templates

#### Step 2: Business Structure Configuration
- **Screen**: Configure Business Units
- **Components**:
  - Tree view of business units (hierarchy)
  - Add/Edit/Delete business units
  - Define business unit types (Department, Branch, Region, Division)
  - Set manager for each unit
  - Drag & drop to rearrange hierarchy
- **Templates**: Loaded from selected industry template

#### Step 3: Workflow Configuration
- **Screen**: Configure Recovery Workflow
- **Components**:
  - Visual workflow builder (drag & drop stages)
  - Stage configuration (name, color, transitions, auto-actions)
  - Preview of workflow
- **Templates**: Loaded from selected industry template

#### Step 4: Modules & Features
- **Screen**: Enable Modules
- **Components**:
  - Module checklist with descriptions
  - Feature toggles for each module
  - Subscription tier info
- **Templates**: Loaded from selected industry template

### 3.2. Organization Settings Page (New Tabs)
**Updated TABS array**:
```typescript
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'business-structure', label: 'Business Structure' }, // New
  { id: 'workflows', label: 'Workflows' }, // New
  { id: 'business-rules', label: 'Business Rules' }, // New
  { id: 'branding', label: 'Branding' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'modules', label: 'Modules' },
  { id: 'users', label: 'Users' },
  { id: 'roles', label: 'Roles & Permissions' }, // Updated
  { id: 'integrations', label: 'Integrations' },
  { id: 'security', label: 'Security' },
  { id: 'audit', label: 'Audit Logs' },
];
```

### 3.3. Dynamic Sidebar Generation
- **Logic**:
  1. Get user's tenant
  2. Get user's roles from `user_roles`
  3. For each role, get associated `business_units` from `role_business_units`
  4. Get enabled modules for tenant from `tenant_modules`
  5. Get role-specific `menu_items` from `roles` table
  6. Combine and filter based on permissions
  7. Render sidebar

### 3.4. Dynamic Dashboard Generation
- **Logic**:
  1. Get user's roles
  2. Get `dashboard_widget_configs` for those roles
  3. Get workflow template for tenant
  4. Render widgets in grid layout based on configs

---

## 4. API Endpoints

### 4.1. Industry Templates
- `GET /api/v1/industry-templates` - List all industry templates
- `GET /api/v1/industry-templates/:code` - Get industry template by code
- `POST /api/v1/industry-templates` - Create custom industry template (Platform Owner only)
- `PUT /api/v1/industry-templates/:code` - Update industry template
- `DELETE /api/v1/industry-templates/:code` - Delete industry template

### 4.2. Business Units
- `GET /api/v1/business-units` - List all business units for tenant (tree structure)
- `GET /api/v1/business-units/:id` - Get business unit by ID
- `POST /api/v1/business-units` - Create business unit
- `PUT /api/v1/business-units/:id` - Update business unit
- `DELETE /api/v1/business-units/:id` - Soft delete business unit
- `POST /api/v1/business-units/:id/move` - Move business unit in hierarchy

### 4.3. Workflow Templates
- `GET /api/v1/workflow-templates` - List workflow templates (system + tenant)
- `GET /api/v1/workflow-templates/:id` - Get workflow template
- `POST /api/v1/workflow-templates` - Create custom workflow template
- `PUT /api/v1/workflow-templates/:id` - Update workflow template
- `DELETE /api/v1/workflow-templates/:id` - Delete workflow template
- `POST /api/v1/workflow-templates/:id/apply` - Apply workflow template to tenant

### 4.4. Business Rules
- `GET /api/v1/business-rules` - List business rules for tenant
- `GET /api/v1/business-rules/:id` - Get business rule
- `POST /api/v1/business-rules` - Create business rule
- `PUT /api/v1/business-rules/:id` - Update business rule
- `DELETE /api/v1/business-rules/:id` - Delete business rule

### 4.5. Dashboard Widgets
- `GET /api/v1/dashboard-widgets` - Get widget configs for user's roles
- `GET /api/v1/dashboard-widgets/role/:roleId` - Get widget configs for role
- `POST /api/v1/dashboard-widgets` - Create widget config
- `PUT /api/v1/dashboard-widgets/:id` - Update widget config (position/size)
- `DELETE /api/v1/dashboard-widgets/:id` - Delete widget config
- `POST /api/v1/dashboard-widgets/reset` - Reset to default config

### 4.6. Tenant Configuration
- `GET /api/v1/tenants/:id/config` - Get full tenant configuration
- `PUT /api/v1/tenants/:id/config` - Update tenant configuration
- `POST /api/v1/tenants/:id/apply-template` - Apply industry template to existing tenant

---

## 5. Implementation Plan

### Phase 1: Database Migration & Seed Data (Weeks 1-2)
- [ ] Create migration for new tables
- [ ] Create seed data for industry templates
  - Banking
  - NBFC
  - Insurance
  - Fintech
  - Telecom
  - Healthcare
  - Education
  - Collection Agencies
  - Custom
- [ ] Seed default workflow templates for each industry
- [ ] Migrate existing departments to business_units
- [ ] Update existing FK relationships

### Phase 2: Backend API Implementation (Weeks 2-4)
- [ ] Industry Templates Controller & Routes
- [ ] Business Units Controller & Routes (tree structure support)
- [ ] Workflow Templates Controller & Routes
- [ ] Business Rules Controller & Routes
- [ ] Dashboard Widgets Controller & Routes
- [ ] Update Tenant Controller with config endpoints
- [ ] Update Auth Middleware to support business unit scoping
- [ ] Update Permission Middleware with role-business unit checks

### Phase 3: Frontend Implementation (Weeks 4-7)
- [ ] Create Industry Selection page
- [ ] Create Business Structure page with tree view
- [ ] Create Workflow Builder UI
- [ ] Create Business Rules UI
- [ ] Update Organization Settings page with new tabs
- [ ] Implement Dynamic Sidebar component
- [ ] Implement Dynamic Dashboard with widget grid
- [ ] Update existing pages to use business_units instead of departments
- [ ] Update user management to use business_units

### Phase 4: Testing & Documentation (Weeks 7-8)
- [ ] Unit tests for new backend controllers
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] End-to-end testing of onboarding flow
- [ ] Update API documentation (Swagger/OpenAPI)
- [ ] Update user guide with new features

---

## 6. Industry-Specific Defaults

### Banking Defaults
- **Business Units**: Retail Banking, Corporate Banking, Recovery, Legal
- **Workflow**: Initial Contact → Follow-up → Settlement → Legal → Closed
- **Modules**: All core modules + Legal Management

### NBFC Defaults
- **Business Units**: Microfinance, SME Loans, Vehicle Loans, Recovery
- **Workflow**: Initial Contact → Reminder → Field Visit → Settlement → Recovery → Closed
- **Modules**: All core modules + Field Agent App

### Insurance Defaults
- **Business Units**: Claims Recovery, Fraud Investigation, Legal
- **Workflow**: Claim Filed → Investigation → Recovery → Settlement → Closed
- **Modules**: All core modules + Fraud Detection

---

## 7. Success Criteria
- [ ] User can select from 8+ predefined industries during onboarding
- [ ] User can fully customize business structure (hierarchy, types)
- [ ] User can create and edit custom workflow templates
- [ ] User can define business rules without coding
- [ ] Sidebar is dynamically generated based on roles and enabled modules
- [ ] Dashboard is dynamically generated based on roles and widget configs
- [ ] All existing functionality works with new data model
- [ ] Performance is not degraded (queries < 200ms)

---

## 8. Risks & Mitigation
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data migration issues from departments → business_units | High | High | Test migration thoroughly, have rollback plan |
| Complex UI for workflow builder | Medium | High | Start with simple version, iterate with user feedback |
| Performance issues with large business unit hierarchies | Medium | Medium | Implement lazy loading, limit depth, use materialized paths |
| Permission complexity increases | Medium | High | Keep permission system backward compatible, phase in changes |
