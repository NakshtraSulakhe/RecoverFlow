import { useState, useEffect } from 'react';
import { MODULES_CONFIG, ModuleConfig } from '../config/modules.config';

interface SidebarItem extends ModuleConfig {
  children?: SidebarItem[];
}

export const useSidebar = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccessibleModules();
  }, []);

  const loadAccessibleModules = async () => {
    setLoading(true);
    try {
      // Fetch user's accessible modules from backend
      const response = await fetch('/api/v1/auth/accessible-modules');
      const data = await response.json();

      if (data.success) {
        // Map backend module codes to frontend module configs
        const accessibleCodes = data.data.map((m: any) => m.module_code);
        const accessibleModules = MODULES_CONFIG.filter(m => 
          accessibleCodes.includes(m.code)
        );

        // Group by category
        const grouped = accessibleModules.reduce((acc: Record<string, SidebarItem[]>, module) => {
          if (!acc[module.category]) {
            acc[module.category] = [];
          }
          acc[module.category].push(module);
          return acc;
        }, {});

        // Convert to sidebar structure with categories as parent items
        const sidebarStructure: SidebarItem[] = Object.entries(grouped).map(([category, modules]) => ({
          id: category,
          code: category.toLowerCase().replace(/\s+/g, '_'),
          name: category,
          category: category as any,
          icon: getCategoryIcon(category),
          route: '',
          isCore: true,
          children: modules,
        }));

        setSidebarItems(sidebarStructure);
      } else {
        // Fallback: show all modules if API fails
        const grouped = MODULES_CONFIG.reduce((acc: Record<string, SidebarItem[]>, module) => {
          if (!acc[module.category]) {
            acc[module.category] = [];
          }
          acc[module.category].push(module);
          return acc;
        }, {});

        const sidebarStructure: SidebarItem[] = Object.entries(grouped).map(([category, modules]) => ({
          id: category,
          code: category.toLowerCase().replace(/\s+/g, '_'),
          name: category,
          category: category as any,
          icon: getCategoryIcon(category),
          route: '',
          isCore: true,
          children: modules,
        }));

        setSidebarItems(sidebarStructure);
      }
    } catch (error) {
      console.error('Failed to load accessible modules:', error);
      // Fallback to all modules
      const grouped = MODULES_CONFIG.reduce((acc: Record<string, SidebarItem[]>, module) => {
        if (!acc[module.category]) {
          acc[module.category] = [];
        }
        acc[module.category].push(module);
        return acc;
      }, {});

      const sidebarStructure: SidebarItem[] = Object.entries(grouped).map(([category, modules]) => ({
        id: category,
        code: category.toLowerCase().replace(/\s+/g, '_'),
        name: category,
        category: category as any,
        icon: getCategoryIcon(category),
        route: '',
        isCore: true,
        children: modules,
      }));

      setSidebarItems(sidebarStructure);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Overview': return 'LayoutDashboard';
      case 'Recovery': return 'Briefcase';
      case 'Analytics': return 'BarChart3';
      case 'AI': return 'Bot';
      case 'Administration': return 'Settings';
      default: return 'Menu';
    }
  };

  const checkPermission = async (moduleCode: string, action: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/auth/check-permission?module=${moduleCode}&action=${action}`);
      const data = await response.json();
      return data.success && data.data?.hasPermission || false;
    } catch (error) {
      console.error('Failed to check permission:', error);
      return false;
    }
  };

  return {
    sidebarItems,
    loading,
    checkPermission,
    reloadSidebar: loadAccessibleModules,
  };
};
