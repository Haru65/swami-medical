# 📡 API Documentation

Complete reference for all Swami Medical Store API endpoints.

**Base URL:** `http://localhost:3001` (development) or your deployed domain

---

## Table of Contents

- [Authentication](#authentication)
- [Medicines](#medicines)
- [Orders](#orders)
- [Health](#health)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Authentication

### POST /api/auth/signup

Register a new user account.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user-1672531200000",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

**Errors:**
- `400` - Missing required fields or user already exists

---

### POST /api/auth/login

Authenticate user and retrieve user information.

**Request:**
```json
{
  "username": "john_doe",
  "password": "secure_password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user-1672531200000",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

**Note:** User ID is returned as `id`. Use this for order creation.

**Errors:**
- `400` - Missing username or password
- `401` - Invalid credentials

---

## Medicines

### GET /api/medicines

Retrieve all medicines from catalog.

**Request:**
```bash
GET /api/medicines
```

**Response (200):**
```json
[
  {
    "id": "med-1672531200000",
    "name": "Amoxicillin Cap",
    "category": "Tablets & Capsules",
    "price": 120,
    "stock": 50,
    "requiresPrescription": true,
    "description": "Antibiotic",
    "usage": "1 cap TDS",
    "sideEffects": "Nausea"
  },
  {
    "id": "med-1672531200001",
    "name": "Dolo 650",
    "category": "Tablets & Capsules",
    "price": 30,
    "stock": 200,
    "requiresPrescription": false,
    "description": "Paracetamol for fever and pain",
    "usage": "1 tab every 4-6 hours",
    "sideEffects": "None"
  }
]
```

---

### POST /api/medicines

Create a new medicine entry. **Admin only.**

**Request:**
```json
{
  "name": "New Medicine",
  "category": "Tablets & Capsules",
  "price": 150,
  "stock": 100,
  "requiresPrescription": false,
  "description": "Medicine description",
  "usage": "Usage instructions",
  "sideEffects": "Side effects"
}
```

**Response (201):**
```json
{
  "id": "med-1672531200002",
  "name": "New Medicine",
  "category": "Tablets & Capsules",
  "price": 150,
  "stock": 100,
  "requiresPrescription": false,
  "description": "Medicine description",
  "usage": "Usage instructions",
  "sideEffects": "Side effects"
}
```

**Errors:**
- `400` - Missing required fields
- `403` - Insufficient permissions

---

### PUT /api/medicines/:id

Update medicine details or stock level.

**Request:**
```json
{
  "stock": 150
}
```

Or update any field:
```json
{
  "price": 140,
  "stock": 100,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "med-1672531200000",
  "name": "Amoxicillin Cap",
  "category": "Tablets & Capsules",
  "price": 140,
  "stock": 100,
  "requiresPrescription": true,
  "description": "Updated description",
  "usage": "1 cap TDS",
  "sideEffects": "Nausea"
}
```

**Errors:**
- `404` - Medicine not found
- `400` - Invalid data

---

### DELETE /api/medicines/:id

Remove a medicine from catalog.

**Request:**
```bash
DELETE /api/medicines/med-1672531200000
```

**Response (200):**
```json
{
  "message": "Medicine deleted",
  "deleted": {
    "id": "med-1672531200000",
    "name": "Amoxicillin Cap",
    "category": "Tablets & Capsules"
  }
}
```

**Errors:**
- `404` - Medicine not found

---

## Orders

### POST /api/orders

Create a new order.

**Request:**
```json
{
  "userId": "user-1672531200000",
  "items": [
    {
      "medicine": {
        "id": "med-1672531200000",
        "name": "Amoxicillin Cap",
        "price": 120
      },
      "quantity": 2,
      "prescriptionAttached": "base64-encoded-image-or-null"
    }
  ],
  "total": 290,
  "customerName": "John Doe",
  "paymentMethod": "Cash on Delivery",
  "prescriptionImage": "base64-image-string-or-null"
}
```

**Response (201):**
```json
{
  "id": "order-1672531200000",
  "userId": "user-1672531200000",
  "items": [...],
  "total": 290,
  "customerName": "John Doe",
  "paymentMethod": "Cash on Delivery",
  "status": "Pending Payment",
  "createdAt": "2024-01-01T10:00:00Z",
  "prescriptionImage": null
}
```

**Stock Impact:**
- Backend automatically deducts ordered quantities from medicine stock
- If stock insufficient, order creation fails

**Errors:**
- `400` - Missing required fields
- `400` - Insufficient stock

---

### GET /api/orders

Get orders. Behavior depends on query params.

**Get all orders (Admin):**
```bash
GET /api/orders
```

**Get user-specific orders:**
```bash
GET /api/orders?userId=user-1672531200000
```

**Response (200):**
```json
[
  {
    "id": "order-1672531200000",
    "userId": "user-1672531200000",
    "items": [...],
    "total": 290,
    "customerName": "John Doe",
    "paymentMethod": "Cash on Delivery",
    "status": "Pending Payment",
    "createdAt": "2024-01-01T10:00:00Z",
    "prescriptionImage": null
  }
]
```

---

### GET /api/orders/:id

Get specific order details.

**Request:**
```bash
GET /api/orders/order-1672531200000
```

**Response (200):**
```json
{
  "id": "order-1672531200000",
  "userId": "user-1672531200000",
  "items": [
    {
      "medicine": {
        "id": "med-1672531200000",
        "name": "Amoxicillin Cap",
        "price": 120
      },
      "quantity": 2,
      "prescriptionAttached": "base64-image"
    }
  ],
  "total": 290,
  "customerName": "John Doe",
  "paymentMethod": "Cash on Delivery",
  "status": "Confirmed",
  "createdAt": "2024-01-01T10:00:00Z",
  "prescriptionImage": "base64-image"
}
```

**Errors:**
- `404` - Order not found

---

### PUT /api/orders/:id

Update order status.

**Valid Status Values:**
- `Pending Payment`
- `Verification Required`
- `Confirmed`
- `Dispatched`
- `Delivered`

**Request:**
```json
{
  "status": "Confirmed"
}
```

**Response (200):**
```json
{
  "id": "order-1672531200000",
  "status": "Confirmed",
  "...": "...other fields..."
}
```

**Errors:**
- `404` - Order not found
- `400` - Invalid status

---

### POST /api/orders/:id/prescription

Attach or update prescription image for order.

**Request:**
```json
{
  "prescriptionImage": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response (200):**
```json
{
  "id": "order-1672531200000",
  "prescriptionImage": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "status": "Pending Payment"
}
```

**Notes:**
- Send as base64-encoded data URL
- Firebase or S3 integration recommended for production
- Max size: ~500KB per image

---

## Health

### GET /health

Check if backend API is running and healthy.

**Request:**
```bash
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

Use this endpoint to verify backend connectivity before making other API calls.

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Successful GET/PUT request |
| `201` | Created | Successful POST request |
| `400` | Bad Request | Missing/invalid fields |
| `401` | Unauthorized | Invalid credentials |
| `403` | Forbidden | Admin-only action |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Backend crash |

---

## Examples

### Example 1: Complete User Flow

```bash
# 1. Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Response: {"user": {"id": "user-123", ...}}

# 2. Get medicines
curl http://localhost:3001/api/medicines

# 3. Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "items": [{"medicine": {...}, "quantity": 1}],
    "total": 150,
    "customerName": "John",
    "paymentMethod": "Cash on Delivery"
  }'

# 4. Get user orders
curl "http://localhost:3001/api/orders?userId=user-123"
```

### Example 2: Admin Operations

```bash
# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Add new medicine
curl -X POST http://localhost:3001/api/medicines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aspirin",
    "category": "Tablets & Capsules",
    "price": 50,
    "stock": 200,
    "requiresPrescription": false,
    "description": "Pain reliever",
    "usage": "1 tablet as needed",
    "sideEffects": "Minor stomach upset"
  }'

# Update order status
curl -X PUT http://localhost:3001/api/orders/order-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "Dispatched"}'
```

### Example 3: Frontend (React) Integration

```typescript
// Signup
const signup = async (username, email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return response.json();
};

// Get medicines
const getMedicines = async () => {
  const response = await fetch('http://localhost:3001/api/medicines');
  return response.json();
};

// Create order
const createOrder = async (orderData) => {
  const response = await fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

---

## Rate Limiting

Currently no rate limiting implemented. **Add before production deployment!**

Recommended: 100 requests/minute per IP address.

---

## CORS

CORS is enabled for development. 

For production, update `server.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Database Persistence

All data is persisted to JSON files:
- `/server/data/users.json`
- `/server/data/medicines.json`
- `/server/data/orders.json`

Data survives server restarts! ✅

---

## Next Steps

- Implement JWT tokens for better security
- Add request validation middleware
- Set up database migration to MongoDB
- Add API versioning (`/api/v1/...`)

---

**Last Updated:** January 2024
**API Version:** 1.0
