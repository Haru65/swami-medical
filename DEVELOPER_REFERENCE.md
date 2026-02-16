# 🗺️ Developer Reference Guide

Quick navigation and reference for developers working on Swami Medical Store.

---

## 📁 Project Directory Map

```
swami-medical-store/
│
├── 📄 [Root Configuration Files]
│   ├── package.json              ← Dependencies & scripts
│   ├── .env.local               ← Local environment variables
│   ├── .env.example             ← Environment template
│   ├── vite.config.ts           ← Vite build configuration
│   ├── tsconfig.json            ← TypeScript configuration
│   ├── Procfile                 ← Render deployment config
│   ├── vercel.json              ← Vercel deployment config
│   └── render.yaml              ← Render YAML config
│
├── 📚 [Documentation]
│   ├── README.md                ← Platform overview
│   ├── QUICKSTART.md            ← 5-minute setup
│   ├── DEPLOYMENT.md            ← Deployment guide
│   ├── API_DOCS.md              ← API reference
│   ├── TRANSFORMATION_SUMMARY.md ← Changes made
│   └── SETUP.sh                 ← Setup script
│
├── 🎨 [Frontend Source Code]
│   ├── App.tsx                  ← Main React component
│   ├── index.tsx                ← Entry point
│   ├── types.ts                 ← TypeScript interfaces
│   ├── data.ts                  ← Initial data
│   ├── index.html               ← HTML template
│   ├── metadata.json            ← App metadata
│   └── components/              ← React components
│       ├── Auth.tsx             ← Login/Signup
│       ├── AdminDashboard.tsx   ← Admin panel
│       ├── MedicineGrid.tsx     ← Product listing
│       ├── CartSheet.tsx        ← Shopping cart
│       ├── Checkout.tsx         ← Order form
│       ├── Account.tsx          ← User profile
│       ├── OrderSuccess.tsx     ← Success page
│       ├── BottomNav.tsx        ← Navigation
│       ├── AppHeader.tsx        ← Header
│       ├── Navbar.tsx           ← Nav menu
│       ├── CartDrawer.tsx       ← Cart drawer
│       ├── PrescriptionModal.tsx ← Prescription upload
│       └── ...other components
│
├── 🔌 [Backend Server]
│   ├── server.js                ← Express server
│   │   ├── Database handlers
│   │   ├── API routes
│   │   └── Middleware
│   │
│   └── server/
│       └── data/
│           ├── users.json       ← User accounts database
│           ├── medicines.json   ← Medicine catalog database
│           └── orders.json      ← Orders database
│
├── 📦 [Build Output] (created after build)
│   └── dist/
│       ├── index.html
│       ├── assets/
│       └── ...compiled files
│
└── 🔧 [Dependencies] (created after npm install)
    └── node_modules/
```

---

## 🎯 Key Files by Purpose

### Frontend Architecture
| File | Purpose | Language |
|------|---------|----------|
| `App.tsx` | Main component, state management | TypeScript/React |
| `types.ts` | Type definitions | TypeScript |
| `data.ts` | Initial medicines data | TypeScript |
| `components/**` | Reusable UI components | TypeScript/React |

### Backend Architecture
| File | Purpose | Language |
|------|---------|----------|
| `server.js` | Express server, all APIs | JavaScript |
| `server/data/*.json` | Database files | JSON |

### Configuration
| File | Purpose | Format |
|------|---------|--------|
| `package.json` | Dependencies & scripts | JSON |
| `vite.config.ts` | Build configuration | TypeScript |
| `.env.local` | Environment variables | Text |
| `Procfile` | Render deployment | Text |
| `vercel.json` | Vercel deployment | JSON |

### Documentation
| File | Purpose | Read Time |
|------|---------|-----------|
| `README.md` | Full overview | 10 min |
| `QUICKSTART.md` | Quick setup | 5 min |
| `DEPLOYMENT.md` | Deployment guide | 15 min |
| `API_DOCS.md` | API reference | 20 min |

---

## 🔄 Component Relationships

```
App.tsx (Main)
  ├── Auth.tsx (Login/Signup)
  ├── MedicineGrid.tsx (Home)
  ├── AdminDashboard.tsx (Admin view)
  ├── Account.tsx (User profile)
  ├── CartSheet.tsx (Shopping cart)
  ├── Checkout.tsx (Order creation)
  ├── OrderSuccess.tsx (Success page)
  ├── AppHeader.tsx (Navigation)
  ├── BottomNav.tsx (Menu)
  ├── PrescriptionModal.tsx (Prescription upload)
  └── ... other components

All components communicate via:
- Props passed from App.tsx
- API calls to server.js
```

---

## 🔌 API Endpoints Overview

### Auth
```
POST /api/auth/signup      → Create account
POST /api/auth/login       → Login user
```

### Medicines
```
GET    /api/medicines      → Fetch all medicines
POST   /api/medicines      → Add medicine (admin)
PUT    /api/medicines/:id  → Update medicine
DELETE /api/medicines/:id  → Delete medicine
```

### Orders
```
POST   /api/orders                   → Create order
GET    /api/orders                   → Get all/user orders
GET    /api/orders/:id               → Get specific order
PUT    /api/orders/:id               → Update status
POST   /api/orders/:id/prescription  → Upload prescription
```

### Health
```
GET /health                → Check API status
```

---

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start frontend + backend
npm run server          # Backend only
npm run client          # Frontend only

# Production
npm run build           # Build for production
npm start              # Start server

