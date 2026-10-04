-- Mini Task Board: Database Schema
-- Run this file to set up the database and table.

CREATE DATABASE IF NOT EXISTS mini_task_board;
USE mini_task_board;

CREATE TABLE IF NOT EXISTS tasks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  status     ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
