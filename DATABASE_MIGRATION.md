# 🔄 Database Migration Guide

Guide to migrate from JSON file-based database to MongoDB, PostgreSQL, or other databases.

---

## Overview

Currently, the application uses JSON files for data storage:
- `server/data/users.json`
- `server/data/medicines.json`
- `server/data/orders.json`

This is perfect for development and small projects, but for production with multiple users, a real database is recommended.

---

## When to Migrate

### Keep JSON if:
- ✅ Project is in development
- ✅ Few users (< 1000)
- ✅ Low data volume
- ✅ Team learning project
- ✅ Want to avoid database costs

### Migrate to MongoDB/PostgreSQL if:
- 📈 Going to production
- 👥 More than 1000 users
- 💾 Large data volume
- ⚡ Need better performance
- 🔒 Need advanced security

---

## Option 1: MongoDB (Recommended for Beginners)

### Why MongoDB?
- ✅ Easy to learn
- ✅ Schema-less (flexible)
- ✅ Great free tier (MongoDB Atlas)
- ✅ JSON-like data (easy transition)
- ✅ Good documentation
- ✅ Scalable

### Step 1: Setup MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create organization
5. Create project
6. Build cluster
7. Choose "Free" tier
8. Select region
9. Click "Create Cluster"

### Step 2: Get Connection String

1. In MongoDB Atlas, go to "Databases"
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy connection string
5. Replace `<username>` and `<password>` with your credentials

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 3: Install MongoDB Driver

```bash
npm install mongoose
```

### Step 4: Update server.js

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  createdAt: Date
});

const medicineSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  price: Number,
  stock: Number,
  requiresPrescription: Boolean,
  description: String,
  usage: String,
  sideEffects: String
});

const orderSchema = new mongoose.Schema({
  id: String,
  userId: String,
  items: Array,
  total: Number,
  customerName: String,
  paymentMethod: String,
  status: String,
  createdAt: Date,
  prescriptionImage: String
});

const User = mongoose.model('User', userSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);
const Order = mongoose.model('Order', orderSchema);

// Update existing endpoints to use models instead of files
```

### Step 5: .env Configuration

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Example Updated Route

Before (JSON):
```javascript
app.get('/api/medicines', (req, res) => {
  const medicines = readDatabase(medicinesFile);
  res.json(medicines);
});
```

After (MongoDB):
```javascript
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Option 2: PostgreSQL

### Why PostgreSQL?
- ✅ Powerful relational database
- ✅ ACID compliance
- ✅ Great for complex queries
- ✅ Production grade
- ✅ Free tier available (Railway, Supabase)
- ✅ SQL is universal

### Step 1: Setup Database

Using Railway.app (recommended):
1. Go to https://railway.app
2. Sign up
3. Create project
4. Add PostgreSQL plugin
5. Get credentials

### Step 2: Install PostgreSQL Driver

```bash
npm install pg
```

### Step 3: Setup Tables

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50) UNIQUE,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50) UNIQUE,
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  stock INTEGER,
  requires_prescription BOOLEAN,
  description TEXT,
  usage TEXT,
  side_effects TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50) UNIQUE,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10, 2),
  customer_name VARCHAR(255),
  payment_method VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  medicine_id INTEGER REFERENCES medicines(id),
  quantity INTEGER
);
```

### Step 4: Update server.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Example: Get medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medicines');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 5: .env Configuration

```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

---

## Option 3: Supabase (PostgreSQL + Auth)

### Why Supabase?
- ✅ PostgreSQL backend
- ✅ Built-in authentication
- ✅ Real-time updates
- ✅ Easy setup
- ✅ Free tier
- ✅ Great for built-in features

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up
3. Create new project
4. Choose region
5. Set password
6. Wait for setup

### Step 2: Create Tables

Use Supabase UI to create tables (easier than SQL):
1. Click "New Table"
2. Define columns
3. Repeat for all tables

