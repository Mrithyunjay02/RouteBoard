# RouteBoard

RouteBoard is a full-stack production-ready web application for managing vehicle fleets, trips, drivers, and trip histories. It provides distinct role-based access for Administrators and Drivers, along with real-time updates and an enterprise-grade UI using Angular Material.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Angular 19+ (Standalone Components, signals, lazy-loading)
- **Backend**: NestJS (Modular Architecture)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Auth**: JWT-based Authentication
- **UI**: Angular Material with a custom Enterprise Blue/Grey theme

### Key Features
- **Role-based Authentication**: JWT integration, HTTP interceptors, Route & Role Guards.
- **Admin Dashboard**: Real-time polling (5s interval), statistical cards, status chart, trip management (CRUD).
- **Driver Dashboard**: Assigned trips view, status update workflow.
- **Trip History Tracker**: Logs every state change (old status, new status, changed by, timestamp).
- **Modern UI/UX**: Loading states, error handling (Snackbars), empty states, and Material dialogs.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL (or a Supabase project)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   Create a `.env` file in the `backend` directory based on `.env.example`:
   ```env
   DATABASE_URL="postgres://your-postgres-url"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```
4. Database Migrations & Seeding:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular Dev Server:
   ```bash
   npm run start
   ```
4. Open the application at `http://localhost:4200`

## 🔑 Demo Credentials (Seeded Data)

**Administrator:**
- Email: `admin@test.com`
- Password: `password123`

**Driver:**
- Email: `driver@test.com`
- Password: `password123`

## 📦 Deployment Instructions

### Backend (Render / Heroku)
1. Add `.env` variables to your hosting provider.
2. Build the NestJS app: `npm run build`
3. Start command: `npm run start:prod`
4. Ensure `npx prisma migrate deploy` is run during the build phase.

### Frontend (Vercel / Netlify / Firebase)
1. Set the API URL environment variable for production in `environment.ts` (if configured).
2. Build the Angular app: `npm run build`
3. Deploy the `dist/frontend` folder to your static hosting provider.
4. Setup redirects/rewrites for SPAs (all traffic to `index.html`).

---
*Built as a Senior Full Stack Software Architect demonstration.*
