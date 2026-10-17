/**
 * Phase 1, File 04: Promises
 *
 * Topics covered:
 *  - What is a Promise?
 *  - Creating Promises
 *  - .then() and .catch() chaining
 *  - Promise.all() and Promise.allSettled()
 *  - Converting callbacks to Promises
 */

// ─────────────────────────────────────────────
// WHAT IS A PROMISE?
// ─────────────────────────────────────────────

// A Promise represents a value that will be available in the future.
// It can be in one of three states:
//   - pending   — operation hasn't completed yet
//   - fulfilled — operation succeeded (resolved with a value)
//   - rejected  — operation failed (rejected with an error)

// ─────────────────────────────────────────────
// CREATING A PROMISE
// ─────────────────────────────────────────────

const myPromise = new Promise((resolve, reject) => {
  const success = true; // change to false to test rejection

  setTimeout(() => {
    if (success) {
      resolve("Operation completed successfully!"); // fulfills the promise
    } else {
      reject(new Error("Operation failed!")); // rejects the promise
    }
  }, 500);
});

// Consuming a Promise with .then() and .catch()
myPromise
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  })
  .finally(() => {
    // .finally() runs regardless of success or failure
    console.log("Promise settled (success or fail).");
  });

// ─────────────────────────────────────────────
// PROMISE CHAINING (the solution to callback hell)
// ─────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) return reject(new Error("Invalid ID"));
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
    }, 300);
  });
}

// Chain promises — much cleaner than nested callbacks!
fetchUser(1)
  .then((user) => {
    console.log("Got user:", user.name);
    return fetchPosts(user.id); // return the next promise
  })
  .then((posts) => {
    console.log(`Got ${posts.length} posts`);
    return posts;
  })
  .catch((err) => {
    // One catch handles errors from any step above
    console.error("Something went wrong:", err.message);
  });

// ─────────────────────────────────────────────
// PROMISE.ALL — run multiple promises at once
// ─────────────────────────────────────────────

// Use when you need multiple async results and they don't depend on each other
// They run IN PARALLEL, not sequentially

const promise1 = delay(200).then(() => "result 1");
const promise2 = delay(100).then(() => "result 2");
const promise3 = delay(300).then(() => "result 3");

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log("All done:", results);
    // ["result 1", "result 2", "result 3"]
    // Order matches the array, not which finished first
  })
  .catch((err) => {
    // If ANY promise rejects, this catch runs immediately
    console.error("One failed:", err.message);
  });

// ─────────────────────────────────────────────
// PROMISE.ALLSETTLED — wait for all, even if some fail
// ─────────────────────────────────────────────

const p1 = Promise.resolve("success 1");
const p2 = Promise.reject(new Error("failed!"));
const p3 = Promise.resolve("success 3");

Promise.allSettled([p1, p2, p3]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("Fulfilled:", result.value);
    } else {
      console.log("Rejected:", result.reason.message);
    }
  });
});

// ─────────────────────────────────────────────
// CONVERTING A CALLBACK TO A PROMISE
// ─────────────────────────────────────────────

const fs = require("fs");

// Old way (callback)
function readFileCallback(path, callback) {
  fs.readFile(path, "utf8", callback);
}

// Wrapped in a Promise
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

readFilePromise(__filename)
  .then((content) => {
    const lines = content.split("\n").length;
    console.log(`This file has ${lines} lines.`);
  })
  .catch((err) => console.error("Error reading file:", err.message));

// Node.js built-in: util.promisify does this automatically!
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

readFileAsync(__filename, "utf8")
  .then((data) => console.log("File read successfully with promisify!"))
  .catch((err) => console.error(err));
