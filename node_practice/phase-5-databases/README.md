# Phase 5: Databases

Connect your APIs to real databases. In this phase you'll learn the difference between SQL and NoSQL databases and how to integrate them with your Node.js API.

## Files in This Phase

| File | Topic |
|------|-------|
| `01-sql-basics.md` | SQL fundamentals and when to use SQL |
| `02-mongodb-basics.md` | MongoDB fundamentals and when to use NoSQL |
| `03-sqlite-example.js` | Complete SQLite integration example |

## Setup

For the SQLite example:
```bash
npm install better-sqlite3
```

For MongoDB (when you're ready):
```bash
npm install mongoose
```

## SQL vs NoSQL

### SQL (Relational Databases)
- PostgreSQL, MySQL, SQLite, SQL Server
- Data stored in **tables** with rows and columns
- **Schema** — structure defined upfront
- **Relationships** — tables connect via foreign keys
- **ACID** transactions — guaranteed data integrity
- Best for: structured data with clear relationships (users, orders, products)

### NoSQL (Document Databases)
- MongoDB, CouchDB, Firebase
- Data stored as **documents** (JSON-like objects)
- **Flexible schema** — structure can vary per document
- Best for: flexible, hierarchical, or rapidly changing data

### When to Choose What
| Use SQL when... | Use NoSQL when... |
|-----------------|-------------------|
| Data is structured | Data structure changes often |
| You need complex queries | You need high write throughput |
| Data integrity is critical | Data is hierarchical/nested |
| Relationships are important | You're prototyping quickly |

## Database Concepts

### CRUD Operations
Every database needs these four operations:
- **C**reate — INSERT / create document
- **R**ead — SELECT / find documents
- **U**pdate — UPDATE / update documents
- **D**elete — DELETE / remove documents

### Indexes
Speed up queries by creating indexes on columns you frequently search:
```sql
CREATE INDEX idx_email ON users(email);
```

### Transactions
Group multiple operations that either ALL succeed or ALL fail:
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- or ROLLBACK if something fails
```

## SQLite for Local Development

SQLite is perfect for learning and small projects:
- No server to install — just a file
- Great for development and testing
- Works exactly like PostgreSQL/MySQL in terms of SQL syntax
- Not suitable for high-traffic production (use PostgreSQL instead)

---

After completing this phase, you're ready to build the **[Projects](../projects/)**!
