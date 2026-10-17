# Phase 1 Exercises

Practice the concepts from this phase. Try to complete each exercise without looking at the solution first.

---

## Exercise 1: Variables and Functions

**Task:** Write a function `celsiusToFahrenheit(celsius)` that converts a temperature from Celsius to Fahrenheit.  
Formula: `F = (C × 9/5) + 32`

Then write `fahrenheitToCelsius(fahrenheit)` that does the reverse.

**Test cases:**
- `celsiusToFahrenheit(0)` → `32`
- `celsiusToFahrenheit(100)` → `212`
- `fahrenheitToCelsius(32)` → `0`

<details>
<summary>Solution</summary>

```js
const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;
const fahrenheitToCelsius = (f) => ((f - 32) * 5) / 9;

console.log(celsiusToFahrenheit(0));    // 32
console.log(celsiusToFahrenheit(100));  // 212
console.log(fahrenheitToCelsius(32));   // 0
```

</details>

---

## Exercise 2: Objects and Arrays

**Task:** Given an array of product objects, write functions to:
1. Get only products that are in stock (`inStock: true`)
2. Get just the product names
3. Find a product by its ID
4. Calculate the total value of all products (`price * quantity`)

```js
const products = [
  { id: 1, name: "Laptop", price: 999, quantity: 5, inStock: true },
  { id: 2, name: "Mouse", price: 29, quantity: 0, inStock: false },
  { id: 3, name: "Keyboard", price: 79, quantity: 12, inStock: true },
  { id: 4, name: "Monitor", price: 399, quantity: 3, inStock: true },
];
```

<details>
<summary>Solution</summary>

```js
const getInStock = (products) => products.filter(p => p.inStock);
const getNames = (products) => products.map(p => p.name);
const findById = (products, id) => products.find(p => p.id === id);
const totalValue = (products) =>
  products.reduce((sum, p) => sum + p.price * p.quantity, 0);

console.log(getInStock(products));  // Laptop, Keyboard, Monitor
console.log(getNames(products));    // ["Laptop", "Mouse", "Keyboard", "Monitor"]
console.log(findById(products, 3)); // { id: 3, name: "Keyboard", ... }
console.log(totalValue(products));  // 999*5 + 29*0 + 79*12 + 399*3 = 7122
```

</details>

---

## Exercise 3: Callbacks

**Task:** Write a `processData(data, callback)` function that:
1. Simulates processing time with `setTimeout` (500ms)
2. If `data` is falsy, calls the callback with an error
3. Otherwise calls the callback with `null` and the processed result (`data.toUpperCase()`)

<details>
<summary>Solution</summary>

```js
function processData(data, callback) {
  setTimeout(() => {
    if (!data) {
      callback(new Error("No data provided"), null);
    } else {
      callback(null, data.toUpperCase());
    }
  }, 500);
}

processData("hello", (err, result) => {
  if (err) return console.error(err.message);
  console.log(result); // HELLO
});

processData(null, (err, result) => {
  if (err) return console.error(err.message); // No data provided
  console.log(result);
});
```

</details>

---

## Exercise 4: Promises

**Task:** Create a Promise-based function `validateAge(age)` that:
- Resolves with `"Access granted"` if age >= 18
- Rejects with `"Access denied: must be 18 or older"` otherwise

Chain `.then()` and `.catch()` to handle both cases.

<details>
<summary>Solution</summary>

```js
function validateAge(age) {
  return new Promise((resolve, reject) => {
    if (age >= 18) {
      resolve("Access granted");
    } else {
      reject(new Error("Access denied: must be 18 or older"));
    }
  });
}

validateAge(21)
  .then(msg => console.log(msg))        // Access granted
  .catch(err => console.error(err.message));

validateAge(15)
  .then(msg => console.log(msg))
  .catch(err => console.error(err.message)); // Access denied: must be 18 or older
```

</details>

---

## Exercise 5: Async/Await

**Task:** Rewrite the `validateAge` function from Exercise 4 but this time:
1. Create an `async` function `checkAndLog(age)` that uses `await`
2. Use `try/catch` for error handling
3. Log the result (or error) inside the async function

<details>
<summary>Solution</summary>

```js
function validateAge(age) {
  return new Promise((resolve, reject) => {
    if (age >= 18) resolve("Access granted");
    else reject(new Error("Access denied: must be 18 or older"));
  });
}

async function checkAndLog(age) {
  try {
    const message = await validateAge(age);
    console.log(message);
  } catch (err) {
    console.error(err.message);
  }
}

checkAndLog(21);  // Access granted
checkAndLog(15);  // Access denied: must be 18 or older
```

</details>

---

## Exercise 6: File System

**Task:** Write an async function `countWords(filePath)` that:
1. Reads the content of a file
2. Counts and returns the number of words
3. Handles errors gracefully

Then write another function `saveStats(filePath, stats)` that saves a stats object to a JSON file.

<details>
<summary>Solution</summary>

```js
const { readFile, writeFile } = require("fs/promises");

async function countWords(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const words = content.trim().split(/\s+/).filter(Boolean);
    return words.length;
  } catch (err) {
    console.error("Error reading file:", err.message);
    return 0;
  }
}

async function saveStats(filePath, stats) {
  await writeFile(filePath, JSON.stringify(stats, null, 2), "utf8");
  console.log("Stats saved to", filePath);
}

(async () => {
  const wordCount = await countWords(__filename); // count words in this file
  console.log("Word count:", wordCount);
  await saveStats("./stats.json", { wordCount, timestamp: new Date().toISOString() });
})();
```

</details>

---

## Bonus Challenge

Build a simple command-line task manager that:
1. Reads tasks from a `tasks.json` file
2. Lets you add, list, and complete tasks
3. Saves changes back to the file

Use what you've learned about arrays, objects, async/await, and the fs module!
