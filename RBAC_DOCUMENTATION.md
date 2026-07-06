# RBAC System Documentation

## Overview

The RecoverFlow application implements a comprehensive Role-Based Access Control (RBAC) system that enables tenant administrators to manage user access with granular control. The system follows a hierarchical authorization model: **Subscription → Enabled Modules → Role → Permissions**.

## Architecture

### Authorization Flow

1. **Subscription Check**: Validates tenant's subscription tier and enabled features
2. **Module Check**: Verifies the requested module is enabled for the tenant
3. **Role Check**: Retrieves the user's assigned role
4. **Permission Check**: Validates the user has the specific action permission for the module

### Database Schema

#### Core Tables

- **`permission_actions`**: Defines available actions (view, create, edit, delete, assign, approve, export, import, configure)
- **`permission_matrix`**: Maps modules to actions with permission codes
- **`role_permission_matrix`**: Junction table linking roles to permission matrix entries
- **`dashboard_configurations`**: Stores dashboard layouts per role
- **`module_configurations`**: Defines available modules and their properties
- **`tenant_modules`**: Tracks which modules are enabled for each tenant
- **`roles`**: Defines system and custom roles
- **`user_roles`**: Links users to roles

#### Migration

Run the Sprint 4 migration to set up the RBAC schema:

```bash
cd backend/database
node run-sprint-4-migration.js
```

## Backend APIs

### Role Management

#### Create Role
```http
POST /api/v1/roles
Content-Type: application/json

{
  "name": "Custom Role",
  "description": "Custom role description",
  "is_system_role": false
}
```

#### Update Role
```http
PUT /api/v1/roles/:id
Content-Type: application/json

{
  "name": "Updated Role Name",
  "description": "Updated description"
}
```

#### Delete Role
```http
DELETE /api/v1/roles/:id
```

#### Clone Role
```http
POST /api/v1/roles/:id/clone
Content-Type: application/json

{
  "name": "Cloned Role Name",
  "description": "Cloned role description"
}
```

#### Activate/Deactivate Role
```http
PATCH /api/v1/roles/:id/activate
PATCH /api/v1/roles/:id/deactivate
```

### Permission Management

#### Get Permission Matrix
```http
GET /api/v1/roles/permission-matrix
```

Returns grouped permissions by module with all available actions.

#### Get Role Permissions
```http
GET /api/v1/roles/:id/permission-matrix
```

Returns the permission matrix with granted flags for a specific role.

#### Assign Permissions to Role
```http
PUT /api/v1/roles/:id/permissions
Content-Type: application/json

{
  "permission_matrix_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### User Provisioning

#### Create User
```http
POST /api/v1/user-provisioning/provisioning
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "department_id": "uuid",
  "team_id": "uuid",
  "role_id": "uuid",
  "status": "active",
  "send_welcome_email": true
}
```

#### Update User
```http
PUT /api/v1/user-provisioning/provisioning/:id
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "department_id": "uuid",
  "team_id": "uuid",
  "role_id": "uuid",
  "status": "active"
}
```

#### Get All Users
```http
GET /api/v1/user-provisioning/provisioning
```

#### Get User by ID
```http
GET /api/v1/user-provisioning/provisioning/:id
```

#### Delete User
```http
DELETE /api/v1/user-provisioning/provisioning/:id
```

#### Reset Password
```http
POST /api/v1/user-provisioning/provisioning/:id/reset-password
Content-Type: application/json

{
  "send_email": true
}
```

#### Lock/Unlock User
```http
PATCH /api/v1/user-provisioning/provisioning/:id/lock
PATCH /api/v1/user-provisioning/provisioning/:id/unlock
```

### Authorization Endpoints

#### Get Accessible Modules
```http
GET /api/v1/auth/accessible-modules
```

Returns list of modules the current user has view permission for.

#### Check Permission
```http
GET /api/v1/auth/check-permission?module=customers&action=create
```

Returns whether the user has the specified permission.

## Frontend Components

### Permission Matrix Component

Location: `src/components/admin/PermissionMatrix.tsx`

A grid-based UI for assigning permissions to roles. Features:
- Checkbox grid with modules as rows and actions as columns
- Select all by module or by action
- Real-time save functionality
- Read-only mode support

Usage:
```tsx
<PermissionMatrix
  roleId="role-uuid"
  onSave={(permissionIds) => console.log('Saved', permissionIds)}
  readOnly={false}
/>
```

### Permission Guards

#### PermissionGuard (Route Level)

Location: `src/components/common/PermissionGuard.tsx`

Protects entire routes based on permissions. Redirects to fallback if unauthorized.

```tsx
<PermissionGuard module="customers" action="view" fallbackPath="/app/dashboard">
  <CustomersPage />
</PermissionGuard>
```

#### RequirePermission (Component Level)

Conditionally renders children based on permissions without redirecting.

```tsx
<RequirePermission module="customers" action="create">
  <Button>Create Customer</Button>
