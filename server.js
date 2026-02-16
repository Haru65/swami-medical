import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory for medicine images
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// Serve static files from dist (built Vite client)
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Ensure data directory exists
const dataDir = path.join(__dirname, 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file paths
const usersFile = path.join(dataDir, 'users.json');
const medicinesFile = path.join(dataDir, 'medicines.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Database initialization
const initializeDatabase = () => {
  // Users file
  if (!fs.existsSync(usersFile)) {
    const defaultUsers = [
      {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@swami.com',
        password: 'admin123',
        isAdmin: true,
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
  }

  // Medicines file
  if (!fs.existsSync(medicinesFile)) {
    const initialMedicines = [
      { id: 'c1', name: 'Amoxicillin Cap', category: 'Tablets & Capsules', price: 120, stock: 50, requiresPrescription: true, description: 'Antibiotic', usage: '1 cap TDS', sideEffects: 'Nausea' },
      { id: 'c2', name: 'Benadryl Syrup', category: 'Syrups', price: 150, stock: 30, requiresPrescription: false, description: 'Cough syrup', usage: '10ml SOS', sideEffects: 'Drowsiness' },
      { id: 'c3', name: 'Insulin Glargine', category: 'Injections', price: 850, stock: 10, requiresPrescription: true, description: 'Long acting insulin', usage: 'Once daily SC', sideEffects: 'Hypoglycemia' },
      { id: 'c4', name: 'Betadine Ointment', category: 'Oints & Creams', price: 95, stock: 100, requiresPrescription: false, description: 'Antiseptic', usage: 'Apply twice', sideEffects: 'Irritation' },
      { id: 'd1', name: 'Dolo 650', condition: 'Fever & Pain Relief', category: 'Tablets & Capsules', price: 30, stock: 200, requiresPrescription: false, description: 'Paracetamol', usage: '1 tab SOS', sideEffects: 'None' },
      { id: 'd2', name: 'Ascoril D', condition: 'Cold & Cough', category: 'Syrups', price: 110, stock: 45, requiresPrescription: false, description: 'Cough suppressant', usage: '5ml TDS', sideEffects: 'Dizziness' },
      { id: 'd3', name: 'Glycomet GP2', condition: 'Diabetes Care', category: 'Tablets & Capsules', price: 210, stock: 60, requiresPrescription: true, description: 'Diabetes control', usage: '1 tab OD', sideEffects: 'Bloating' },
      { id: 'd4', name: 'Telma 40', condition: 'Blood Pressure', category: 'Tablets & Capsules', price: 180, stock: 80, requiresPrescription: true, description: 'BP medicine', usage: '1 tab morning', sideEffects: 'Fatigue' },
      { id: 'd5', name: 'Ecosprin 75', condition: 'Heart Health', category: 'Tablets & Capsules', price: 50, stock: 150, requiresPrescription: true, description: 'Blood thinner', usage: '1 tab OD', sideEffects: 'Bleeding' },
      { id: 'w1', name: 'Zincovit', isWellness: true, category: 'Vitamins & Supplements', price: 140, stock: 300, requiresPrescription: false, description: 'Multivitamin', usage: '1 tab OD', sideEffects: 'None' },
      { id: 'w2', name: 'Chyawanprash', isWellness: true, category: 'Immunity Boosters', price: 350, stock: 25, requiresPrescription: false, description: 'Ayurvedic tonic', usage: '1 spoon daily', sideEffects: 'None' },
      { id: 'w3', name: 'Whey Protein', isWellness: true, category: 'Protein & Nutrition', price: 2400, stock: 12, requiresPrescription: false, description: 'Muscle support', usage: '1 scoop daily', sideEffects: 'Digestive issues' },
      { id: 'w4', name: 'Ashwagandha', isWellness: true, category: 'Herbal Products', price: 220, stock: 40, requiresPrescription: false, description: 'Stress relief', usage: '1 cap BD', sideEffects: 'None' }
    ];
    fs.writeFileSync(medicinesFile, JSON.stringify(initialMedicines, null, 2));
  }

  // Orders file
  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  }
};

// Database read/write helpers
const readDatabase = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeDatabase = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// Authentication Routes
app.post('/api/auth/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const users = readDatabase(usersFile);
  const userExists = users.find(u => u.username === username || u.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeDatabase(usersFile, users);

  res.status(201).json({
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const users = readDatabase(usersFile);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false
    }
  });
});

// Medicine Routes
app.get('/api/medicines', (req, res) => {
  const medicines = readDatabase(medicinesFile);
  res.json(medicines);
});

app.post('/api/medicines', (req, res) => {
  const { name, category, price, stock, requiresPrescription, description, usage, sideEffects } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const medicines = readDatabase(medicinesFile);
  const newMedicine = {
    id: `med-${Date.now()}`,
    name,
    category,
    price,
    stock,
    requiresPrescription: requiresPrescription || false,
    description: description || '',
    usage: usage || '',
    sideEffects: sideEffects || ''
  };

  medicines.push(newMedicine);
  writeDatabase(medicinesFile, medicines);

  res.status(201).json(newMedicine);
});

app.put('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const medicines = readDatabase(medicinesFile);
  const index = medicines.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Medicine not found' });
  }

  medicines[index] = { ...medicines[index], ...updateData, id };
  writeDatabase(medicinesFile, medicines);

  res.json(medicines[index]);
});

