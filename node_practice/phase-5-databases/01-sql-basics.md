# SQL Basics

SQL (Structured Query Language) is used to interact with relational databases. This guide covers the fundamentals you need for backend development.

---

## Setting Up SQLite (Quick Start)

```bash
npm install better-sqlite3
```

```js
const Database = require('better-sqlite3');
const db = new Database('mydb.db');
```

For PostgreSQL:
```bash
npm install pg
```

---

## Creating Tables

```sql
-- Create a users table
CREATE TABLE IF NOT EXISTS users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT    NOT NULL,
  email    TEXT    NOT NULL UNIQUE,
  age      INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create a posts table with a foreign key
CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT    NOT NULL,
  body       TEXT    NOT NULL,
  published  INTEGER DEFAULT 0,  -- 0 = false, 1 = true in SQLite
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## INSERT — Create Records

```sql
-- Insert a single user
INSERT INTO users (name, email, age)
VALUES ('Alice', 'alice@example.com', 25);

-- Insert multiple users at once
INSERT INTO users (name, email) VALUES
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');
```

---

## SELECT — Read Records

```sql
-- Get all users
SELECT * FROM users;

-- Get specific columns
SELECT id, name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE email = 'alice@example.com';
SELECT * FROM users WHERE name LIKE 'A%';  -- starts with A

-- Multiple conditions
SELECT * FROM users WHERE age >= 18 AND age <= 30;
SELECT * FROM users WHERE name = 'Alice' OR name = 'Bob';

-- Order results
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users ORDER BY created_at DESC;

-- Limit and offset (pagination)
SELECT * FROM users LIMIT 10 OFFSET 20;  -- skip 20, take 10

-- Count
SELECT COUNT(*) as total FROM users;
SELECT COUNT(*) as total FROM users WHERE age > 18;
```

---

## UPDATE — Modify Records

```sql
-- Update one user
UPDATE users SET name = 'Alicia' WHERE id = 1;

-- Update multiple fields
UPDATE users SET name = 'Alicia', age = 26 WHERE id = 1;

-- Update all rows matching condition
UPDATE posts SET published = 1 WHERE user_id = 1;
```

---

## DELETE — Remove Records

```sql
-- Delete a specific record
DELETE FROM users WHERE id = 1;

-- Delete all records matching condition
DELETE FROM posts WHERE published = 0;

-- Delete all records (dangerous!)
DELETE FROM users;
```

---

## JOINs — Combine Tables

```sql
-- INNER JOIN — only rows with matching data in both tables
SELECT u.name, p.title
FROM posts p
INNER JOIN users u ON p.user_id = u.id;

-- LEFT JOIN — all posts, even those without a matching user
SELECT p.title, u.name
FROM posts p
LEFT JOIN users u ON p.user_id = u.id;

-- Get users and count their posts
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id;
```

---

## Aggregation

```sql
-- GROUP BY — aggregate data
SELECT user_id, COUNT(*) as post_count
FROM posts
GROUP BY user_id;

-- HAVING — filter aggregated results (like WHERE but for groups)
SELECT user_id, COUNT(*) as post_count
FROM posts
GROUP BY user_id
HAVING post_count > 2;

-- Aggregate functions
SELECT
  COUNT(*) as total,
  AVG(age) as avg_age,
  MIN(age) as min_age,
  MAX(age) as max_age
FROM users;
```

---

## Indexes

```sql
-- Create an index to speed up email lookups
CREATE INDEX idx_users_email ON users(email);

-- Create a composite index
CREATE INDEX idx_posts_user_published ON posts(user_id, published);
```

---

## Transactions

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- If something goes wrong:
ROLLBACK;
```

---

## Using SQL with Node.js (better-sqlite3)

```js
const Database = require('better-sqlite3');
const db = new Database('app.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

// Insert
const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
const result = insert.run('Alice', 'alice@example.com');
console.log('Inserted id:', result.lastInsertRowid);

// Select one
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
const user = getUser.get(result.lastInsertRowid);
console.log('User:', user);

// Select many
const getAllUsers = db.prepare('SELECT * FROM users');
const users = getAllUsers.all();
console.log('All users:', users);

// Update
const update = db.prepare('UPDATE users SET name = ? WHERE id = ?');
update.run('Alicia', result.lastInsertRowid);

// Delete
const del = db.prepare('DELETE FROM users WHERE id = ?');
del.run(result.lastInsertRowid);

// Transaction
const transfer = db.transaction((fromId, toId, amount) => {
  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amount, fromId);
  db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, toId);
});

transfer(1, 2, 50);
```

See `03-sqlite-example.js` for a complete API example with SQLite.
