# Holy Star Hotel Management System

An enterprise-level Hotel Management System built with Next.js, Express, and MySQL.

## Features
- **Premium UI/UX**: Designed with modern principles (Airbnb, Hilton, Stripe).
- **Public Website**: Home, Rooms, About, and Contact pages.
- **Admin Dashboard**: Real-time stats, revenue charts, and occupancy tracking.
- **Room Management**: Add, edit, and monitor room status.
- **Booking Engine**: Availability checks and transactional booking.
- **Authentication**: JWT-based with Role-Based Access Control (RBAC).

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Framer Motion, Lucide React, Shadcn UI.
- **Backend**: Node.js, Express, Knex.js, MySQL.
- **Database**: MySQL.

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL Server

### Database Setup
1. Create a MySQL database named `holy_star_hotel`.
2. Configure `.env` in the `backend` folder with your credentials.
3. Run migrations and seeds:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

### Running the Backend
```bash
cd backend
npm run dev
```

### Running the Frontend
```bash
cd frontend
npm run dev
```

## Admin Account
- **Email**: admin@holystar.com
- **Password**: admin123
- **Role**: Super Admin

## Project Structure
- `backend/`: Express.js server and Knex migrations.
- `frontend/`: Next.js application with Tailwind CSS.
- `database/`: SQL scripts (schema and seeds via Knex).
