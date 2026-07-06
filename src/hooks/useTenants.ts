import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { tenantService, TenantStats, CreateTenantPayload } from '../services/api/tenant.service';
import { Tenant } from '../services/api/types';

export const useTenants = (params?: any, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => tenantService.getAllTenants(params),
    ...options,
  });
};

export const useTenant = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenantById(id),
    enabled: !!id,
    ...options,
  });
};

export const useTenantStats = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['tenant-stats', id],
    queryFn: () => tenantService.getTenantStats(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantPayload) => tenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) =>
      tenantService.updateTenant(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useSuspendTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.suspendTenant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
    },
  });
};

export const useActivateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.activateTenant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
    },
  });
};

export const useArchiveTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.archiveTenant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
    },
  });
};
