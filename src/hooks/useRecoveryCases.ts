import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { RecoveryCase, RecoveryCaseFilters, RecoveryCaseFormData, CaseAssignment, CaseHistory, CaseTag, CaseNote, DashboardStats } from '../types/recovery-case.types';

const RECOVERY_CASES_QUERY_KEY = 'recovery-cases';

export function useRecoveryCases(filters?: RecoveryCaseFilters) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, filters],
    queryFn: () => apiClient.get<RecoveryCase[]>('/api/recovery-cases', filters),
  });
}

export function useRecoveryCase(id: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, id],
    queryFn: () => apiClient.get<RecoveryCase>(`/api/recovery-cases/${id}`),
    enabled: !!id,
  });
}

export function useRecoveryCaseByNumber(caseNumber: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, 'number', caseNumber],
    queryFn: () => apiClient.get<RecoveryCase>(`/api/recovery-cases/number/${caseNumber}`),
    enabled: !!caseNumber,
  });
}

export function useRecoveryCasesByLoanId(loanId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, 'loan', loanId],
    queryFn: () => apiClient.get<RecoveryCase[]>(`/api/recovery-cases/loan/${loanId}`),
    enabled: !!loanId,
  });
}

export function useRecoveryCasesByCustomerId(customerId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, 'customer', customerId],
    queryFn: () => apiClient.get<RecoveryCase[]>(`/api/recovery-cases/customer/${customerId}`),
    enabled: !!customerId,
  });
}

export function useRecoveryCaseCount(filters?: Partial<RecoveryCaseFilters>) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, 'count', filters],
    queryFn: () => apiClient.get<{ count: number }>('/api/recovery-cases/count', filters),
  });
}

export function useCreateRecoveryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecoveryCaseFormData) => apiClient.post<RecoveryCase>('/api/recovery-cases', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY] });
    },
  });
}

export function useUpdateRecoveryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecoveryCaseFormData> }) =>
      apiClient.put<RecoveryCase>(`/api/recovery-cases/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteRecoveryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<RecoveryCase>(`/api/recovery-cases/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY] });
    },
  });
}

export function useRestoreRecoveryCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<RecoveryCase>(`/api/recovery-cases/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY] });
    },
  });
}

// Case Assignment
export function useAssignCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.post<RecoveryCase>(`/api/recovery-cases/${id}/assign`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id] });
    },
  });
}

export function useCaseAssignments(caseId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, caseId, 'assignments'],
    queryFn: () => apiClient.get<CaseAssignment[]>(`/api/recovery-cases/${caseId}/assignments`),
    enabled: !!caseId,
  });
}

// Case History
export function useCaseHistory(caseId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, caseId, 'history'],
    queryFn: () => apiClient.get<CaseHistory[]>(`/api/recovery-cases/${caseId}/history`),
    enabled: !!caseId,
  });
}

export function useAddCaseHistoryEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.post<CaseHistory>(`/api/recovery-cases/${id}/history`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id, 'history'] });
    },
  });
}

// Case Tags
export function useCaseTags(caseId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, caseId, 'tags'],
    queryFn: () => apiClient.get<CaseTag[]>(`/api/recovery-cases/${caseId}/tags`),
    enabled: !!caseId,
  });
}

export function useAddCaseTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.post<CaseTag>(`/api/recovery-cases/${id}/tags`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id, 'tags'] });
    },
  });
}

export function useRemoveCaseTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagName }: { id: string; tagName: string }) =>
      apiClient.delete(`/api/recovery-cases/${id}/tags/${tagName}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id, 'tags'] });
    },
  });
}

// Case Notes
export function useCaseNotes(caseId: string) {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, caseId, 'notes'],
    queryFn: () => apiClient.get<CaseNote[]>(`/api/recovery-cases/${caseId}/notes`),
    enabled: !!caseId,
  });
}

export function useAddCaseNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.post<CaseNote>(`/api/recovery-cases/${id}/notes`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECOVERY_CASES_QUERY_KEY, variables.id, 'notes'] });
    },
  });
}

// Dashboard Stats
export function useDashboardStats() {
  return useQuery({
    queryKey: [RECOVERY_CASES_QUERY_KEY, 'dashboard', 'stats'],
    queryFn: () => apiClient.get<DashboardStats>('/api/recovery-cases/dashboard/stats'),
  });
}
