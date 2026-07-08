import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { Product, ProductFilters, ProductFormData } from '../types/product.types';

const PRODUCTS_QUERY_KEY = 'products';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, filters],
    queryFn: () => apiClient.get<Product[]>('/api/products', filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => apiClient.get<Product>(`/api/products/${id}`),
    enabled: !!id,
  });
}

export function useProductByCode(productCode: string) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, 'code', productCode],
    queryFn: () => apiClient.get<Product>(`/api/products/code/${productCode}`),
    enabled: !!productCode,
  });
}

export function useProductCount(filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, 'count', filters],
    queryFn: () => apiClient.get<{ count: number }>('/api/products/count', filters),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => apiClient.post<Product>('/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      apiClient.put<Product>(`/api/products/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Product>(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Product>(`/api/products/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}
