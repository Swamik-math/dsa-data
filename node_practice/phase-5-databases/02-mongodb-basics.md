# MongoDB Basics

MongoDB is a popular NoSQL database that stores data as JSON-like documents. It's flexible, scalable, and has a large ecosystem.

---

## Key Concepts

| SQL Term | MongoDB Term |
|----------|-------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| JOIN | $lookup (aggregation) |
| Primary Key | _id |
| Foreign Key | Reference (manual) |

---

## Setup

```bash
# Install Mongoose (MongoDB ODM for Node.js)
npm install mongoose
```

You also need MongoDB running. Options:
1. **MongoDB Atlas** (free cloud DB) — https://www.mongodb.com/cloud/atlas
2. **Local install** — https://www.mongodb.com/try/download/community
3. **Docker** — `docker run -d -p 27017:27017 mongo`

---

## Connecting with Mongoose

```js
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/myapp';
// or for Atlas: 'mongodb+srv://user:pass@cluster.mongodb.net/myapp'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));
```

---

## Defining a Schema and Model

```js
const { Schema, model } = require('mongoose');

// Define the schema (shape of documents)
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 150,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  tags: [String],  // array of strings
}, {
  timestamps: true,  // adds createdAt and updatedAt automatically
});

// Create a model from the schema
const User = model('User', userSchema);
```

---

## CRUD Operations

### Create

```js
// Method 1: new + save
const user = new User({ name: 'Alice', email: 'alice@example.com', age: 25 });
await user.save();

// Method 2: create (shorter)
const user = await User.create({ name: 'Bob', email: 'bob@example.com' });

console.log(user._id);  // MongoDB auto-generated ID
```

### Read

```js
// Get all
const users = await User.find();

// Filter
const adults = await User.find({ age: { $gte: 18 } });
const admins = await User.find({ role: 'admin' });

// Find one
const alice = await User.findOne({ email: 'alice@example.com' });
const user = await User.findById('64abc123...');  // by _id

// Select specific fields (projection)
const names = await User.find({}, 'name email');  // only name and email

// Sort, limit, skip (pagination)
const users = await User
  .find({ role: 'user' })
  .sort({ createdAt: -1 })  // newest first
  .limit(10)
  .skip(20);  // page 3

// Count
const total = await User.countDocuments({ role: 'user' });
```

### Update

```js
// Update one by ID
await User.findByIdAndUpdate(
  userId,
  { $set: { name: 'Alicia', age: 26 } },
  { new: true }  // return updated document
);

// Update one by filter
await User.updateOne(
  { email: 'alice@example.com' },
  { $set: { role: 'admin' } }
);

// Update many
await User.updateMany(
  { role: 'user' },
  { $set: { verified: false } }
);

// Common update operators:
// $set     — set field value
// $unset   — remove a field
// $inc     — increment a number
// $push    — add to an array
// $pull    — remove from an array
```

### Delete

```js
// Delete by ID
await User.findByIdAndDelete(userId);

// Delete one by filter
await User.deleteOne({ email: 'alice@example.com' });

// Delete many
await User.deleteMany({ role: 'banned' });
```

---

## Relationships

MongoDB handles relationships differently from SQL.

### Embedding (denormalized — best for small, frequently accessed data)
```js
const postSchema = new Schema({
  title: String,
  body: String,
  // Embed author info directly
  author: {
    name: String,
    email: String,
  },
  // Embed comments as an array
  comments: [{
    body: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
  }],
});
```

### Referencing (normalized — best for large related data)
```js
const postSchema = new Schema({
  title: String,
  body: String,
  // Reference to User model by ID
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

// Use .populate() to resolve the reference
const post = await Post.findById(id).populate('author', 'name email');
```

---

## Query Operators

```js
// Comparison
{ age: { $gt: 18 } }     // greater than
{ age: { $gte: 18 } }    // greater than or equal
{ age: { $lt: 65 } }     // less than
{ age: { $in: [18, 25, 30] } }  // in array
{ age: { $ne: 0 } }      // not equal

// Logical
{ $and: [{ age: { $gte: 18 } }, { role: 'user' }] }
{ $or:  [{ role: 'admin' }, { role: 'moderator' }] }

// Text search (requires text index)
{ $text: { $search: 'node.js tutorial' } }

// Regex
{ name: /^alice/i }  // starts with alice (case-insensitive)
```

---

## Indexes

```js
// In schema definition:
const userSchema = new Schema({
  email: { type: String, unique: true },  // unique index
  name:  { type: String, index: true },   // regular index
});

// Programmatically:
userSchema.index({ createdAt: -1 });         // single field
userSchema.index({ name: 1, email: 1 });     // compound index
userSchema.index({ bio: 'text' });            // text search index
```

---

## Minimal Express + MongoDB Example

```js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todos');

const Todo = mongoose.model('Todo', new mongoose.Schema({
  title:     { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true }));

app.get('/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create({ title: req.body.title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running'));
```
