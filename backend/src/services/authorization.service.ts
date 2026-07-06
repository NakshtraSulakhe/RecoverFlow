import { pool } from '../config/database';
import { logger } from '../utils/logger';

interface UserContext {
  id: string;
  tenant_id: string;
  email: string;
  role_code?: string;
  role_id?: string;
}

interface Permission {
  module_code: string;
  action_code: string;
  permission_code: string;
}

interface ModuleConfig {
  module_code: string;
  module_name: string;
  category: string;
  icon: string;
  route: string;
  is_core_module: boolean;
  required_subscription_tier: string | null;
}

interface AuthorizationContext {
  user: UserContext;
  organization: any;
  subscription: any;
  enabledModules: string[];
  role: any;
  permissions: Permission[];
  moduleConfigs: ModuleConfig[];
}

class AuthorizationService {
  private contextCache = new Map<string, AuthorizationContext>();

  /**
   * Load complete authorization context for a user
   * This is called on login and cached for subsequent requests
   */
  async loadAuthorizationContext(userId: string): Promise<AuthorizationContext> {
    // Check cache first
    if (this.contextCache.has(userId)) {
      return this.contextCache.get(userId)!;
    }

    const client = await pool.connect();
    try {
      // Load user with tenant info
      const userQuery = `
        SELECT 
          u.id, u.tenant_id, u.email, u.first_name, u.last_name, u.status,
          t.tenant_name, t.subscription_tier, t.subscription_status
        FROM users u
        JOIN tenants t ON u.tenant_id = t.id
        WHERE u.id = $1 AND u.deleted_at IS NULL
      `;
      const userResult = await client.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Load user's role
      const roleQuery = `
        SELECT r.id, r.code, r.name, r.description, r.is_system_role
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1 AND r.is_active = true
        LIMIT 1
      `;
      const roleResult = await client.query(roleQuery, [userId]);
      const role = roleResult.rows[0] || null;

      // Load subscription details
      const subscriptionQuery = `
        SELECT s.*, sp.name as plan_name, sp.features as plan_features
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        WHERE s.tenant_id = $1 AND s.status = 'active'
        ORDER BY s.created_at DESC
        LIMIT 1
      `;
      const subscriptionResult = await client.query(subscriptionQuery, [user.tenant_id]);
      const subscription = subscriptionResult.rows[0] || null;

      // Load enabled modules for tenant
      const modulesQuery = `
        SELECT tm.module_code
        FROM tenant_modules tm
        JOIN modules m ON tm.module_id = m.id
        WHERE tm.tenant_id = $1 AND tm.is_enabled = true
      `;
      const modulesResult = await client.query(modulesQuery, [user.tenant_id]);
      const enabledModules = modulesResult.rows.map(r => r.module_code);

      // Load permissions from permission matrix
      let permissions: Permission[] = [];
      if (role) {
        const permissionsQuery = `
          SELECT pm.module_code, pm.action_code, pm.permission_code
          FROM permission_matrix pm
          JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
          WHERE rpm.role_id = $1 AND pm.is_active = true
        `;
        const permissionsResult = await client.query(permissionsQuery, [role.id]);
        permissions = permissionsResult.rows;
      }

      // Load module configurations for sidebar/route generation
      const moduleConfigQuery = `
        SELECT module_code, module_name, category, icon, route, 
               is_core_module, required_subscription_tier
        FROM module_configurations
        WHERE is_active = true
        ORDER BY sort_order
      `;
      const moduleConfigResult = await client.query(moduleConfigQuery);
      const moduleConfigs = moduleConfigResult.rows;

      const context: AuthorizationContext = {
        user: {
          id: user.id,
          tenant_id: user.tenant_id,
          email: user.email,
          role_code: role?.code,
          role_id: role?.id,
        },
        organization: {
          tenant_id: user.tenant_id,
          tenant_name: user.tenant_name,
        },
        subscription: subscription ? {
          id: subscription.id,
          plan_name: subscription.plan_name,
          tier: subscription.plan_id,
          status: subscription.status,
          features: subscription.plan_features,
          max_users: subscription.max_users,
          max_customers: subscription.max_customers,
        } : null,
        enabledModules,
        role,
        permissions,
        moduleConfigs,
      };

      // Cache the context
      this.contextCache.set(userId, context);

      logger.info('Authorization context loaded', { userId, tenantId: user.tenant_id });

      return context;
    } finally {
      client.release();
    }
  }

