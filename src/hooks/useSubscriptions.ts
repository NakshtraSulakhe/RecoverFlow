import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { subscriptionService, Subscription } from '../services/api/subscriptionService';

export const useSubscriptions = (params?: any, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptionService.getAllSubscriptions(params),
    ...options,
  });
};

export const useSubscription = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getSubscriptionById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Subscription>) => subscriptionService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      subscriptionService.updateSubscription(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; plan_code: string; plan_name: string; amount: number }) =>
      subscriptionService.upgradeSubscription(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};

export const useSuspendSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionService.suspendSubscription(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};

export const useActivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionService.activateSubscription(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionService.cancelSubscription(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionService.renewSubscription(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
    },
  });
};
