# Event Management System (EMS)

A full-stack web application for managing events and memberships.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running (default: `mongodb://localhost:27017/event_management`)

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one is already provided in this workspace) with the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event_management
   JWT_SECRET=supersecretkey123
   ```
4. Seed the database with initial users:
   ```bash
   # Start the server first
   npm run dev (or node server.js)
   # Then use an API client (like Postman or curl) to hit:
   POST http://localhost:5000/api/auth/seed
   ```
   **Default Credentials:**
   - Admin: `admin@ems.com` / `adminpassword`
   - User: `user@ems.com` / `userpassword`

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Documentation (Basic)

### Authentication
- `POST /api/auth/login`: Login with email and password. Returns user object and JWT token.
- `POST /api/auth/seed`: Initialize the database with sample Admin and User.

### Maintenance (Admin Only)
- `GET /api/maintenance/events`: Fetch all events.
- `POST /api/maintenance/events`: Create a new event.
- `DELETE /api/maintenance/events/:id`: Delete an event.
- `GET /api/maintenance/members`: Fetch all members.
- `POST /api/maintenance/members`: Create a new member.

### Transactions
- `POST /api/transactions/add`: Create a new membership.
- `GET /api/transactions/:number`: Fetch membership details by Membership Number.
- `PATCH /api/transactions/update/:number`: Extend or Cancel a membership.

### Reports
- `GET /api/reports/memberships`: Fetch all membership records with populated details.
- `GET /api/reports/users`: Fetch list of system users (Admin only).

---

## Features
- **Role-Based Access**: Admins can access all modules; Users are restricted from the Maintenance module.
- **Membership Management**: Add memberships with different durations (6mo, 1yr, 2yr).
- **Form Validations**: Mandatory fields and valid formats checked on both frontend and backend.
- **Flow Chart**: A reference page showing the logical application flow.
