/**
 * Phase 1, File 07: File System (fs module)
 *
 * Topics covered:
 *  - Reading files (sync and async)
 *  - Writing files
 *  - Appending to files
 *  - Deleting files
 *  - Working with directories
 *  - Using fs/promises (modern async API)
 */

const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// We'll work in a temp directory for these examples
const tmpDir = path.join(__dirname, "tmp-examples");

// ─────────────────────────────────────────────
// SYNCHRONOUS FILE OPERATIONS (blocking)
// ─────────────────────────────────────────────

// Synchronous = blocks Node.js until complete.
// Avoid in production servers (blocks all other requests!)
// OK to use in scripts or startup code.

// Create the temp directory if it doesn't exist
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
  console.log("Created tmp-examples directory");
}

// Write a file (sync)
const filePath = path.join(tmpDir, "example.txt");
fs.writeFileSync(filePath, "Hello from Node.js!\nLine 2\nLine 3");
console.log("File written (sync)");

// Read a file (sync)
const content = fs.readFileSync(filePath, "utf8");
console.log("File contents:\n", content);

// Append to a file (sync)
fs.appendFileSync(filePath, "\nAppended line");

// Check if file exists
console.log("File exists:", fs.existsSync(filePath));

// Get file info
const stats = fs.statSync(filePath);
console.log("File size:", stats.size, "bytes");
console.log("Is file:", stats.isFile());
console.log("Is directory:", stats.isDirectory());

// ─────────────────────────────────────────────
// ASYNCHRONOUS FILE OPERATIONS (non-blocking)
// ─────────────────────────────────────────────

// This is the preferred way in Node.js — doesn't block the event loop

const asyncFilePath = path.join(tmpDir, "async-example.txt");

// Write (async with callback)
fs.writeFile(asyncFilePath, "Written asynchronously!", "utf8", (err) => {
  if (err) {
    console.error("Write error:", err.message);
    return;
  }
  console.log("File written (async callback)");

  // Read it back
  fs.readFile(asyncFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:", err.message);
      return;
    }
    console.log("Read back:", data);
  });
});

// ─────────────────────────────────────────────
// MODERN: fs/promises with async/await
// ─────────────────────────────────────────────

// This is the cleanest approach for modern Node.js code

async function workWithFiles() {
  const promisesFilePath = path.join(tmpDir, "promises-example.txt");

  try {
    // Write file
    await fsPromises.writeFile(promisesFilePath, "Written with fs/promises!\n");
    console.log("Written with fs/promises");

    // Append to file
    await fsPromises.appendFile(promisesFilePath, "Appended line\n");

    // Read file
    const data = await fsPromises.readFile(promisesFilePath, "utf8");
    console.log("Contents:", data);

    // Get file stats
    const stats = await fsPromises.stat(promisesFilePath);
    console.log("File size:", stats.size, "bytes");

    // Rename a file
    const renamedPath = path.join(tmpDir, "renamed.txt");
    await fsPromises.rename(promisesFilePath, renamedPath);
    console.log("File renamed");

    // Delete a file
    await fsPromises.unlink(renamedPath);
    console.log("File deleted");

  } catch (err) {
    console.error("File operation failed:", err.message);
  }
}

workWithFiles();

// ─────────────────────────────────────────────
// WORKING WITH DIRECTORIES
// ─────────────────────────────────────────────

async function workWithDirectories() {
  const newDir = path.join(tmpDir, "subdir");

  try {
    // Create directory
    await fsPromises.mkdir(newDir, { recursive: true });
    console.log("Directory created");

    // Create some files in it
    await fsPromises.writeFile(path.join(newDir, "file1.txt"), "Content 1");
    await fsPromises.writeFile(path.join(newDir, "file2.txt"), "Content 2");

    // List directory contents
    const files = await fsPromises.readdir(newDir);
    console.log("Files in directory:", files);

    // Delete directory and its contents
    await fsPromises.rm(newDir, { recursive: true });
    console.log("Directory removed");

  } catch (err) {
    console.error("Directory operation failed:", err.message);
  }
}

workWithDirectories();

// ─────────────────────────────────────────────
// PRACTICAL EXAMPLE: Simple JSON data store
// ─────────────────────────────────────────────

// A common pattern in small Node.js apps is to use a JSON file as a simple database.
// (Not for production — use a real DB — but great for learning!)

const DATA_FILE = path.join(tmpDir, "data.json");

async function readData() {
  try {
    const raw = await fsPromises.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return []; // return empty array if file doesn't exist yet
  }
}

async function writeData(data) {
  // JSON.stringify(data, null, 2) — pretty-print with 2-space indent
  await fsPromises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function addTodo(title) {
  const todos = await readData();
  const newTodo = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  await writeData(todos);
  return newTodo;
}

(async () => {
  await addTodo("Learn Node.js");
  await addTodo("Build an API");
  const todos = await readData();
  console.log("Todos stored in JSON:", todos);

  // Clean up: remove tmp directory
  setTimeout(async () => {
    try {
      await fsPromises.rm(tmpDir, { recursive: true, force: true });
      console.log("Cleaned up tmp-examples directory");
    } catch (err) {
      // ignore
    }
  }, 2000);
})();
