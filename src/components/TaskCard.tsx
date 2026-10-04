'use client';

import { Task, TaskStatus } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isUpdating: boolean;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; emoji: string; color: string }> = {
  todo: { label: 'To Do', emoji: '📋', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  'in-progress': { label: 'In Progress', emoji: '🔄', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  done: { label: 'Done', emoji: '✅', color: 'bg-green-100 text-green-800 border-green-200' },
};

/**
 * Displays a single task with status-change controls and a delete button.
 */
export default function TaskCard({ task, onStatusChange, onDelete, isUpdating }: TaskCardProps) {
  const config = STATUS_CONFIG[task.status];
  const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group rounded-xl bg-white p-5 shadow-sm border border-slate-200
                  hover:shadow-md transition-all duration-200
                  ${isUpdating ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-slate-800 break-words
                        ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}
          >
            {task.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Created {createdDate}</p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${config.color}`}
        >
          {config.emoji} {config.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          disabled={isUpdating}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Change status for task: ${task.title}`}
        >
          <option value="todo">📋 To Do</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="done">✅ Done</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          disabled={isUpdating}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500
                     hover:bg-red-50 hover:text-red-600 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete task: ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
