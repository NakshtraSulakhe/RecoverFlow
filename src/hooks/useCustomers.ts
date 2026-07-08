import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { Customer, CustomerFormData, CustomerFilters, CustomerAddress, CustomerContact, CustomerEmployment, CustomerDocument, CustomerNote, CustomerTag } from '../types/customer.types';

const CUSTOMERS_QUERY_KEY = 'customers';

export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, filters],
    queryFn: () => apiClient.get<Customer[]>('/api/customers', filters),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id],
    queryFn: () => apiClient.get<Customer>(`/api/customers/${id}`),
    enabled: !!id,
  });
}

export function useCustomerByCode(customerCode: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, 'code', customerCode],
    queryFn: () => apiClient.get<Customer>(`/api/customers/code/${customerCode}`),
    enabled: !!customerCode,
  });
}

export function useCustomerSearch(searchTerm: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, 'search', searchTerm],
    queryFn: () => apiClient.get<Customer[]>('/api/customers/search', { search: searchTerm }),
    enabled: searchTerm.length > 2,
  });
}

export function useCustomerCount(filters?: Partial<CustomerFilters>) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, 'count', filters],
    queryFn: () => apiClient.get<{ count: number }>('/api/customers/count', filters),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => apiClient.post<Customer>('/api/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) =>
      apiClient.put<Customer>(`/api/customers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Customer>(`/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
    },
  });
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Customer>(`/api/customers/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
    },
  });
}

// Customer Addresses
export function useCustomerAddresses(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'addresses'],
    queryFn: () => apiClient.get<CustomerAddress[]>(`/api/customers/${customerId}/addresses`),
    enabled: !!customerId,
  });
}

export function useAddCustomerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerAddress>(`/api/customers/${customerId}/addresses`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'addresses'] });
    },
  });
}

// Customer Contacts
export function useCustomerContacts(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'contacts'],
    queryFn: () => apiClient.get<CustomerContact[]>(`/api/customers/${customerId}/contacts`),
    enabled: !!customerId,
  });
}

export function useAddCustomerContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerContact>(`/api/customers/${customerId}/contacts`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'contacts'] });
    },
  });
}

// Customer Employment
export function useCustomerEmployment(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'employment'],
    queryFn: () => apiClient.get<CustomerEmployment[]>(`/api/customers/${customerId}/employment`),
    enabled: !!customerId,
  });
}

export function useAddCustomerEmployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerEmployment>(`/api/customers/${customerId}/employment`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'employment'] });
    },
  });
}

// Customer Documents
export function useCustomerDocuments(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'documents'],
    queryFn: () => apiClient.get<CustomerDocument[]>(`/api/customers/${customerId}/documents`),
    enabled: !!customerId,
  });
}

export function useAddCustomerDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerDocument>(`/api/customers/${customerId}/documents`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'documents'] });
    },
  });
}

// Customer Notes
export function useCustomerNotes(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'notes'],
    queryFn: () => apiClient.get<CustomerNote[]>(`/api/customers/${customerId}/notes`),
    enabled: !!customerId,
  });
}

export function useAddCustomerNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerNote>(`/api/customers/${customerId}/notes`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'notes'] });
    },
  });
}

// Customer Tags
export function useCustomerTags(customerId: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId, 'tags'],
    queryFn: () => apiClient.get<CustomerTag[]>(`/api/customers/${customerId}/tags`),
    enabled: !!customerId,
  });
}

export function useAddCustomerTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: any }) =>
      apiClient.post<CustomerTag>(`/api/customers/${customerId}/tags`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'tags'] });
    },
  });
}

export function useRemoveCustomerTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, tagName }: { customerId: string; tagName: string }) =>
      apiClient.delete(`/api/customers/${customerId}/tags/${tagName}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.customerId, 'tags'] });
    },
  });
}