</RequirePermission>
```

### Custom Hooks

#### useSidebar

Location: `src/hooks/useSidebar.ts`

Loads and filters sidebar items based on user permissions.

```tsx
const { sidebarItems, loading, checkPermission } = useSidebar();
```

#### usePermission

Location: `src/hooks/usePermissions.ts`

Checks a single permission.

```tsx
const { hasPermission, loading } = usePermission('customers', 'create');
```

#### usePermissions

Location: `src/hooks/usePermissions.ts`

Checks multiple permissions at once.

```tsx
const { permissions, loading } = usePermissions([
  { module: 'customers', action: 'create' },
  { module: 'customers', action: 'edit' },
]);
```

#### useDashboard

Location: `src/hooks/useDashboard.ts`

Loads dashboard configuration based on user's role.

```tsx
const { dashboardConfig, loading } = useDashboard();
```

### Configuration Files

#### Modules Configuration

Location: `src/config/modules.config.ts`

Defines all available modules with their properties:

```typescript
export const MODULES_CONFIG: ModuleConfig[] = [
  {
    code: 'customers',
    name: 'Customers',
    category: 'Recovery',
    icon: 'Users',
    route: '/app/customers',
    isCore: true,
  },
  // ... more modules
];
```

#### Roles Configuration

Location: `src/config/roles.config.ts`

Defines system roles:

```typescript
export const ROLES_CONFIG: RoleConfig[] = [
  {
    code: 'tenant_admin',
    name: 'Tenant Admin',
    description: 'Full access to tenant features',
    isSystemRole: true,
  },
  // ... more roles
];
```

#### Dashboard Configuration

Location: `src/config/dashboard.config.ts`

Defines dashboard layouts per role:

```typescript
export const DASHBOARD_CONFIGS: Record<string, DashboardConfig> = {
  tenant_admin: {
    role: 'tenant_admin',
    widgets: [
      {
        id: 'org_info',
        type: 'organization_info',
        position: { x: 0, y: 0, w: 6, h: 2 },
      },
      // ... more widgets
    ],
  },
  // ... more role dashboards
};
```

## Backend Middleware

### Permission Middleware

Location: `backend/src/middleware/permissionMiddleware.ts`

#### requirePermission

Protects routes requiring a specific permission:

```typescript
router.post(
  '/customers',
  authMiddleware,
  requirePermission('customers', 'create'),
  customerController.createCustomer
);
```

#### requireAnyPermission

Protects routes requiring any of multiple permissions (OR logic):

```typescript
router.get(
  '/reports',
  authMiddleware,
  requireAnyPermission([
    { module: 'reports', action: 'view' },
    { module: 'analytics', action: 'view' },
  ]),
  reportController.getReports
);
```

#### requireAllPermissions

Protects routes requiring all specified permissions (AND logic):

```typescript
router.post(
  '/customers/:id/approve',
  authMiddleware,
  requireAllPermissions([
    { module: 'customers', action: 'edit' },
    { module: 'customers', action: 'approve' },
  ]),
  customerController.approveCustomer
);
```

## Authorization Service

Location: `backend/src/services/authorization.service.ts`

The authorization service provides centralized permission checking logic:

```typescript
import { authorizationService } from '../services/authorization.service';

// Load complete authorization context
const context = await authorizationService.loadAuthorizationContext(userId);

// Check specific permission
const hasPermission = await authorizationService.hasPermission(userId, 'customers', 'create');

// Check if user can access a route
const canAccess = await authorizationService.canAccessRoute(userId, '/app/customers');

// Get accessible modules for sidebar
const modules = await authorizationService.getAccessibleModules(userId);

// Get user's permissions grouped by module
const permissions = await authorizationService.getUserPermissions(userId);
```

## System Roles

### Platform Owner
- Full platform access
- Can manage all tenants
- Can configure system settings

### Tenant Admin
- Full tenant access
- Can manage users, roles, permissions
- Can configure tenant settings
- Can view all tenant data

### Recovery Manager
- Manage recovery operations
- View all cases and customers
- Assign cases to teams
- Generate reports

### Team Leader
- Manage team operations
- View team cases and performance
- Assign cases to team members
- Approve team actions

### Recovery Agent
- Perform recovery activities
- View assigned cases
- Update case status
- Add notes and activities

### Legal Officer
- Handle legal aspects
- Review legal cases
- Approve legal actions
- Generate legal reports

### QA
- Quality assurance
- Review and audit cases
- Flag issues
- Generate QA reports

### Auditor
- Audit operations
- View audit logs
- Generate compliance reports
- Assess risk levels

### Read Only
- View-only access to assigned modules
- Cannot modify data
- Cannot perform actions

## Permission Actions

The following actions are available in the permission matrix:

- **view**: View data
- **create**: Create new records
- **edit**: Modify existing records
- **delete**: Remove records
- **assign**: Assign records to users/teams
- **approve**: Approve records/actions
- **export**: Export data
- **import**: Import data
- **configure**: Configure module settings

## Module Categories

### Overview
- Dashboard

### Recovery
- Customers
- Loans
- Cases
- Payments

### Analytics
- Reports

### AI
- AI Assistant (requires Professional subscription)

### Administration
- Users
- Roles
- Permissions
- Departments
- Teams
- Settings
- Organization

## Usage Examples

### Creating a Custom Role with Permissions

```typescript
// 1. Create the role
const roleResponse = await fetch('/api/v1/roles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Senior Recovery Agent',
    description: 'Can view and edit cases, but cannot delete',
    is_system_role: false,
  }),
});

