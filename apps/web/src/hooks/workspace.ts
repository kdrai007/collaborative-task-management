import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../lib/api';

// ---------------------------------------------------------------------------
// Cache key factory
// Hierarchy matters:
//   workspaceKeys.all         → matches ALL workspace queries
//   workspaceKeys.list()      → matches only the list query
//   workspaceKeys.detail(id)  → matches only one specific workspace
//
// So invalidateQueries({ queryKey: workspaceKeys.all }) busts everything,
// while workspaceKeys.detail(id) only busts that one workspace.
// ---------------------------------------------------------------------------
export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspaceKeys.all, 'list'] as const,
  detail: (id: string) => [...workspaceKeys.all, id] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all workspaces the current user belongs to. */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: () => workspaceApi.list(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/** Fetch a single workspace by ID. */
export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceApi.get(workspaceId),
    enabled: !!workspaceId, // don't run if workspaceId is empty
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Create a new workspace and refresh the list. */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workspaceApi.create,
    onSuccess: () => {
      // Bust the list so the new workspace appears immediately
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}
