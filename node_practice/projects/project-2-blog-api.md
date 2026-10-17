# Project 2: Blog API

Build a blog API with posts, categories, and comments. This project introduces relationships between resources and more complex data models.

## Learning Goals

- Design a multi-resource API
- Implement nested routes (`/posts/:id/comments`)
- Work with relationships between resources
- Practice filtering and search
- (Optional) Add database persistence with SQLite

## Requirements

### API Endpoints

**Posts:**
```
GET    /api/v1/posts                  — list posts (filter, sort, paginate)
GET    /api/v1/posts/:id              — get one post with comments
POST   /api/v1/posts                  — create post
PATCH  /api/v1/posts/:id              — update post
DELETE /api/v1/posts/:id              — delete post
```

**Comments:**
```
GET    /api/v1/posts/:id/comments     — list comments for a post
POST   /api/v1/posts/:id/comments     — add a comment
DELETE /api/v1/posts/:postId/comments/:commentId — delete a comment
```

**Categories:**
```
GET    /api/v1/categories             — list all categories
GET    /api/v1/categories/:slug/posts — posts in a category
```

**Search:**
```
GET    /api/v1/search?q=nodejs        — search posts by title or body
```

### Data Schemas

**Post:**
```json
{
  "id": 1,
  "title": "Getting Started with Node.js",
  "slug": "getting-started-with-nodejs",
  "body": "Node.js is a JavaScript runtime...",
  "author": "Alice",
  "category": "backend",
  "tags": ["nodejs", "javascript", "backend"],
  "published": true,
  "views": 150,
  "commentCount": 3,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": null
}
```

**Comment:**
```json
{
  "id": 1,
  "postId": 1,
  "author": "Bob",
  "body": "Great tutorial!",
  "createdAt": "2024-01-02T00:00:00.000Z"
}
```

### Features Required

- [ ] Full CRUD for posts
- [ ] Comments (create, list, delete)
- [ ] Categories (list, filter posts by category)
- [ ] Search by title/body
- [ ] Filter: `?published=true`, `?category=backend`, `?author=Alice`
- [ ] Sort: `?sort=views&order=desc`, `?sort=createdAt`
- [ ] Pagination with metadata
- [ ] Auto-generate `slug` from title (e.g., "My Post" → "my-post")
- [ ] Include `commentCount` in post list responses
- [ ] Input validation

## Folder Structure

```
blog-api/
├── package.json
├── server.js
├── app.js
├── data/
│   ├── posts.js        (in-memory store or JSON file)
│   └── comments.js
├── routes/
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   └── categoryRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── validate.js
└── utils/
    └── slugify.js      (title → slug converter)
```

## Implementation Tips

### Generating Slugs

```js
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')           // spaces to dashes
    .replace(/-+/g, '-')            // multiple dashes to one
    .trim();
}

slugify("Hello World!"); // "hello-world"
slugify("Node.js Tips & Tricks"); // "nodejs-tips-tricks"
```

### Get Post by Slug or ID

```js
app.get('/posts/:identifier', (req, res) => {
  const { identifier } = req.params;
  const isNumeric = /^\d+$/.test(identifier);

  const post = isNumeric
    ? posts.find(p => p.id === parseInt(identifier))
    : posts.find(p => p.slug === identifier);

  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});
```

### Include Comments in Post Response

```js
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Not found' });

  const postComments = comments.filter(c => c.postId === post.id);
  res.json({ ...post, comments: postComments });
});
```

## Testing

```bash
# Create a post
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","body":"Hello world!","author":"Alice","category":"general"}'

# List posts by category
curl "http://localhost:3000/api/v1/posts?category=general"

# Add a comment
curl -X POST http://localhost:3000/api/v1/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"author":"Bob","body":"Great post!"}'

# Search
curl "http://localhost:3000/api/v1/search?q=node"
```

## Bonus Challenges

- [ ] Add SQLite persistence with a `posts` and `comments` table
- [ ] Add a `GET /api/v1/posts/:id/related` endpoint that returns posts with the same category
- [ ] Track view counts: increment `views` on every `GET /posts/:id`
- [ ] Add `PATCH /posts/:id/publish` and `PATCH /posts/:id/unpublish`
- [ ] Add featured image URL to posts
- [ ] Sort comments by newest first