app.delete('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  const medicines = readDatabase(medicinesFile);
  const index = medicines.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Medicine not found' });
  }

  const deleted = medicines.splice(index, 1);
  writeDatabase(medicinesFile, medicines);

  res.json({ message: 'Medicine deleted', deleted: deleted[0] });
});

// Order Routes
app.post('/api/orders', (req, res) => {
  const { items, total, customerName, paymentMethod, userId } = req.body;

  if (!items || !total || !customerName || !paymentMethod || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder = {
    id: `order-${Date.now()}`,
    userId,
    items,
    total,
    customerName,
    paymentMethod,
    status: 'Pending Payment',
    date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    prescriptionImage: null
  };

  const orders = readDatabase(ordersFile);
  orders.push(newOrder);
  writeDatabase(ordersFile, orders);

  // Update medicine stock
  const medicines = readDatabase(medicinesFile);
  items.forEach(item => {
    const medIndex = medicines.findIndex(m => m.id === item.medicine.id);
    if (medIndex !== -1) {
      medicines[medIndex].stock -= item.quantity;
    }
  });
  writeDatabase(medicinesFile, medicines);

  res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  const orders = readDatabase(ordersFile);

  if (userId) {
    const userOrders = orders.filter(o => o.userId === userId);
    return res.json(userOrders);
  }

  res.json(orders);
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const orders = readDatabase(ordersFile);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index].status = status;
  writeDatabase(ordersFile, orders);

  res.json(orders[index]);
});

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = readDatabase(ordersFile);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Prescription upload endpoint
app.post('/api/orders/:id/prescription', (req, res) => {
  const { id } = req.params;
  const { prescriptionImage } = req.body;

  const orders = readDatabase(ordersFile);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.prescriptionImage = prescriptionImage;
  writeDatabase(ordersFile, orders);

  res.json(order);
});

// Image Proxy Endpoint - serves images reliably
app.get('/api/image/:id', (req, res) => {
  const { id } = req.params;
  const medicines = readDatabase(medicinesFile);
  const medicine = medicines.find(m => m.id === id);

  if (!medicine || !medicine.imageUrl) {
    // Fallback placeholder for missing images
    const text = encodeURIComponent(id.substring(0, 10));
    const placeholder = `https://via.placeholder.com/400x400/e0e7ff/6366f1?text=${text}`;
    return res.redirect(placeholder);
  }

  // Redirect to the actual image URL
  res.redirect(medicine.imageUrl);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve client-side routes - must be last
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // In development, index.html is at root
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
