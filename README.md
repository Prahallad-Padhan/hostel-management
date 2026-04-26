# Hostel Management System

A fully functional hostel management website built with Node.js/Express backend and React frontend.

## Features

- **Student Management**: Add, edit, and delete student records with college ID tracking
- **Room Management**: Manage hostel rooms with capacity and rent details
- **Booking System**: Allocate students to rooms with check-in/check-out functionality
- **Fee Management**: Track and manage monthly fees for each student
- **Admin Dashboard**: Overview of statistics and key metrics
- **Authentication**: Secure admin login system with JWT tokens

## Project Structure

```
hostel-management/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── server.js    # Main server file
│   │   ├── database.js  # SQLite database setup
│   │   ├── middleware/  # Authentication middleware
│   │   └── routes/      # API routes
│   ├── db/              # Database file
│   ├── package.json
│   └── .env
└── frontend/            # React/Vite application
    ├── src/
    │   ├── components/  # React components
    │   ├── styles/      # CSS files
    │   ├── services.js  # API service functions
    │   ├── api.js       # Axios instance
    │   └── App.jsx
    ├── package.json
    └── index.html
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

The database will be automatically initialized on first run.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The API server will run on `http://localhost:5000`

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:3000`

## First Time Setup

1. **Register Admin Account**
   - Click "Register" on the login page
   - Create admin credentials
   - Login with those credentials

2. **Add Rooms**
   - Go to "Rooms" section
   - Add hostel rooms with room numbers, capacity, and rent

3. **Add Students**
   - Go to "Students" section
   - Add student information including college ID

4. **Create Bookings**
   - Go to "Bookings" section
   - Allocate students to rooms with check-in date

5. **Manage Fees**
   - Go to "Fees" section
   - Add monthly fees for each booking
   - Track and mark fees as paid

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/:id/checkout` - Checkout student

### Fees

- `GET /api/fees` - Get all fees
- `POST /api/fees` - Create fee
- `PUT /api/fees/:id/pay` - Mark fee as paid
- `GET /api/fees/status/pending` - Get pending fees

## Database Schema

### Users Table

- Admin credentials for authentication

### Students Table

- Student information (name, email, phone, college ID, etc.)

### Rooms Table

- Room details (room number, capacity, rent, occupancy)

### Bookings Table

- Student room allocations with check-in/check-out dates

### Fees Table

- Monthly fee tracking for each booking

## Technologies Used

**Backend:**

- Node.js
- Express.js
- SQLite3
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**

- React 18
- Vite
- React Router
- Axios

## Security Notes

- Change the JWT secret in `.env` file for production
- Use environment variables for sensitive data
- Implement HTTPS for production
- Add input validation and sanitization
- Consider adding role-based access control

## Future Enhancements

- Email notifications for fee reminders
- SMS alerts for check-in/check-out
- Report generation and export
- Multi-hostel support
- Mobile app
- Payment gateway integration
- Complaint management system
- Visitor tracking

## License

MIT

## Support

For issues or questions, please contact the development team.
