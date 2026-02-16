<!-- omit from toc -->
# 🚀 QUICK START GUIDE

**Get Swami Medical Store running in 5 minutes!**

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ ~300MB free disk space

---

## ⚡ 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd swami-medical-store
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```
This will install:
- React 19
- Express server
- Vite build tool
- Tailwind CSS
- All required packages

### Step 3: Start the Application
```bash
npm run dev
```

The command starts:
- 🔵 Backend server on `http://localhost:3001`
- 🟢 Frontend app on `http://localhost:3000`

### Step 4: Open Your Browser
```
http://localhost:3000
```

✅ **You're done!** The app is now running locally.

---

## 🔑 Login to Test

### Option 1: Login as Admin (Full Access)
```
Username: admin
Password: admin123
Email: admin@swami.com
```

**What you can do as admin:**
- View all orders
- Verify prescriptions
- Add new medicines
- Manage inventory
- Update order status

### Option 2: Create a Regular User Account
1. Click "Sign Up" at login screen
2. Enter username, email, password
3. Browse medicines and place orders

---

## 📱 What to Try First

### As Customer
1. ✅ Browse medicines
2. ✅ Add item to cart
3. ✅ View cart
4. ✅ Proceed to checkout
5. ✅ Place an order
6. ✅ Check "Account" for order history

### As Admin
1. ✅ Login with admin credentials
2. ✅ Click account icon → Admin
3. ✅ View orders
4. ✅ Add Medicine
5. ✅ Manage stock

---

## 🗂️ File Locations (Important!)

Application creates JSON database files automatically:
```
server/
  └── data/
      ├── users.json          (User accounts)
      ├── medicines.json      (Medicine catalog)
      └── orders.json         (Order records)
```

These are auto-created on first run. **No manual setup needed!**

---

## 🐛 If Something Goes Wrong

### Issue: "Port 3000 or 3001 already in use"
```bash
# Kill existing process
# Or change port in .env.local
VITE_API_URL=http://localhost:3002
```

### Issue: "Cannot find module 'express'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS errors in browser console"
✅ Ensure backend is running on port 3001  
✅ Check Network tab in DevTools to confirm API calls

### Issue: "Blank white screen"
- Open browser DevTools (F12)
- Check Console for errors
- Try hard refresh (Ctrl+Shift+R)

---

## 📝 Project Structure You Should Know

```
swami-medical-store/
├── App.tsx                    ← Main React component
├── server.js                  ← Express backend
├── components/
│   ├── Auth.tsx              ← Login/Signup
│   ├── AdminDashboard.tsx    ← Admin panel
│   ├── MedicineGrid.tsx      ← Product list
│   └── [other components]
├── server/data/              ← Database (auto-created)
├── vite.config.ts            ← Vite settings
├── package.json              ← Dependencies
└── .env.local                ← Environment variables
```

---

## 🔧 Common Commands

```bash
# Start development (frontend + backend)
npm run dev

# Start backend only
npm run server

# Start frontend only  
npm run client

# Build for production
npm run build

# Start production version
npm start
```

---

## 🌐 API Health Check

Open in browser to verify backend is working:
```
http://localhost:3001/health
```

Should return:
```json
{"status": "ok"}
```

---

## 💾 Database

All data stored locally in JSON files during development:
- **users.json**: User accounts
- **medicines.json**: Product catalog
- **orders.json**: Customer orders

Data persists between restarts! 🎉

---

## 🚀 Next Steps

### Want to customize?
- Edit `components/Auth.tsx` - Change auth UI
- Edit `components/MedicineGrid.tsx` - Modify product display
- Edit `server.js` - Add new API endpoints

### Want to deploy?
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Render deployment (recommended)
- Vercel deployment
- Production setup

### Want to add features?
Check out the [Future Enhancements](README.md#-future-enhancements) section!

---

## 📞 Help & Support

### Check these files for help:
- [README.md](README.md) - Full documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [server.js](server.js) - Backend code with comments

### Common questions answered in:
- README.md → Troubleshooting section
- DEPLOYMENT.md → Production Considerations

---

## ✨ Pro Tips

1. **Use browser DevTools** (F12) to inspect API calls in Network tab
2. **Check localStorage** in DevTools → Application → Local Storage to see user data
3. **View JSON files** directly in `server/data/` to understand data structure
4. **Use Postman** to test API endpoints if needed

---

## 🎉 You're All Set!

Your medical e-commerce platform is now:
- ✅ Running locally
- ✅ Connected to backend
- ✅ Ready for development
- ✅ Ready for testing
- ✅ Ready for deployment

**Happy Coding! 🚀**

---

**Still need help?** Check [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md)
