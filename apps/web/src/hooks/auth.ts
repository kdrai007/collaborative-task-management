import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api';

export const authKeys = {
  me: ['me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(),
    retry: false, // Do not retry on 401s
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Seed the me query with the returned user to avoid a refetch
      queryClient.setQueryData(authKeys.me, data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Redirect FIRST — before clearing the cache.
      // If we clear the cache first, useMe() returns null, Header unmounts,
      // and any inline .mutate() onSuccess callbacks get garbage collected.
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}
