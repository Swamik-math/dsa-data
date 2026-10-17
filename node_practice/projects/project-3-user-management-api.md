# Project 3: User Management API

Build a User Management API with authentication basics. This is the most advanced project — it introduces authentication concepts like password hashing and JWT tokens.

## Learning Goals

- Implement user registration and login
- Hash passwords (never store plaintext!)
- Generate and verify JWT tokens
- Protect routes with authentication middleware
- Role-based access control (admin vs user)
- (Optional) SQLite persistence

## Setup

```bash
npm install express bcrypt jsonwebtoken
npm install nodemon --save-dev
```

## Requirements

### API Endpoints

**Auth (public):**
```
POST /api/v1/auth/register   — create account
POST /api/v1/auth/login      — login, get JWT token
```

**Users (protected):**
```
GET    /api/v1/users         — list users (admin only)
GET    /api/v1/users/me      — get own profile
GET    /api/v1/users/:id     — get user by id (admin only)
PATCH  /api/v1/users/me      — update own profile
PATCH  /api/v1/users/:id     — update user (admin only)
DELETE /api/v1/users/:id     — delete user (admin only)
```

### User Schema

```json
{
  "id": 1,
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** Never return `password` in API responses!

### Request/Response Examples

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```
Response (201):
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

**Access protected route:**
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

## Implementation Guide

### 1. Password Hashing

```js
const bcrypt = require('bcrypt');

// Hash password before saving (NEVER store plain text)
async function hashPassword(plaintext) {
  const saltRounds = 10;
  return await bcrypt.hash(plaintext, saltRounds);
}

// Compare submitted password with stored hash
async function verifyPassword(plaintext, hashedPassword) {
  return await bcrypt.compare(plaintext, hashedPassword);
}
```

### 2. JWT Generation and Verification

```js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
```

### 3. Auth Middleware

```js
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded; // { id, email, role }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
```

### 4. Registration Route

```js
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Check duplicate
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save user (don't save to response!)
  const user = {
    id: users.length + 1,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,  // stored hashed
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  users.push(user);

  // Generate token
  const token = generateToken(user);

  // Return user WITHOUT password
  const { password: _, ...safeUser } = user;

  res.status(201).json({ success: true, data: { user: safeUser, token } });
});
```

### 5. Login Route

```js
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email.toLowerCase());

  if (!user) {
    // Don't reveal whether email exists (security)
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  res.json({ success: true, data: { user: safeUser, token } });
});
```

## Folder Structure

```
user-management-api/
├── package.json
├── .env                (JWT_SECRET, PORT)
├── server.js
├── app.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── authenticate.js
│   ├── requireAdmin.js
│   └── errorHandler.js
└── utils/
    ├── password.js     (hash, verify)
    └── token.js        (generate, verify)
```

## Security Best Practices

- **Never log or return passwords** — even hashed ones
- **Use environment variables** for JWT_SECRET (`.env` file)
- **Use HTTPS** in production
- **Set token expiry** — don't make tokens last forever
- **Validate input** — email format, password length
- **Generic auth errors** — "Invalid email or password" (not which one is wrong)
- **Add `.env` to `.gitignore`** — never commit secrets

## Testing

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Get profile (use token from login response)
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <your-token-here>"

# Try accessing admin route (should get 403)
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <your-token-here>"
```

## Bonus Challenges

- [ ] Add `.env` file support with `dotenv` package
- [ ] Add SQLite persistence — users survive server restarts
- [ ] Add `PATCH /users/me/password` — change own password
- [ ] Add token refresh endpoint
- [ ] Add email validation (check format with regex)
- [ ] Add rate limiting on login endpoint (prevent brute force)
- [ ] Add admin user seeding in a `seed.js` script
