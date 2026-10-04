/**
 * Shared types for the Task entity, used by both frontend and backend.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: string; // ISO 8601 date string
}

export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
