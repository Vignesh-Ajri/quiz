# Questly - Multi-Role Assessment Platform

Questly is a production-ready, full-stack online assessment and quiz platform. It provides a robust, server-authoritative quiz engine designed to prevent cheating, alongside comprehensive dashboards for both students and administrators.

---

## Architecture Overview

This project is built using a decoupled architecture, separating the client application from the backend API. 

- **Frontend:** Built with React and Vite. It utilizes Redux Toolkit for global state management and Tailwind CSS with shadcn/ui for styling.
- **Backend:** Built with Node.js and Express. Uses MongoDB (via Mongoose) for data persistence.

## Core Features

### Server-Authoritative Quiz Engine
- **Anti-Cheat Mechanics:** Correct answers are never sent to the client during an active attempt. 
- **Server-Side Timers:** Time limits and expiries are validated on the backend.
- **Auto-Save & Resume:** Answers are periodically synchronized with the server, allowing students to close their browser and safely resume in-progress attempts.

### Student Portal
- **Dashboard:** Analytics overview displaying total attempts, average score, and accuracy.
- **Global Leaderboard:** Ranks top performers across the platform based on aggregate data.
- **Deep Result Analysis:** Immediate feedback upon submission, detailing correct, wrong, and skipped questions alongside explanations.
- **Quiz Discovery:** Browse and search quizzes filtered by category and difficulty.

### Admin Panel
- **Role-Based Access Control (RBAC):** Protected routes and API endpoints restricted solely to administrators.
- **Quiz Management (CRUD):** Create quizzes, manage publish/draft statuses, and configure time limits.
- **Question Manager:** A dedicated interface to dynamically add, edit, or remove questions and their corresponding options for specific quizzes.
- **Category Management:** Categorize quizzes effectively.
- **User Management:** View all registered users and seamlessly promote or demote users between Student and Admin roles.

### Security
- **Authentication:** JWT-based authentication strategy.
- **HttpOnly Cookies:** Refresh tokens are securely stored in HttpOnly cookies, preventing XSS extraction.
- **Silent Token Rotation:** Axios interceptors automatically handle 401 responses, rotating tokens silently in the background without disrupting the user experience.

---

## Project Structure

```text
Quiz/
├── backend/                  # Node.js REST API
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Request handlers and business logic
│   ├── middleware/           # Authentication and Error handling
│   ├── models/               # Mongoose schemas (User, Quiz, Attempt, Category, Question)
│   ├── routes/               # Express route definitions
│   ├── utils/                # Helper functions (JWT, Responses)
│   └── server.js             # Application entry point
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── components/       # Reusable UI components (shadcn/ui, Layouts)
    │   ├── lib/              # Axios configuration and interceptors
    │   ├── pages/            # View components (Auth, Dashboard, Admin panels, Quiz Engine)
    │   ├── store/            # Redux slices and store configuration
    │   └── App.jsx           # Main routing configuration
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone and Install Dependencies

Open a terminal at the root of the project.

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/questly
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

**Frontend (`frontend/.env`):**
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Database Seeding (Optional)

To quickly populate the database with an Admin account, categories, and sample quizzes:
```bash
cd backend
npm run seed
```
This will create a default admin user:
- Email: `admin@questly.com`
- Password: `Admin@123`

### 4. Running the Application

Start the backend server (runs on port 5000):
```bash
cd backend
npm run dev
```

Start the frontend development server (runs on port 3000):
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## DevOps

### Docker

Every service is containerized using multi-stage Dockerfiles to produce lean, secure production images.

| Service  | Base Image        | Strategy                                        |
|----------|-------------------|-------------------------------------------------|
| Backend  | node:20-alpine    | Multi-stage: install deps, then copy to runner  |
| Frontend | nginx:1.27-alpine | Vite build stage, served by Nginx in production |
| Database | mongo:7.0         | Official image with named volume for persistence|

Run the entire stack locally with a single command:

```bash
# Copy and fill .env values first
cp backend/.env.example backend/.env

# Start all services (MongoDB + Backend + Frontend)
docker compose up --build
```

Services will start in the correct order via Docker health checks (`mongo` must be healthy before `backend` starts, `backend` must be healthy before `frontend` starts).

Stop and clean up:

```bash
docker compose down -v
```

### CI/CD Pipeline (GitHub Actions)

Two automated pipelines run on every push:

**CI (`ci.yml`) — runs on every push and pull request:**
- Runs `npm audit` on the backend to catch high or critical CVEs.
- Lints both backend and frontend codebases.
- Builds the Vite production bundle and uploads it as an artifact.
- Validates that both Docker images build successfully.

**CD (`cd.yml`) — runs only on version tags (e.g. `v1.0.0`):**
- Builds versioned Docker images with layer caching.
- Pushes tagged images to Docker Hub (`latest` and `vX.Y.Z`).
- Generates a deployment summary in the GitHub Actions UI.

To trigger a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Project Structure (DevOps Artifacts)

```text
Quiz/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Lint, audit, build on every push
│       └── cd.yml          # Build and push Docker images on release tag
├── docker-compose.yml      # Local full-stack orchestration
├── backend/
│   ├── Dockerfile          # Multi-stage backend image
│   ├── .dockerignore
│   └── .env.example        # Safe template — never commit .env
└── frontend/
    ├── Dockerfile          # Vite build → Nginx runner
    ├── nginx.conf          # SPA routing, gzip, security headers
    └── .dockerignore
```

---

## Security

The following security controls are implemented:

| Layer           | Control                                                               |
|-----------------|-----------------------------------------------------------------------|
| Transport       | Helmet.js sets secure HTTP headers on every response                  |
| Authentication  | Access tokens (15 min) + HttpOnly cookie refresh tokens (7 days)     |
| Token Rotation  | Refresh token rotation with reuse detection and DB invalidation       |
| Authorization   | RBAC middleware — every admin route requires `role: admin`            |
| Rate Limiting   | 200 req/15 min globally; 20 req/15 min on auth routes                |
| Input Limits    | JSON body parser capped at 10 KB                                      |
| Quiz Security   | Correct answers never sent to client during active attempts           |
| Answer Scoring  | Scoring is 100% server-side; clients cannot submit their own scores   |
| Timer           | Attempt expiry enforced on backend; expired attempts auto-close       |
| Role Validation | Admins cannot change their own role; role values validated server-side|
| Secrets         | `.env` excluded from git; `.env.example` provided as safe template    |
| Error Handling  | Stack traces and internal errors suppressed in production mode        |
| Docker          | Containers run as non-root user; secrets injected via env vars        |

