# Quick Start Guide

## Installation (One-time setup)

### On Windows:

```bash
# Double-click start.bat
start.bat
```

### On Mac/Linux:

```bash
# Make the script executable
chmod +x start.sh

# Run the script
./start.sh
```

### Manual Setup:

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## First Login

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create an admin account
3. Enter username and password
4. Click "Register"
5. Now login with your credentials

## Usage Workflow

### Step 1: Add Rooms

- Navigate to "Rooms" section
- Click "Add New Room"
- Enter room number, capacity, and monthly rent
- Click "Add Room"

### Step 2: Add Students

- Navigate to "Students" section
- Click "Add New Student"
- Fill in student details (name, email, phone, college ID, etc.)
- Click "Add Student"

### Step 3: Create Bookings (Allocate Students to Rooms)

- Navigate to "Bookings" section
- Click "New Booking"
- Select student and available room
- Select check-in date
- Click "Create Booking"

### Step 4: Manage Fees

- Navigate to "Fees" section
- Click "Add New Fee"
- Select student booking
- Enter month-year (e.g., Jan-2024) and amount
- Click "Add Fee"
- View all fees and mark as paid when payment is received

### Step 5: Dashboard

- View statistics on the Dashboard
- See active students, occupied rooms, and pending fees

## API Testing

Base URL: `http://localhost:5000/api`

### Login Example:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Copy the token from response and use it in Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/students
```

## Troubleshooting

**Port already in use:**

- Backend (5000): Stop other services or change port in .env
- Frontend (3000): Will automatically find next available port

**Database errors:**

- Delete `backend/db/hostel.db` to reset database
- Run backend again to recreate it

**CORS errors:**

- Ensure backend is running on port 5000
- Check frontend vite.config.js proxy settings

**Dependencies issue:**

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Database Reset

To clear all data and start fresh:

1. Stop both servers
2. Delete `backend/db/hostel.db`
3. Start backend and frontend again
4. Register a new admin account

## Default Credentials

Once you register, you can use those credentials. If you forget:

- Delete the database and register again

## Features Overview

✅ Admin authentication with JWT
✅ Student management (CRUD)
✅ Room management (CRUD)
✅ Booking system with occupancy tracking
✅ Fee management with payment tracking
✅ Dashboard with statistics
✅ Responsive design
✅ SQLite database
✅ RESTful API
