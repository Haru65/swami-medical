# Swami Medical Store - E-Commerce Platform

A complete medical e-commerce platform with React frontend and Node.js/Express backend. Features user authentication, admin dashboard, prescription upload, and JSON-based database.

## Features

### User Features
- **User Authentication**: Signup/Login with email and password
- **Medicine Catalog**: Browse medicines by category, condition, or wellness
- **Shopping Cart**: Add/remove items with real-time stock updates
- **Prescriptions**: Upload prescriptions for prescription-required medicines
- **Orders**: Place orders with Cash on Delivery or Online Payment options
- **Order Tracking**: View order history and status
- **Account Management**: View profile and order history

### Admin Features
- **Dashboard**: View total sales revenue and inventory stats
- **Order Management**: Verify orders, update payment status, mark as dispatched/delivered
- **Inventory Management**: Add new medicines, update stock levels
- **Prescription Verification**: View uploaded prescriptions for verification
- **Analytics**: Track sales and inventory metrics

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express.js
- **JSON file-based database** (easily upgradeable to MongoDB/PostgreSQL)
- **CORS** enabled for cross-origin requests

## Project Structure

```
├── frontend code files (App.tsx, components/, etc.)
├── server.js (Express backend)
├── package.json (dependencies)
├── vite.config.ts (Vite configuration)
├── .env.example (environment variables template)
├── .env.local (local development environment)
├── Procfile (Render deployment config)
├── vercel.json (Vercel deployment config)
├── render.yaml (Render YAML config)
└── server/
    └── data/ (JSON database files)
        ├── users.json
        ├── medicines.json
        └── orders.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Development Setup

1. **Clone/Navigate to project**
   ```bash
   cd swami-medical-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment files** (copy if not exists)
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   This runs both backend (port 3001) and frontend (port 3000) concurrently.

5. **Application will be available at**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Email: `admin@swami.com`
- Password: `admin123`

**Test User:**
- Create a new account through signup

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Add new medicine (Admin)
- `PUT /api/medicines/:id` - Update medicine stock
- `DELETE /api/medicines/:id` - Delete medicine

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin) or user orders (if userId provided)
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/prescription` - Upload prescription

### Health
- `GET /health` - API health check

## Database Structure

### users.json
```json
[
  {
    "id": "user-id",
    "username": "username",
    "email": "email@example.com",
    "password": "hashed-password",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### medicines.json
```json
[
  {
    "id": "med-id",
    "name": "Medicine Name",
    "category": "Tablets & Capsules",
    "price": 100,
    "stock": 50,
    "requiresPrescription": false,
    "description": "Medicine description",
    "usage": "1 tab daily",
    "sideEffects": "None"
  }
]
```

### orders.json
```json
[
  {
    "id": "order-id",
    "userId": "user-id",
    "items": [...],
    "total": 1000,
    "customerName": "John Doe",
    "paymentMethod": "Cash on Delivery",
    "status": "Confirmed",
    "createdAt": "2024-01-01T00:00:00Z",
    "prescriptionImage": "base64-image-or-null"
  }
]
```

## Deployment

### Deploy to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repository
   - Use command: `npm install && npm run build && node server.js`
   - Set environment variables in Render dashboard

3. **Environment Variables on Render**
   ```
   VITE_API_URL=https://your-app-name.onrender.com
   NODE_ENV=production
   ```

### Deploy to Vercel

1. **For Frontend only (if using separate backend)**
   - Go to https://vercel.com
   - Import project from GitHub
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variable: `VITE_API_URL=your-api-url`

2. **For Full Stack on Render** (Recommended)
   - Use the Render deployment instructions above
   - The app will serve both frontend and backend

## Production Considerations

### Data Persistence
- Currently uses JSON files stored in `server/data/`
- For production, consider migrating to:
  - MongoDB (cloud: MongoDB Atlas)
  - PostgreSQL (cloud: Railway, Supabase)
  - Firebase Firestore

### Security Enhancements Needed
- Implement password hashing (bcryptjs)
- Add JWT tokens for better auth
- Implement rate limiting
- Add HTTPS enforcement
- Validate and sanitize all inputs
- Add CSRF protection

### Scalability
- Add caching layer (Redis)
- Implement image optimization
- Set up CDN for static assets
- Add API rate limiting

## Development Workflow

### Add New Medicine
1. Login as admin (username: admin)
2. Click account icon and select Admin
3. Go to "Add Medicine" tab
4. Fill in medicine details
5. Submit

### Create Order
1. Login or signup
2. Browse medicines
3. Add to cart
4. Proceed to checkout
5. Choose payment method
6. Order created!

### Update Order Status
1. Login as admin
2. Click Admin dashboard
3. View pending orders
4. Update status as needed

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3001` |

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 3001
- Check `VITE_API_URL` is correctly set

### Database Files Missing
- Backend automatically creates `server/data/` directory on first run
- Initial data is auto-populated

### Port Already in Use
- Change port in vite.config.ts (frontend) or server.js (backend)

## Performance Tips

- Clear browser cache if UI doesn't update
- Use browser DevTools to debug API calls
- Check browser console for errors

## Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced search and filters
- [ ] Medicine recommendations
- [ ] Customer reviews
- [ ] Wishlist feature
- [ ] Mobile app
- [ ] Real database migration
- [ ] Docker containerization

## License

This project is created for educational purposes.

## Support

For issues or questions, please check the code comments or contact the development team.
