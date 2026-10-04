import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Task, CreateTaskPayload, ApiResponse } from '@/types/task';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const VALID_STATUSES = ['todo', 'in-progress', 'done'] as const;

/**
 * GET /api/tasks — Fetch all tasks, ordered by creation date (newest first).
 */
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC'
    );

    const tasks: Task[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      created_at: row.created_at,
    }));

    return NextResponse.json<ApiResponse<Task[]>>({ data: tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks — Create a new task.
 * Body: { title: string, status: TaskStatus }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskPayload = await request.json();

    // --- Validation ---
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Task title is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (body.title.trim().length > 255) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Task title must be 255 characters or fewer' },
        { status: 400 }
      );
    }

    if (!body.status || !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Status must be one of: todo, in-progress, done' },
        { status: 400 }
      );
    }

    // --- Insert (parameterized query) ---
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, status) VALUES (?, ?)',
      [body.title.trim(), body.status]
    );

    // Fetch the newly created task to return it
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, status, created_at FROM tasks WHERE id = ?',
      [result.insertId]
    );

    const newTask: Task = {
      id: rows[0].id,
      title: rows[0].title,
      status: rows[0].status,
      created_at: rows[0].created_at,
    };

    return NextResponse.json<ApiResponse<Task>>({ data: newTask }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