const { data: role } = await roleResponse.json();

// 2. Get permission matrix
const matrixResponse = await fetch('/api/v1/roles/permission-matrix');
const { data: matrix } = await matrixResponse.json();

// 3. Select permissions to assign
const permissionIds = matrix
  .flatMap(module => module.permissions)
  .filter(p => 
    (p.module_code === 'cases' && ['view', 'edit', 'assign'].includes(p.action_code)) ||
    (p.module_code === 'customers' && p.action_code === 'view')
  )
  .map(p => p.id);

// 4. Assign permissions to role
await fetch(`/api/v1/roles/${role.id}/permissions`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ permission_matrix_ids: permissionIds }),
});
```

### Creating a User with Role Assignment

```typescript
const userResponse = await fetch('/api/v1/user-provisioning/provisioning', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    department_id: 'dept-uuid',
    team_id: 'team-uuid',
    role_id: 'role-uuid',
    status: 'active',
    send_welcome_email: true,
  }),
});
```

### Protecting a Backend Route

```typescript
import { requirePermission } from '../middleware/permissionMiddleware';

router.delete(
  '/customers/:id',
  authMiddleware,
  requirePermission('customers', 'delete'),
  customerController.deleteCustomer
);
```

### Conditionally Rendering a Button

```typescript
import { usePermission } from '../hooks/usePermissions';

function CustomerActions() {
  const { hasPermission: canDelete } = usePermission('customers', 'delete');
  const { hasPermission: canEdit } = usePermission('customers', 'edit');

  return (
    <>
      {canEdit && <Button>Edit</Button>}
      {canDelete && <Button color="error">Delete</Button>}
    </>
  );
}
```

## Testing

### End-to-End Test Checklist

1. **Role Creation**
   - [ ] Create custom role
   - [ ] Assign permissions
   - [ ] Verify permissions are saved
   - [ ] Clone role
   - [ ] Activate/deactivate role

2. **User Provisioning**
   - [ ] Create user with role
   - [ ] Assign to department and team
   - [ ] Verify user can login
   - [ ] Reset password
   - [ ] Lock/unlock user
   - [ ] Delete user

3. **Permission Enforcement**
   - [ ] User without permission cannot access page
   - [ ] User without permission cannot perform action
   - [ ] User with permission can access page
   - [ ] User with permission can perform action

4. **Dynamic Sidebar**
   - [ ] Sidebar shows only accessible modules
   - [ ] Sidebar updates when permissions change
   - [ ] Category grouping works correctly

5. **Dynamic Dashboard**
   - [ ] Dashboard loads based on role
   - [ ] Widgets display correctly
   - [ ] Dashboard updates when role changes

## Troubleshooting

### User cannot access a module

1. Check if the module is enabled for the tenant
2. Check if the user has a role assigned
3. Check if the role has view permission for the module
4. Check if the role is active

### Permission check failing

1. Verify the permission matrix entry exists
2. Check if the permission is assigned to the role
3. Ensure the module is enabled for the tenant
4. Check if the role is active

### Sidebar not showing modules

1. Check the `/api/v1/auth/accessible-modules` endpoint
2. Verify the user has view permissions
3. Check the modules configuration file
4. Ensure the module route is defined

### Dashboard not loading correctly

1. Check the user's role code
2. Verify the dashboard configuration exists for the role
3. Check the dashboard configuration file
4. Ensure widget types are implemented

## Security Considerations

1. **Always validate permissions on the backend** - Frontend checks are for UX only
2. **Use permission middleware** on all protected routes
3. **Cache authorization context** to reduce database queries
4. **Clear cache on role/permission changes** to ensure immediate effect
5. **Audit permission changes** for compliance and security
6. **Use least privilege principle** - grant only necessary permissions

## Future Enhancements

- [ ] Permission inheritance (parent roles)
- [ ] Time-based permissions (temporary access)
- [ ] Data-level permissions (row-level security)
- [ ] Permission templates
- [ ] Bulk permission assignment
- [ ] Permission audit logs
- [ ] Permission change notifications
