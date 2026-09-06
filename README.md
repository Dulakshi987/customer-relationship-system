# Form Management System

A full-stack web application with customer/admin authentication, role-based access control, and a CRUD form management system with filtering.

## Tech Stack

- **Frontend:** React.js (Vite) + React Router + Axios
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via Sequelize ORM)
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing

## Project Structure

```
project/
  backend/
    config/db.js
    models/ (User, Submission)
    controllers/ (authController, submissionController)
    middleware/auth.js
    routes/ (authRoutes, submissionRoutes)
    utils/ (generateTokens, seedAdmin)
    server.js
  frontend/
    src/
      pages/ (Home, CustomerRegister, CustomerLogin, Application, AdminLogin, AdminDashboard)
      context/ (AuthContext, ProtectedRoute)
      api/axios.js
      App.jsx, main.jsx
```

## Setup Instructions

### 1. Database
Create a MySQL database:
```sql
CREATE DATABASE form_management;
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # fill in your DB credentials & JWT secrets
npm install
npm run seed:admin      # creates a seeded super admin account
npm run dev              # starts server on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev              # starts app on http://localhost:5173
```

## Environment Variables (backend/.env)
See `backend/.env.example`:
- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES`
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new customer |
| POST | `/api/auth/login` | Public | Customer login |
| POST | `/api/auth/admin/login` | Public | Admin login |
| POST | `/api/auth/admin/create` | Admin (JWT) | Create a new admin (auto-generated password) |

### Submissions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/submissions` | Customer (JWT) | Submit a new form |
| GET | `/api/submissions?gender=&search=` | Admin (JWT) | Get all submissions, filter by gender, search by name |
| PUT | `/api/submissions/:id` | Admin (JWT) | Update a submission |
| DELETE | `/api/submissions/:id` | Admin (JWT) | Delete a submission |

All protected routes require header: `Authorization: Bearer <accessToken>`

## Notes
- Passwords are hashed with bcrypt before storage.
- Role-based guards enforced via `middleware/auth.js` (`verifyToken`, `requireRole`).
- First admin account is created via `npm run seed:admin`; that admin can then create further admins through the protected `/api/auth/admin/create` endpoint.
