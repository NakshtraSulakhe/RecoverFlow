import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { Account, AccountFilters, AccountFormData } from '../types/account.types';

const ACCOUNTS_QUERY_KEY = 'accounts';

export function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, filters],
    queryFn: () => apiClient.get<Account[]>('/api/accounts', filters),
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, id],
    queryFn: () => apiClient.get<Account>(`/api/accounts/${id}`),
    enabled: !!id,
  });
}

export function useAccountByNumber(accountNumber: string) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, 'number', accountNumber],
    queryFn: () => apiClient.get<Account>(`/api/accounts/number/${accountNumber}`),
    enabled: !!accountNumber,
  });
}

export function useAccountsByCustomerId(customerId: string) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, 'customer', customerId],
    queryFn: () => apiClient.get<Account[]>(`/api/accounts/customer/${customerId}`),
    enabled: !!customerId,
  });
}

export function useAccountCount(filters?: Partial<AccountFilters>) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, 'count', filters],
    queryFn: () => apiClient.get<{ count: number }>('/api/accounts/count', filters),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountFormData) => apiClient.post<Account>('/api/accounts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountFormData> }) =>
      apiClient.put<Account>(`/api/accounts/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Account>(`/api/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
}

export function useRestoreAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Account>(`/api/accounts/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
}