  /**
   * Clear authorization context cache (call on logout, role change, etc.)
   */
  clearContextCache(userId: string): void {
    this.contextCache.delete(userId);
    logger.info('Authorization context cache cleared', { userId });
  }

  /**
   * Check if user has permission for a specific module and action
   * Access evaluation: Subscription → Enabled Modules → Role → Permissions
   */
  async hasPermission(
    userId: string,
    moduleCode: string,
    actionCode: string
  ): Promise<boolean> {
    const context = await this.loadAuthorizationContext(userId);

    // 1. Check subscription
    if (context.subscription) {
      const moduleConfig = context.moduleConfigs.find(m => m.module_code === moduleCode);
      if (moduleConfig?.required_subscription_tier) {
        // Check if subscription tier meets requirement
        // This is a simplified check - implement proper tier comparison
        if (context.subscription.tier !== moduleConfig.required_subscription_tier) {
          return false;
        }
      }
    }

    // 2. Check if module is enabled for tenant
    if (!context.enabledModules.includes(moduleCode)) {
      return false;
    }

    // 3. Check if user has a role
    if (!context.role) {
      return false;
    }

    // 4. Check specific permission
    const hasPermission = context.permissions.some(
      p => p.module_code === moduleCode && p.action_code === actionCode
    );

    return hasPermission;
  }

  /**
   * Check if user can access a route
   */
  async canAccessRoute(userId: string, route: string): Promise<boolean> {
    const context = await this.loadAuthorizationContext(userId);

    // Find module configuration for this route
    const moduleConfig = context.moduleConfigs.find(m => m.route === route);
    if (!moduleConfig) {
      // Route not in configuration - allow access (public route)
      return true;
    }

    // Check view permission for the module
    return this.hasPermission(userId, moduleConfig.module_code, 'view');
  }

  /**
   * Get accessible modules for sidebar generation
   * Returns modules user has view permission for
   */
  async getAccessibleModules(userId: string): Promise<ModuleConfig[]> {
    const context = await this.loadAuthorizationContext(userId);

    return context.moduleConfigs.filter(module => {
      // Check subscription tier
      if (module.required_subscription_tier && context.subscription) {
        // Simplified tier check
        if (context.subscription.tier !== module.required_subscription_tier) {
          return false;
        }
      }

      // Check if module is enabled
      if (!context.enabledModules.includes(module.module_code)) {
        return false;
      }

      // Check view permission
      return context.permissions.some(
        p => p.module_code === module.module_code && p.action_code === 'view'
      );
    });
  }

  /**
   * Get dashboard configuration for user's role
   */
  async getDashboardConfig(userId: string): Promise<any> {
    const context = await this.loadAuthorizationContext(userId);

    if (!context.role) {
      return null;
    }

    const client = await pool.connect();
    try {
      const query = `
        SELECT config
        FROM dashboard_configurations
        WHERE role_id = $1 AND is_default = true
        LIMIT 1
      `;
      const result = await client.query(query, [context.role.id]);
      
      if (result.rows.length > 0) {
        return result.rows[0].config;
      }

      // Return default empty dashboard if no config found
      return {
        widgets: [],
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get all permissions for a user (grouped by module)
   */
  async getUserPermissions(userId: string): Promise<Record<string, string[]>> {
    const context = await this.loadAuthorizationContext(userId);

    const grouped: Record<string, string[]> = {};

    context.permissions.forEach(permission => {
      if (!grouped[permission.module_code]) {
        grouped[permission.module_code] = [];
      }
      grouped[permission.module_code].push(permission.action_code);
    });

    return grouped;
  }

  /**
   * Check multiple permissions at once
   */
  async hasPermissions(
    userId: string,
    requiredPermissions: Array<{ module: string; action: string }>
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const req of requiredPermissions) {
      const key = `${req.module}.${req.action}`;
      results[key] = await this.hasPermission(userId, req.module, req.action);
    }

    return results;
  }

  /**
   * Filter actions based on user permissions
   * Used for showing/hiding action buttons
   */
  async filterActions<T extends { module: string; action: string }>(
    userId: string,
    actions: T[]
  ): Promise<T[]> {
    const context = await this.loadAuthorizationContext(userId);

    return actions.filter(action =>
      context.permissions.some(
        p => p.module_code === action.module && p.action_code === action.action
      )
    );
  }
}

export const authorizationService = new AuthorizationService();
