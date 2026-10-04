'use client';

import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  updatingIds: Set<number>;
}

/**
 * Renders the list of tasks or an empty-state message.
 */
export default function TaskList({ tasks, onStatusChange, onDelete, updatingIds }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">📝</p>
        <p className="text-slate-500 text-lg">No tasks yet</p>
        <p className="text-slate-400 text-sm mt-1">Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          isUpdating={updatingIds.has(task.id)}
        />
      ))}
    </div>
  );
}
