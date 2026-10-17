/**
 * Phase 1, File 05: Async/Await
 *
 * Topics covered:
 *  - async functions
 *  - await keyword
 *  - try/catch for error handling
 *  - Running async operations in parallel with await
 *  - Real-world patterns used in Node.js backends
 */

// ─────────────────────────────────────────────
// WHAT IS ASYNC/AWAIT?
// ─────────────────────────────────────────────

// async/await is syntactic sugar over Promises.
// It makes asynchronous code look and behave more like synchronous code.
// Under the hood, it's still Promises!

// Any function marked with 'async' ALWAYS returns a Promise.

async function sayHello() {
  return "Hello!"; // automatically wrapped in a resolved Promise
}

sayHello().then(console.log); // Hello!

// ─────────────────────────────────────────────
// AWAIT
// ─────────────────────────────────────────────

// 'await' pauses execution inside an async function until the Promise resolves.
// You can ONLY use 'await' inside an 'async' function.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) return reject(new Error("Invalid user ID"));
      resolve({ id, name: "Alice", email: "alice@example.com" });
    }, 300);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, userId, title: "My first post" },
        { id: 2, userId, title: "Learning Node.js" },
      ]);
    }, 200);
  });
}

// Compare Promise chaining vs async/await:

// Promise chaining version:
function getUserPostsPromise(userId) {
  return fetchUser(userId)
    .then((user) => fetchPosts(user.id))
    .then((posts) => posts)
    .catch((err) => console.error(err.message));
}

// async/await version (same result, cleaner code):
async function getUserPostsAsync(userId) {
  const user = await fetchUser(userId);   // wait for user
  const posts = await fetchPosts(user.id); // wait for posts
  return posts;
}

getUserPostsAsync(1).then((posts) => console.log("Posts:", posts));

// ─────────────────────────────────────────────
// ERROR HANDLING WITH TRY/CATCH
// ─────────────────────────────────────────────

async function getUserSafe(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    console.log(`User: ${user.name}, Posts: ${posts.length}`);
    return { user, posts };
  } catch (err) {
    // Any awaited Promise rejection lands here
    console.error("Error in getUserSafe:", err.message);
    return null;
  }
}

getUserSafe(1);    // works fine
getUserSafe(-1);   // Error: Invalid user ID

// ─────────────────────────────────────────────
// PARALLEL EXECUTION WITH ASYNC/AWAIT
// ─────────────────────────────────────────────

// WRONG: sequential (slow) — each waits for the previous
async function sequentialFetch() {
  console.time("sequential");
  const user1 = await fetchUser(1); // waits ~300ms
  const user2 = await fetchUser(2); // waits another ~300ms
  console.timeEnd("sequential");    // ~600ms total
  return [user1, user2];
}

// RIGHT: parallel (fast) — all start at the same time
async function parallelFetch() {
  console.time("parallel");
  const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(2)]);
  console.timeEnd("parallel"); // ~300ms total
  return [user1, user2];
}

sequentialFetch();
parallelFetch();

// ─────────────────────────────────────────────
// ASYNC/AWAIT IN EXPRESS ROUTE HANDLERS
// ─────────────────────────────────────────────

// This is the pattern you'll use constantly in Express:

// const express = require('express');
// const app = express();
//
// app.get('/users/:id', async (req, res) => {
//   try {
//     const user = await getUserFromDatabase(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// ─────────────────────────────────────────────
// READING FILES WITH ASYNC/AWAIT
// ─────────────────────────────────────────────

// Node.js has a modern promise-based fs module
const { readFile, writeFile } = require("fs/promises");
const path = require("path");

async function readThisFile() {
  try {
    const content = await readFile(__filename, "utf8");
    const lineCount = content.split("\n").length;
    console.log(`This file has ${lineCount} lines.`);
  } catch (err) {
    console.error("Could not read file:", err.message);
  }
}

readThisFile();

// ─────────────────────────────────────────────
// IIFE PATTERN (Immediately Invoked Function Expression)
// ─────────────────────────────────────────────

// Since top-level await isn't always available in CommonJS,
// wrap your async code in an immediately-invoked async function:

(async () => {
  console.log("Starting async IIFE...");
  await delay(100);
  console.log("Done!");
})();
