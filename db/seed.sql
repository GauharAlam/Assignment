-- Mini Task Board: Seed Data
-- Run this after schema.sql to populate sample tasks.

USE mini_task_board;

INSERT INTO tasks (title, status) VALUES
  ('Set up project repository', 'done'),
  ('Design database schema', 'done'),
  ('Build API routes', 'in-progress'),
  ('Create frontend UI', 'todo'),
  ('Add input validation', 'todo'),
  ('Write README documentation', 'todo');
