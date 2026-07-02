import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { usageService, UsageDashboard } from '../services/api/usage.service';

export const useTenantUsage = (tenantId: string, params?: any, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['usage', tenantId, params],
    queryFn: () => usageService.getTenantUsage(tenantId, params),
    enabled: !!tenantId,
    ...options,
  });
};

export const useUsageSummary = (tenantId: string, params?: any, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['usage-summary', tenantId, params],
    queryFn: () => usageService.getUsageSummary(tenantId, params),
    enabled: !!tenantId,
    ...options,
  });
};

export const useUsageDashboard = (tenantId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['usage-dashboard', tenantId],
    queryFn: () => usageService.getUsageDashboard(tenantId),
    enabled: !!tenantId,
    ...options,
  });
};

export const useRecordUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => usageService.recordUsage(data),
    onSuccess: (_, { tenant_id }) => {
      if (tenant_id) {
        queryClient.invalidateQueries({ queryKey: ['usage', tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['usage-summary', tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['usage-dashboard', tenant_id] });
      }
    },
  });
};
