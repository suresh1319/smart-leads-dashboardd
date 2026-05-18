# Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack with clean architecture, scalable code practices, and a professional user experience.

## Features

- **Authentication System**: JWT-based authentication with Login & Registration.
- **Role-Based Access Control (RBAC)**: Admin and Sales User roles.
- **Lead Management (CRUD)**: Create, view, update, and delete leads.
- **Advanced Filtering & Search**: Debounced search by Name/Email, filter by Status and Source.
- **Sorting & Pagination**: Server-side pagination (10 items/page) and sorting (Latest/Oldest).
- **CSV Export**: Export leads data to CSV format.
- **Dark Mode Support**: Beautiful UI with Light/Dark mode.
- **Dockerized**: Easy setup using Docker Compose.

## Tech Stack

- **Frontend**: React.js, TypeScript, Vite, TailwindCSS, React Query, React Router, Context API.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, express-validator.
- **Infrastructure**: Docker, Docker Compose, Nginx (for serving frontend in production).

## Folder Structure

```
smart-leads-dashboard/
├── backend/               # Node.js Express API
│   ├── src/
│   │   ├── config/        # Database and env configs
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth, error handling, validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints routing
│   │   ├── services/      # Core business logic
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Helper functions (JWT, CSV, Response format)
│   ├── package.json
│   └── tsconfig.json
├── frontend/              # React Vite SPA
│   ├── src/
│   │   ├── api/           # Axios setup and API call wrappers
│   │   ├── components/    # Reusable UI & Feature components
│   │   ├── context/       # Auth & Theme context providers
│   │   ├── hooks/         # Custom React hooks (React Query, Debounce)
│   │   ├── pages/         # Application pages
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx        # Main App routing
│   │   └── index.css      # Tailwind & Custom styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── docker-compose.yml
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Running Locally (Development)

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd smart-leads-dashboard
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update MONGODB_URI in .env if needed
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

3. **Frontend Setup**:
   Open a new terminal.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### Option 2: Running via Docker (Production Simulation)

From the root directory:

```bash
docker-compose up --build -d
```

- Frontend will be accessible at: `http://localhost`
- Backend API will be accessible internally via Nginx proxy at `http://localhost/api`
- MongoDB will run internally and expose port `27017`.

## API Documentation

The API follows RESTful standards with standard HTTP status codes.

### Authentication

- `POST /api/auth/register` - Register a new user (admin or sales)
- `POST /api/auth/login` - Login user and receive JWT
- `GET /api/auth/me` - Get current authenticated user details (Protected)

### Leads

*All routes require Bearer Token in `Authorization` header.*

- `GET /api/leads` - Get all leads (Supports Pagination, Filtering, Search, Sorting)
  - Query Params: `page`, `limit`, `status`, `source`, `search`, `sort`
- `GET /api/leads/:id` - Get a single lead by ID
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update an existing lead
- `DELETE /api/leads/:id` - Delete a lead (Admin Only)
- `GET /api/leads/export` - Export all leads as CSV

## Credentials for Testing

You can register a new user or test with the following formats:
- **Admin**: Select "Admin" role during registration. Admins can delete leads and see all leads.
- **Sales**: Select "Sales User" role during registration. Sales users can only view, update, and manage leads they created.

## Design Decisions

- **Architecture**: Separated Business Logic (Services) from Controllers in the backend for cleaner code and testability.
- **State Management**: Used React Context for global state (Auth, Theme) and React Query for server-state management (caching, loading states, invalidation).
- **TypeScript**: Strict TypeScript checks with shared types architecture.
- **UI/UX**: Custom components built with TailwindCSS, supporting Dark Mode, Loading Skeletons, empty states, and debounced searching.
