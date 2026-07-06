# 🚛 RouteBoard - Fleet & Logistics Management System

A full-stack Fleet and Logistics Management System built using **Angular**, **NestJS**, **PostgreSQL**, and **Prisma ORM**. RouteBoard enables administrators to manage trips, assign drivers, monitor trip progress, and visualize fleet analytics through an intuitive dashboard.

---

## 🌐 Live Demo

**Frontend (Vercel):**
https://frontend-three-snowy-32.vercel.app

**Backend API (Render):**
https://routeboard.onrender.com

---

## ✨ Features

### Authentication
- JWT Authentication
- Secure Login
- Role-Based Access Control (Admin & Driver)

### Admin
- Dashboard with analytics
- Create new trips
- Edit trip details
- Cancel trips
- Assign drivers
- View trip history
- Filter trips by status, driver and date

### Driver
- View assigned trips
- Update trip status
- View trip history
- Personal dashboard with statistics

### Business Rules
- Admin can create, edit and cancel trips.
- Drivers can only update the status of their assigned trips.
- Status transitions follow business workflow:
  - Scheduled → In Progress
  - In Progress → Completed
- Invalid status transitions are prevented.

---

# 🛠 Tech Stack

## Frontend
- Angular 20
- Angular Material
- TypeScript
- Chart.js

## Backend
- NestJS
- Prisma ORM
- JWT Authentication

## Database
- PostgreSQL
- Supabase

## Deployment
- Vercel
- Render

---

# 📸 Application Screenshots

## Login Page

![Login](screenshots/Login.png)

---

## Admin Dashboard

![Admin Dashboard](screenshots/Admin-Dashboard.png)

---

## Trips Management

![Trips Management](screenshots/Admin-Trips.png)

---

## Create New Trip

![Create Trip](screenshots/Create-New-Trips.png)

---

## Driver Dashboard

![Driver Dashboard](screenshots/Driver.png)

---

## Update Trip Status

![Update Status](screenshots/Update-Status-in-Driver.png)

---

# 👤 Test Credentials

## Admin

Email:
```
admin@test.com
```

Password:
```
admin123
```

---

## Driver Accounts

| Driver | Email | Password |
|---------|-------|----------|
| Driver 1 | driver1@test.com | driver123 |
| Driver 2 | driver2@test.com | driver123 |
| Driver 3 | driver3@test.com | driver123 |
| Driver 4 | driver4@test.com | driver123 |
| Driver 5 | driver5@test.com | driver123 |

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Mrithyunjay02/RouteBoard.git
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

---

# 📂 Project Structure

```
RouteBoard
│
├── frontend/
├── backend/
├── screenshots/
├── README.md
```

---

# 👨‍💻 Author

**Mrithyunjay D K**

GitHub:
https://github.com/Mrithyunjay02

---

## 📄 License

This project is intended for educational and portfolio purposes.
