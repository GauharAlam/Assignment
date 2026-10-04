'use client';

import { useState } from 'react';
import { TaskStatus, CreateTaskPayload } from '@/types/task';

interface TaskFormProps {
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Form component for creating a new task.
 * Handles local validation before calling the parent's onSubmit.
 */
export default function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmed = title.trim();
    if (trimmed.length === 0) {
      setValidationError('Task title cannot be empty.');
      return;
    }
    if (trimmed.length > 255) {
      setValidationError('Task title must be 255 characters or fewer.');
      return;
    }

    await onSubmit({ title: trimmed, status });
    setTitle('');
    setStatus('todo');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Add New Task</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={isSubmitting}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder:text-slate-400"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="todo">📋 To Do</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="done">✅ Done</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white
                     hover:bg-blue-600 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {validationError && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
