# MES Complaint Group
### Government-Level Complaint Management System
> Created by **Suraj Rawat**

Replace WhatsApp-based complaints with a professional, trackable, and transparent web system.

---

## 📁 Project Structure

```
mes-complaint-group/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js              # User schema (name, mobile, password, role)
│   │   └── Complaint.js         # Complaint schema + auto ID generation
│   ├── routes/
│   │   ├── auth.js              # /api/auth (register, login, me, create-admin)
│   │   └── complaints.js        # /api/complaints (CRUD)
│   ├── uploads/                 # Auto-created for photo uploads
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── ComplaintCard.js  # Reusable complaint card (user + admin)
    │   │   ├── Navbar.js         # Responsive navbar
    │   │   └── ProtectedRoute.js # Auth guards
    │   ├── context/
    │   │   └── AuthContext.js    # Global auth state
    │   ├── pages/
    │   │   ├── LandingPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── AddComplaintPage.js
    │   │   ├── MyComplaintsPage.js
    │   │   └── admin/
    │   │       ├── AdminLoginPage.js
    │   │       └── AdminDashboard.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) OR local MongoDB
- npm or yarn

---

### Step 1 — Clone / Download the project

```bash
cd mes-complaint-group
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/mes_complaints
JWT_SECRET=your_very_secret_key_here
NODE_ENV=development
```

Start backend:
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

### Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

Frontend runs at: **http://localhost:3000**

---

### Step 4 — Create Admin Account

After the backend is running, make a POST request to create the first admin:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "mobile": "9999999999",
    "password": "admin123",
    "secretKey": "MES_ADMIN_SECRET_2024"
  }'
```

**Using Postman / Thunder Client:**
- Method: POST
- URL: `http://localhost:5000/api/auth/create-admin`
- Body (JSON):
```json
{
  "name": "Admin",
  "mobile": "9999999999",
  "password": "admin123",
  "secretKey": "MES_ADMIN_SECRET_2024"
}
```

Then login at: **http://localhost:3000/admin/login**

---

## 🌐 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login (user or admin) |
| GET | `/me` | Private | Get current user |
| POST | `/create-admin` | Secret | Create admin account |

### Complaint Routes — `/api/complaints`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | User | Submit new complaint |
| GET | `/my` | User | Get own complaints |
| GET | `/all` | Admin | Get all complaints + stats |
| PUT | `/:id/status` | Admin | Update status & remarks |
| DELETE | `/:id` | Admin | Delete complaint |
| GET | `/:id` | Private | Get single complaint |

---

## 🚀 Deployment

### Frontend → Netlify

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
3. Drag the `build/` folder
4. Set environment variable in Netlify:
   - `REACT_APP_API_URL` = your Render/Railway backend URL

**OR connect GitHub repo and set:**
- Build command: `npm run build`
- Publish directory: `build`

---

### Backend → Render

1. Push your `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. After deploy, update CORS in `server.js` with your Netlify URL

---

### Database → MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all, for Render)
5. Get connection string → paste into `MONGO_URI` in `.env`

---

## 🎨 Features Summary

### User Side
- ✅ Register / Login (JWT)
- ✅ Submit complaint with photo upload
- ✅ Auto Complaint ID: `MES-YYYYMMDD-XXX`
- ✅ View own complaints with status filter
- ✅ Color-coded status badges

### Admin Side
- ✅ Separate admin login
- ✅ Dashboard with stats (Total/Pending/In Progress/Completed)
- ✅ Filter by Location, Department, Status
- ✅ Department tabs (Water Supply / Electrical / B&R)
- ✅ Search by ID, name, mobile, quarter
- ✅ Update complaint status
- ✅ Add remarks
- ✅ Delete complaints

---

## 🗃️ Database Schema

### Users Collection
```js
{
  name: String,
  mobile: String (unique),
  password: String (bcrypt hashed),
  role: "user" | "admin",
  createdAt, updatedAt
}
```

### Complaints Collection
```js
{
  complaintId: "MES-20241225-001",
  date: Date,
  name: String,
  mobile: String,
  location: "Yogendra Vihar" | "VRC" | "Bana Singh" | "APS",
  quarterNumber: String,
  department: "Water Supply" | "Electrical" | "B&R",
  complaintType: String,
  description: String,
  photoUrl: String | null,
  status: "Pending" | "In Progress" | "Completed",
  userId: ObjectId (ref: User),
  remarks: String,
  createdAt, updatedAt
}
```

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (salt 10)
- JWT tokens expire in 7 days
- Users can only access their own complaints
- Admin role required for status updates and deletion
- File upload restricted to images only, max 5MB
- **Disable `/create-admin` route in production** after creating your admin

---

> Built with ❤️ by **Suraj Rawat** — MES Complaint Group