# Utilities
npm install            # Install dependencies
npm list               # Show installed packages
```

---

## 📊 Data Flow

### User Flow
```
1. User visits http://localhost:3000
2. App.tsx loads, checks sessionStorage for user
3. GET /api/medicines fetches catalog
4. User logs in → POST /api/auth/login
5. Saved to sessionStorage
6. Can now add to cart and place orders
```

### Order Flow
```
1. User adds medicines to cart
2. User clicks checkout
3. POST /api/orders creates order
4. Stock deducted from medicines
5. Order saved to orders.json
6. User redirected to success page
```

### Admin Flow
```
1. Admin logs in (username: admin)
2. Clicks account → Admin dashboard
3. Can view orders, verify prescriptions
4. Can update order status
5. Can add new medicines
6. Can restock inventory
```

---

## 🔑 Key Technology Decisions

### Why Express.js?
- Lightweight and fast
- Easy to understand
- Perfect for small-to-medium projects
- Easy to migrate to larger frameworks

### Why JSON Database?
- No database setup needed
- Perfect for learning/prototyping
- Easy to migrate to MongoDB/PostgreSQL
- Data persists between restarts

### Why TypeScript?
- Type safety
- Better IDE support
- Fewer runtime errors
- Self-documenting code

### Why Vite?
- Lightning-fast builds
- Excellent development experience
- Modern tooling
- Great for React projects

---

## 🛠️ Development Workflow

### Starting Development
```bash
cd project-folder
npm install          # First time only
npm run dev         # Starts both servers
```

### Making Changes
1. Edit files in components/ or server.js
2. Frontend: Automatic reload on save (Vite)
3. Backend: Restart required (npm run server)

### Creating New Endpoint
1. Add route in `server.js`
2. Add fetch call in React component
3. Handle errors and loading states

### Adding New Component
1. Create file in `components/` folder
2. Export React component
3. Import in `App.tsx`
4. Add to routing/state management

---

## 📈 Performance Tips

### Frontend
- Use React DevTools to check renders
- Lazy load components if needed
- Optimize image sizes
- Use proper key props in lists

### Backend
- Keep database files under 10MB
- Add indexing if migrating to MongoDB
- Implement caching for GET requests
- Use connection pooling for database

---

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Add password hashing (bcryptjs)
- [ ] Implement JWT tokens
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Sanitize data
- [ ] Add CSRF protection
- [ ] Set secure headers

See `DEPLOYMENT.md` for details.

---

## 🐛 Debugging Tips

### Frontend Issues
```bash
# Open DevTools (F12)
# Check Console for errors
# Check Network tab for API calls
# Use React DevTools to inspect state
```

### Backend Issues
```bash
# Check server.js for console.log outputs
# Use Postman to test API endpoints
# Verify JSON files exist in server/data/
# Check .env variables are set
```

### CORS Issues
```bash
# Ensure backend on :3001
# Check VITE_API_URL is correct
# Verify CORS enabled in server.js
```

---

## 📚 File Editing Quick Reference

### To add a new medicine category
Edit: `components/AdminDashboard.tsx`
```tsx
<option value="New Category">New Category</option>
```

### To change default admin password
Edit: `server.js` (search for "admin123")
```javascript
password: "new_password"
```

### To add new API endpoint
Edit: `server.js` (add after existing routes)
```javascript
app.post('/api/newroute', (req, res) => {
  // Handler code
});
```

### To add new component
1. Create `components/NewComponent.tsx`
2. Add to `App.tsx`
3. Import and use in routing

---

## 🎯 Customization Examples

### Change app name
- `package.json` → name field
- `index.html` → title tag
- `metadata.json` → app info

### Change colors
- Edit Tailwind classes in components
- Search for `bg-teal-` and replace
- Search for `text-teal-` and replace

### Change default medicines
- Edit `data.ts` → INITIAL_MEDICINES array
- Or add through admin dashboard

---

## 📞 Quick Help

| Need Help With | Location |
|---|---|
| Getting started | QUICKSTART.md |
| API usage | API_DOCS.md |
| Deployment | DEPLOYMENT.md |
| Features overview | README.md |
| Component structure | This file |
| Error troubleshooting | DEPLOYMENT.md → Troubleshooting |

---

## 🗂️ File Size Reference

| File | Size | Purpose |
|------|------|---------|
| App.tsx | ~15KB | Main component |
| server.js | ~20KB | Backend server |
| components/* | ~50KB | UI components |
| server/data/* | ~5KB | Database files |

Total frontend: ~70KB  
Total backend: ~20KB  
Total data: ~5KB

---

## 🔄 Version Control (Git)

### Recommended .gitignore (already included)
```
node_modules/
dist/
.env
.env.local
server/data/    # or version control for demo
```

### Committing changes
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

---

## 🚀 Deployment Quick Links

- **Render:** render.com (recommended)
- **Vercel:** vercel.com (frontend)
- **Railway:** railway.app (database)
- **MongoDB Atlas:** mongodb.com/cloud

---

## 💡 Pro Tips

1. **Use Postman** to test API endpoints before frontend
2. **Check browser DevTools** for network issues
3. **Read component JSDoc** comments for usage
4. **Keep JSON data** synchronized with database
5. **Test admin features** with default account
6. **Backup database** before major changes
7. **Use git** to track all changes

---

## 📖 Learning Resources

- React: https://react.dev
- Express: https://expressjs.com
- TypeScript: https://typescriptlang.org
- Vite: https://vitejs.dev
- Tailwind: https://tailwindcss.com

---

**This guide is your map! Bookmark it for quick reference. 🗺️**
