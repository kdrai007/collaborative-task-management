import type { Column, Comment, Task, User, Workspace } from "@repo/types";

export const API_BASE = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Standardized fetch wrapper that includes credentials and json headers.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.message || "API request failed");
  }

  // Handle case where body.data might be undefined, though technically
  // success true responses should have data or null
  return body.data as T;
}

export const columnApi = {
  create: (workspaceId: string, data: { title: string }) =>
    apiFetch<{ column: Column }>(`/workspaces/${workspaceId}/columns`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Backend only allows updating the title — do not send other Column fields
  update: (workspaceId: string, columnId: string, data: { title: string }) =>
    apiFetch<{ column: Column }>(
      `/workspaces/${workspaceId}/columns/${columnId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    ),
  // Backend returns null on delete, not the column
  delete: (workspaceId: string, columnId: string) =>
    apiFetch<null>(`/workspaces/${workspaceId}/columns/${columnId}`, {
      method: "DELETE",
    }),
};

export const taskApi = {
  get: (workspaceId: string, taskId: string) =>
    apiFetch<{ task: Task }>(`/workspaces/${workspaceId}/tasks/${taskId}`),
  // columnId is required by the backend create schema
  create: (
    workspaceId: string,
    data: {
      columnId: string;
      title: string;
      description?: string;
      priority?: Task["priority"];
      assigneeId?: string | null;
      dueDate?: string | null;
    },
  ) =>
    apiFetch<{ task: Task }>(`/workspaces/${workspaceId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Backend uses PATCH, not PUT
  update: (
    workspaceId: string,
    taskId: string,
    data: Partial<
      Pick<
        Task,
        | "title"
        | "description"
        | "priority"
        | "status"
        | "assigneeId"
        | "dueDate"
        | "columnId"
      >
    >,
  ) =>
    apiFetch<{ task: Task }>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  // Backend returns null on delete
  delete: (workspaceId: string, taskId: string) =>
    apiFetch<null>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
      method: "DELETE",
    }),
};

export const workspaceApi = {
  list: () => apiFetch<{ workspaces: Workspace[] }>("/workspaces"),
  // description is optional per the backend schema
  create: (data: { name: string; description?: string }) =>
    apiFetch<{ workspace: Workspace }>("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  get: (workspaceId: string) =>
    apiFetch<{ workspace: Workspace }>(`/workspaces/${workspaceId}`),
  // Admin-only: update name/description
  update: (
    workspaceId: string,
    data: { name?: string; description?: string },
  ) =>
    apiFetch<{ workspace: Workspace }>(`/workspaces/${workspaceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  // Admin-only: delete workspace (cascades to columns, tasks, comments)
  delete: (workspaceId: string) =>
    apiFetch<null>(`/workspaces/${workspaceId}`, {
      method: "DELETE",
    }),
  // Admin-only: add a member by email
  addMember: (
    workspaceId: string,
    data: { email: string; role: "admin" | "member" | "viewer" },
  ) =>
    apiFetch<{ workspace: Workspace }>(`/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Admin-only: remove a member
  removeMember: (workspaceId: string, userId: string) =>
    apiFetch<null>(`/workspaces/${workspaceId}/members/${userId}`, {
      method: "DELETE",
    }),
};

export const commentApi = {
  list: (workspaceId: string, taskId: string) =>
    apiFetch<{ comments: Comment[] }>(
      `/workspaces/${workspaceId}/tasks/${taskId}/comments`,
    ),
  add: (workspaceId: string, taskId: string, data: { body: string }) =>
    apiFetch<{ comment: Comment }>(
      `/workspaces/${workspaceId}/tasks/${taskId}/comments`,
      { method: "POST", body: JSON.stringify(data) },
    ),
  // Only the comment author can delete their own comment
  delete: (workspaceId: string, taskId: string, commentId: string) =>
    apiFetch<null>(
      `/workspaces/${workspaceId}/tasks/${taskId}/comments/${commentId}`,
      { method: "DELETE" },
    ),
};

export const authApi = {
  login: (credentials: Record<string, string>) =>
    apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data: Record<string, string>) =>
    apiFetch<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch<null>("/auth/logout", {
      method: "POST",
    }),

  me: () =>
    apiFetch<{ user: User }>("/auth/me", {
      method: "GET",
    }),
};
