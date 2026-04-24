// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { columnApi } from '../lib/api';

export const columnKeys = {
    all: ['columns'] as const,
    list: (workspaceId: string) => [...columnKeys.all, workspaceId] as const,
    detail: (workspaceId: string, columnId: string) => [...columnKeys.list(workspaceId), columnId] as const,
}

