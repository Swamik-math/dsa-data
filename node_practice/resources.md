# Resources & Tools

A curated list of resources to help you learn Node.js backend development.

---

## Official Documentation

- **Node.js** — https://nodejs.org/en/docs
- **Express.js** — https://expressjs.com
- **npm** — https://docs.npmjs.com
- **MongoDB** — https://www.mongodb.com/docs

---

## Free Video Tutorials

### YouTube Channels
- **Traversy Media** — Great Node.js crash courses and project walkthroughs
- **The Net Ninja** — Full Node.js and Express series for beginners
- **Fireship** — Short, high-quality concept videos
- **Academind** — In-depth Node.js and REST API tutorials

### Recommended Playlists
- Node.js Crash Course — Traversy Media
- Node.js Tutorial for Beginners — The Net Ninja
- Express.js Crash Course — Traversy Media

---

## Free Online Courses

- **freeCodeCamp** — https://www.freecodecamp.org (Back End Development and APIs certification)
- **The Odin Project** — https://www.theodinproject.com (NodeJS path)
- **Codecademy** — https://www.codecademy.com/learn/learn-node-js

---

## Books

- *Node.js Design Patterns* by Mario Casciaro (intermediate/advanced)
- *Learning Node* by Shelley Powers (beginner-friendly)
- *Express in Action* by Evan Hahn

---

## Tools to Install

### Essential
| Tool | Purpose | Install |
|------|---------|---------|
| Node.js | JavaScript runtime | https://nodejs.org |
| npm | Package manager (comes with Node.js) | — |
| VS Code | Code editor | https://code.visualstudio.com |
| Postman | API testing | https://www.postman.com |

### Recommended VS Code Extensions
- **REST Client** — Test APIs directly from VS Code
- **Thunder Client** — Lightweight Postman alternative inside VS Code
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **GitLens** — Better Git integration

### Development Tools
```bash
# Install nodemon globally (auto-restarts server on file changes)
npm install -g nodemon

# Run a file with nodemon
nodemon server.js
```

---

## API Testing

### Postman
1. Download from https://www.postman.com/downloads
2. Create a new Collection for each project
3. Add requests for each endpoint (GET, POST, PUT, DELETE)
4. Save example responses

### curl (command line)
```bash
# GET request
curl http://localhost:3000/api/todos

# POST request with JSON body
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js"}'

# PUT request
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# DELETE request
curl -X DELETE http://localhost:3000/api/todos/1
```

---

## Debugging Tips

### Using console.log
```js
// Log variables to understand what's happening
console.log('Request received:', req.method, req.url);
console.log('Request body:', req.body);
console.log('Query params:', req.query);
```

### Node.js Built-in Debugger
```bash
# Run with debugger
node --inspect server.js

# Then open Chrome and go to: chrome://inspect
```

### Common Error Messages
| Error | Likely Cause |
|-------|-------------|
| `Cannot find module` | Wrong file path or missing npm install |
| `EADDRINUSE` | Port already in use — change port number |
| `ENOENT` | File not found |
| `SyntaxError` | Typo or missing bracket in your code |
| `TypeError: Cannot read property of undefined` | Variable is undefined — check your data |

---

## Helpful npm Packages

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `nodemon` | Auto-restart on changes (dev) |
| `dotenv` | Load environment variables |
| `cors` | Enable CORS |
| `helmet` | Security headers |
| `morgan` | HTTP request logging |
| `joi` | Request validation |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `mongoose` | MongoDB ODM |
| `better-sqlite3` | SQLite database |
| `axios` | HTTP client |

---

## Next Steps After This Repository

1. **Authentication** — Learn JWT and bcrypt for secure APIs
2. **Testing** — Write unit and integration tests with Jest
3. **Deployment** — Deploy to Render, Railway, or Heroku
4. **Docker** — Containerize your applications
5. **TypeScript** — Add type safety to Node.js
