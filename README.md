# Mini Task Board

A small full-stack task management application built with **Next.js 16**, **TypeScript**, **React**, and **MySQL**.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MySQL](https://img.shields.io/badge/MySQL-8-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)

## Architecture Decision: Next.js API Routes (not Express)

I chose **Next.js App Router API routes** instead of a separate Express server for the following reasons:

1. **Shared TypeScript types** — Frontend and backend live in the same project, so types defined in `src/types/task.ts` are imported directly by both API routes and React components. No code generation or copy-paste needed.
2. **Simpler deployment** — One project, one `npm run dev`, one port. No need to configure CORS or proxy between two servers.
3. **Colocation** — API routes sit alongside the pages that consume them (`src/app/api/tasks/`), making the codebase easy to navigate.

## Features

- **Create tasks** with a title and status (To Do / In Progress / Done)
- **Update task status** via dropdown on each card
- **Delete tasks** with a single click
- **Optimistic UI updates** — status changes and deletes reflect instantly, with rollback on error
- **Input validation** — both client-side and server-side (no empty titles, max 255 chars, valid status)
- **Loading and error states** — spinner while fetching, error banner with "Try again" button
- **Parameterized SQL queries** — all database queries use `?` placeholders (no string concatenation)
- **Shared TypeScript types** — `Task`, `ApiResponse<T>`, `CreateTaskPayload`, etc. used across the stack

## Project Structure

```
├── db/
│   ├── schema.sql          # Database & table creation
│   └── seed.sql            # Sample seed data
├── src/
│   ├── app/
│   │   ├── api/tasks/
│   │   │   ├── route.ts        # GET (list) + POST (create)
│   │   │   └── [id]/route.ts   # PATCH (update status) + DELETE
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main task board page
│   ├── components/
│   │   ├── TaskCard.tsx        # Individual task card with controls
│   │   ├── TaskForm.tsx        # New task form with validation
│   │   └── TaskList.tsx        # Task list or empty state
│   ├── lib/
│   │   └── db.ts               # MySQL connection pool
│   └── types/
│       └── task.ts             # Shared TypeScript types
├── .env.example                # Environment variable template
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 5.7 (MySQL 8 recommended)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mini-task-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

**Option A: Using Docker (Recommended — fastest):**
```bash
docker compose up -d
```
This automatically boots MySQL 8 on port 3306, creates the database, and executes both `schema.sql` and `seed.sql`.

**Option B: Using local MySQL:**
Make sure MySQL is running, then execute the schema and seed files:

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

This creates the `mini_task_board` database with a `tasks` table and inserts 6 sample tasks.

#### Table Schema

```sql
CREATE TABLE tasks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  status     ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Configure environment variables

Copy the example env file and update with your MySQL credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mini_task_board
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method   | Endpoint          | Description                  | Body                            |
| -------- | ----------------- | ---------------------------- | ------------------------------- |
| `GET`    | `/api/tasks`      | List all tasks (newest first)| —                               |
| `POST`   | `/api/tasks`      | Create a new task            | `{ title, status }`            |
| `PATCH`  | `/api/tasks/:id`  | Update a task's status       | `{ status }`                   |
| `DELETE` | `/api/tasks/:id`  | Delete a task                | —                               |

### Error Responses

All endpoints return a consistent JSON shape:

```json
{
  "error": "Human-readable error message"
}
```

With appropriate HTTP status codes: `400` (validation), `404` (not found), `500` (server error).

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Next.js API Routes (server-side route handlers)
- **Database**: MySQL with `mysql2` (promise-based, connection pooling)
- **Styling**: Tailwind CSS with custom design tokens