### Step 3: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 4: Update server.js

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get('/api/medicines', async (req, res) => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*');
  
  if (error) return res.status(500).json({ error });
  res.json(data);
});
```

---

## Option 4: Firebase (Quickest Setup)

### Why Firebase?
- ✅ Fastest setup
- ✅ No backend needed (serverless)
- ✅ Real-time database
- ✅ Built-in auth
- ✅ Can replace backend entirely

### Note:
Converting to Firebase is more complex and requires architectural changes. Consider only if you want to go fully serverless.

---

## Migration Checklist

When migrating from JSON to any database:

- [ ] Set up new database account
- [ ] Get connection credentials
- [ ] Install database driver
- [ ] Create database schema
- [ ] Update server.js routes
- [ ] Update environment variables
- [ ] Migrate existing data (if needed)
- [ ] Test all endpoints
- [ ] Update error handling
- [ ] Add database connection pooling
- [ ] Set up backups
- [ ] Configure security/encryption

---

## Data Migration Script

If you have existing JSON data to migrate:

```javascript
// migrate-data.js
const fs = require('fs');
const mongoose = require('mongoose');

async function migrate() {
  // Read JSON files
  const users = JSON.parse(fs.readFileSync('server/data/users.json'));
  const medicines = JSON.parse(fs.readFileSync('server/data/medicines.json'));
  const orders = JSON.parse(fs.readFileSync('server/data/orders.json'));

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);

  // Insert data
  await User.insertMany(users);
  await Medicine.insertMany(medicines);
  await Order.insertMany(orders);

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(console.error);
```

Run with:
```bash
node migrate-data.js
```

---

## Performance Comparison

| Feature | JSON | MongoDB | PostgreSQL |
|---------|------|---------|-----------|
| Setup Time | Instant | 15 min | 15 min |
| Query Speed | Slow | Medium | Fast |
| Scalability | Limited | Good | Excellent |
| Real-time | No | Yes (subscriptions) | No |
| Cost | Free | Free tier | Free tier |
| Best For | Dev | Medium projects | Large projects |

---

## Troubleshooting

### Connection String Errors
```
Error: connect ECONNREFUSED

Solution: 
- Check MongoDB/PostgreSQL is running
- Verify connection string
- Check firewall settings
- Ensure credentials are correct
```

### Schema Validation Errors
```
Error: validation failed

Solution:
- Check data types match schema
- Verify required fields
- Ensure no extra fields (if strict)
```

### Performance Issues
```
Queries are slow

Solution:
- Add database indexes
- Optimize queries
- Implement caching
- Use connection pooling
```

---

## Best Practices

### 1. Always Use Environment Variables

```javascript
// Good ✅
const dbUri = process.env.DATABASE_URL;

// Bad ❌
const dbUri = 'mongodb+srv://user:pass@cluster...';
```

### 2. Connection Pooling

```javascript
// Use pooled connections
const pool = new Pool({ max: 20 });
```

### 3. Error Handling

```javascript
// Good ✅
try {
  const data = await database.query();
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

### 4. Input Validation

```javascript
// Good ✅
if (!username || !email) {
  return res.status(400).json({ error: 'Missing fields' });
}
```

### 5. Backups

Always set up automated backups in production!

---

## Cost Comparison (Monthly)

| Database | Free Tier | Pro Tier |
|----------|-----------|----------|
| JSON (Render) | $0 (sleep) | $7 |
| MongoDB Atlas | Free (512MB) | $57 |
| PostgreSQL (Railway) | $5 | $20+ |
| Supabase | Free (500MB) | $25 |
| Firebase | Free (1GB) | $10+ |

---

## Next Steps After Migration

1. Set up database backups
2. Add monitoring/alerting
3. Implement caching (Redis)
4. Add query optimization
5. Set up CI/CD pipeline
6. Monitor performance

---

## Resources

- **MongoDB**: https://mongodb.com/docs
- **PostgreSQL**: https://postgresql.org/docs
- **Mongoose**: https://mongoosejs.com
- **Supabase**: https://supabase.com/docs
- **Railway**: https://railway.app/docs

---

## Timeline Recommendation

**Week 1:** Dev with JSON  
**Week 2:** Learn chosen database  
**Week 3:** Migrate to database  
**Week 4:** Test and optimize  

---

**Remember:** Start simple with JSON, migrate when needed! 🚀
