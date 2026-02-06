# Campus Resource Portal

A full-stack, production-ready portal for college campus placements, resources, and announcements.

## 🚀 Features

- **Role-Based Access**: Specialized dashboards for Admins, Faculty, and Students.
- **Job Portal**: Post and apply for jobs/internships with filtering.
- **Resource Center**: Library for PDFs, videos, and study links.
- **Announcements**: Real-time campus updates and event scheduling.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium look.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Auth**: JWT (JSON Web Tokens), BCrypt password hashing.

## 📦 Setup Instructions

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file (one is provided in the root/backend). Ensure `MONGO_URI` is correct.
4. Run Seeder: `npm run data:import` (to populate initial data)
5. Start Server: `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start App: `npm run dev`



##  Structure

- `/backend`: Express server, controllers, models, and routes.
- `/frontend`: React application with components, pages, and context.
- `/uploads`: (In backend) Local storage for resumes/files.
