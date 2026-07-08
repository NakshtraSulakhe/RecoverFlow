import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { Loan, LoanFilters, LoanFormData, LoanCollateral, LoanGuarantor } from '../types/loan.types';

const LOANS_QUERY_KEY = 'loans';

export function useLoans(filters?: LoanFilters) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, filters],
    queryFn: () => apiClient.get<Loan[]>('/api/loans', filters),
  });
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, id],
    queryFn: () => apiClient.get<Loan>(`/api/loans/${id}`),
    enabled: !!id,
  });
}

export function useLoanByNumber(loanNumber: string) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, 'number', loanNumber],
    queryFn: () => apiClient.get<Loan>(`/api/loans/number/${loanNumber}`),
    enabled: !!loanNumber,
  });
}

export function useLoansByCustomerId(customerId: string) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, 'customer', customerId],
    queryFn: () => apiClient.get<Loan[]>(`/api/loans/customer/${customerId}`),
    enabled: !!customerId,
  });
}

export function useLoanCount(filters?: Partial<LoanFilters>) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, 'count', filters],
    queryFn: () => apiClient.get<{ count: number }>('/api/loans/count', filters),
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanFormData) => apiClient.post<Loan>('/api/loans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY] });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoanFormData> }) =>
      apiClient.put<Loan>(`/api/loans/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Loan>(`/api/loans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY] });
    },
  });
}

export function useRestoreLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Loan>(`/api/loans/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY] });
    },
  });
}

// Loan Collateral
export function useLoanCollaterals(loanId: string) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, loanId, 'collaterals'],
    queryFn: () => apiClient.get<LoanCollateral[]>(`/api/loans/${loanId}/collaterals`),
    enabled: !!loanId,
  });
}

export function useAddLoanCollateral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, data }: { loanId: string; data: any }) =>
      apiClient.post<LoanCollateral>(`/api/loans/${loanId}/collaterals`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY, variables.loanId, 'collaterals'] });
    },
  });
}

// Loan Guarantors
export function useLoanGuarantors(loanId: string) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, loanId, 'guarantors'],
    queryFn: () => apiClient.get<LoanGuarantor[]>(`/api/loans/${loanId}/guarantors`),
    enabled: !!loanId,
  });
}

export function useAddLoanGuarantor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, data }: { loanId: string; data: any }) =>
      apiClient.post<LoanGuarantor>(`/api/loans/${loanId}/guarantors`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY, variables.loanId, 'guarantors'] });
    },
  });
}
