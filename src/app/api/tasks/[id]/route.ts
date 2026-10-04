import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Task, UpdateTaskStatusPayload, ApiResponse } from '@/types/task';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const VALID_STATUSES = ['todo', 'in-progress', 'done'] as const;

/**
 * PATCH /api/tasks/:id — Update a task's status.
 * Body: { status: TaskStatus }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (isNaN(taskId) || taskId <= 0) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const body: UpdateTaskStatusPayload = await request.json();

    if (!body.status || !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Status must be one of: todo, in-progress, done' },
        { status: 400 }
      );
    }

    // --- Update (parameterized query) ---
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [body.status, taskId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Fetch the updated task
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, status, created_at FROM tasks WHERE id = ?',
      [taskId]
    );

    const updatedTask: Task = {
      id: rows[0].id,
      title: rows[0].title,
      status: rows[0].status,
      created_at: rows[0].created_at,
    };

    return NextResponse.json<ApiResponse<Task>>({ data: updatedTask });
  } catch (error) {
    console.error('PATCH /api/tasks/:id error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/:id — Delete a task.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (isNaN(taskId) || taskId <= 0) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM tasks WHERE id = ?',
      [taskId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ deleted: true }>>({ data: { deleted: true } });
  } catch (error) {
    console.error('DELETE /api/tasks/:id error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
