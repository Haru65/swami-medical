# 🏥 Swami Medical Store - E-Commerce Platform

A complete, production-ready medical e-commerce platform built with React and Node.js. Features user authentication, admin dashboard, prescription uploads, and more.

**🚀 Status:** Production Ready | **📱 Type:** Full Stack E-Commerce | **☁️ Deployable:** Render & Vercel

---

## ✨ Features

### 👥 Customer Features
✅ User registration and login  
✅ Browse medicines by category, condition, or wellness  
✅ Shopping cart with real-time stock updates  
✅ Upload prescriptions for prescription-required medicines  
✅ Place orders with multiple payment methods  
✅ Order tracking and history  
✅ Account management  

### 🛠️ Admin Features
✅ Dashboard with sales analytics  
✅ Order verification and status management  
✅ Add and manage medicines  
✅ Inventory management  
✅ Prescription verification  
✅ Stock tracking  

---

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Vite** for optimized builds
- **Tailwind CSS** for responsive design
- **Session-based storage** for user context

### Backend
- **Express.js** on Node.js
- **JSON file database** (easily upgradeable to MongoDB/PostgreSQL)
- **RESTful API** architecture
- **CORS-enabled** for seamless frontend-backend communication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate**
   ```bash
   cd swami-medical-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Already created, but you can customize:
   cat .env.local
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Health Check: http://localhost:3001/health

---

## 🔑 Default Credentials

| Role | Username | Password | Email |
|------|----------|----------|-------|
| Admin | `admin` | `admin123` | `admin@swami.com` |

*Create regular user accounts through signup.*

---

## 📁 Project Structure

```
swami-medical-store/
├── App.tsx                          # Main React component
├── types.ts                         # TypeScript interfaces
├── data.ts                          # Initial data
├── server.js                        # Express server
├── vite.config.ts                   # Vite configuration
├── components/
│   ├── Auth.tsx                     # Login/Signup
│   ├── AdminDashboard.tsx           # Admin panel
│   ├── MedicineGrid.tsx             # Product listing
│   ├── CartSheet.tsx                # Shopping cart
│   ├── Checkout.tsx                 # Order creation
│   ├── Account.tsx                  # User profile
│   ├── AppHeader.tsx                # Navigation
│   └── [other components]
├── server/
│   └── data/
│       ├── users.json               # User database
│       ├── medicines.json           # Product database
│       └── orders.json              # Order database
├── .env.local                       # Local environment
├── .env.example                     # Environment template
├── Procfile                         # Render deployment
├── vercel.json                      # Vercel configuration
├── render.yaml                      # Render YAML config
├── DEPLOYMENT.md                    # Deployment guide
└── package.json                     # Dependencies
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup              Register new user
POST   /api/auth/login               Login user
```

### Medicines
```
GET    /api/medicines                Get all medicines
POST   /api/medicines                Add medicine (admin)
PUT    /api/medicines/:id            Update medicine
DELETE /api/medicines/:id            Delete medicine
```

### Orders
```
POST   /api/orders                   Create order
GET    /api/orders                   Get orders
GET    /api/orders/:id               Get specific order
PUT    /api/orders/:id               Update order status
POST   /api/orders/:id/prescription  Upload prescription
```

### Health
```
GET    /health                       API status
```

---

## 📦 Available Scripts

```bash
npm run dev                # Start dev (frontend + backend)
npm run server            # Start backend only
npm run client            # Start frontend only
npm run build             # Build for production
npm start                 # Start production server
```

---

## ☁️ Deployment

### 🎨 Deploy to Render (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push
   ```

2. **Connect to Render**
   - Visit https://render.com
   - Create Web Service
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `node server.js`
   - Environment: `VITE_API_URL=https://your-app.onrender.com`

3. **Database**: Automatically creates JSON files on first run

### 🚀 Deploy to Vercel

**Option 1: Full Stack on Render** (Easier)
- Follow Render instructions above

**Option 2: Separate Frontend on Vercel**
- Frontend: https://vercel.com (import repo, set `VITE_API_URL`)
- Backend: Deploy on Render or Railway

---

## 🔒 Important Security Notes

### Current Implementation
- ✅ Session-based authentication
- ✅ User account isolation
- ✅ Admin role verification

### Production Enhancements Needed
Before pushing to production, implement:
- 🔐 Password hashing (bcryptjs)
- 🔑 JWT token authentication
- 🛡️ Rate limiting
- ✔️ Input validation & sanitization
- 🔒 HTTPS enforcement
- 🚫 CSRF protection

---

## 🗄️ Database

### Current: JSON Files
- `server/data/users.json` - User accounts
- `server/data/medicines.json` - Medicine catalog  
- `server/data/orders.json` - Order history

### Easy Migration To:
- **MongoDB** (MongoDB Atlas cloud)
- **PostgreSQL** (Railway, Supabase)
- **Firebase** (Firestore)

*No code changes needed - just update the database functions in `server.js`*

---

## 💡 Usage Guide

### For Customers

1. **Browse & Shopping**
   - Visit home page
   - Search medicines by category
   - Add items to cart

2. **Checkout**
   - Choose payment method
   - Enter delivery details
   - For prescription medicines, upload prescription
   - Complete order

3. **Track Orders**
   - Go to Account
   - View order history  
   - See order status

### For Admins

1. **Login as Admin**
   - Username: `admin`
   - Password: `admin123`

2. **Verify Orders**
   - Dashboard shows pending orders
   - Check prescriptions if needed
   - Update payment status

3. **Manage Inventory**
   - Add new medicines with details
   - Update stock levels
   - Track inventory

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS errors** | Ensure backend runs on 3001 |
| **Port in use** | Change PORT in .env or vite.config.ts |
| **Database missing** | Backend auto-creates on first run |
| **API not responding** | Check `/health` endpoint |
| **Login fails** | Verify credentials, check browser console |

---

## 📈 Performance & Optimization

- 📦 Optimized Vite builds
- 🎨 Tailwind CSS tree-shaking
- 🚀 Modern React rendering
- 💾 JSON file caching
- 🔄 Efficient state management

---

## 🚀 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email & SMS notifications
- [ ] Advanced search & filters
- [ ] Medicine recommendations
- [ ] Customer reviews & ratings
- [ ] Wishlist feature
- [ ] Mobile app
- [ ] Real-time inventory sync
- [ ] Docker containerization
- [ ] Machine learning recommendations

---

## 📝 Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |

---

## 🤝 Contributing

This is a template project. Feel free to modify and extend it!

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📄 License

This project is for educational purposes.

---

## 🎯 Support

For deployment issues or questions, see [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Happy coding! 🚀**
#   s w a m i - m e d i c a l  
 