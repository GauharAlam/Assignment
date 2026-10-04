'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskPayload, ApiResponse } from '@/types/task';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  /** Fetch all tasks from the API */
  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/tasks');
      const json: ApiResponse<Task[]> = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to fetch tasks');
      }

      setTasks(json.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /** Create a new task */
  const handleCreate = async (payload: CreateTaskPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<Task> = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to create task');
      }

      if (json.data) {
        setTasks((prev) => [json.data!, ...prev]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Update a task's status (with optimistic UI) */
  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setUpdatingIds((prev) => new Set(prev).add(id));
    setError(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json: ApiResponse<Task> = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to update task');
      }

      // Replace with server truth
      if (json.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? json.data! : t))
        );
      }
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  /** Delete a task (with optimistic UI) */
  const handleDelete = async (id: number) => {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setUpdatingIds((prev) => new Set(prev).add(id));
    setError(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const json: ApiResponse<{ deleted: true }> = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to delete task');
      }
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">📋 Mini Task Board</h1>
          <p className="text-slate-500 mt-2">Manage your tasks with ease</p>
        </header>

        <TaskForm onSubmit={handleCreate} isSubmitting={isSubmitting} />

        {error && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
            <p className="text-slate-400 mt-4">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            updatingIds={updatingIds}
          />
        )}

        <footer className="mt-12 text-center text-xs text-slate-400">
          {tasks.length > 0 && (
            <p>
              {tasks.filter((t) => t.status === 'done').length} of {tasks.length} tasks completed
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
