# Cloud Task Management API

A NestJS-based REST API for managing users and tasks with role-based access control, JWT authentication, Redis caching, BullMQ background job processing and deployed to AWS EC2 behind Nginx.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens)

> I didn’t just build this API to write code—I built it to understand production engineering at scale. This project is the result of digging deep into modern backend bottlenecks and solving them systematically. From scaling data retrieval with Redis caching and managing async tasks with BullMQ queues, to configuring robust JWT guards and deploying on AWS EC2 via Nginx, every architectural decision was made with production reliability in mind. It's a clean, modular NestJS ecosystem built to enterprise standards, and exactly the kind of backend engineering I love bringing to a team.

## Core Features

- **User Authentication** - Register and login with JWT-based token authentication
- **Task Management** - Create, read, update, and delete tasks with support for priority and status tracking
- **Role-Based Access Control (RBAC)** - USER and ADMIN roles with permission enforcement
- **User Management** - Admin-only endpoints for managing users (CRUD operations)
- **Advanced Filtering** - Filter tasks by priority, status, or search by title; filter users by role or search by email
- **Pagination** - Offset-based pagination (skip/take) for both tasks and users
- **Caching** - Redis-based caching with TTL support via @nestjs/cache-manager
- **Data Validation** - Request DTOs with class-validator for input validation
- **Database** - PostgreSQL with Prisma ORM and automatic migrations
- **Background Processing** - BullMQ-powered job queues for welcome emails on registration and task reminders 1 hour before due date
- **Notifications** - In-app notification system for task reminders with read/delete management
- **API Documentation** - Interactive Swagger (OpenAPI) documentation for exploring and testing API endpoints.
- **Containerization** - Docker and Docker Compose setup for Redis with environment-based configuration
- **Production Deployment** - Hosted on an AWS EC2 instance using an Nginx reverse proxy for secure traffic routing and port forwarding

## Tech Stack

- **Runtime** - Node.js with NestJS framework
- **Language** - TypeScript
- **Database** - PostgreSQL (Neon) with Prisma ORM
- **Cache & Queue** - Redis via Docker, @nestjs/cache-manager, BullMQ
- **Auth** - JWT with Passport.js
- **Email** - Resend API
- **API Documentation** - Swagger (OpenAPI)
- **Deployment & Infrastructure** - AWS EC2, Nginx (Reverse Proxy)
- **Containerization** - Docker & Docker Compose

## Project Setup

```bash
cd backend/
npm install
```

## Environment Configuration

Create a `.env` file in the `backend/` directory (see `.env.example`):

```env
# DATABASE CONFIG
DATABASE_URL="your_database_url"

# AUTHENTICATION CONFIG
JWT_SECRET="your_jwt_secret_key"
ROLES_KEY="your_roles_key"

# REDIS CONFIG
REDIS_HOST=localhost   # use "redis" when running via Docker Compose
REDIS_PORT=6379
REDIS_TTL=60000

# RESEND EMAIL
RESEND_API_KEY="your_resend_api_key"

# SYSTEM LISTENS TO
PORT=3000
```
## Running the App

### Local Development
```bash
# development with watch mode
cd backend/
npm run start:dev

# debug mode
cd backend/
npm run start:debug
```

### Production Deployment (AWS EC2)
> **Note:** Before running the production build, ensure your database schema is up to date and the Prisma client is generated:

```bash
# 1. Safely apply pending database migrations using Prisma
npx prisma migrate deploy

# 2. Build and run the system container stack in the background
docker compose up -d --build
```

## Docker Setup

Redis is containerized via Docker Compose. To start Redis only (for local development):

```bash
docker compose up -d redis
```

> **Note:** When running locally with `npm run start:dev`, set `REDIS_HOST=localhost` in your `.env`.
> When running the full stack via Docker Compose, set `REDIS_HOST=redis`.

```bash
# To run the full stack:
docker compose up -d --build

# To remove the container:
docker compose down
```
## Production Deployment & Nginx Configuration
The API is deployed on an AWS EC2 instance. Traffic entering through port 80 (HTTP) or 443 (HTTPS) is handled by Nginx, which acts as a reverse proxy, forwarding requests securely to the NestJS application running on port 3000.
```nginx
server {
    listen 80;
    server_name your_domain_or_ec2_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Additional Commands

```bash
# Format code
npm run format

# Lint
npm run lint

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Prisma
npx prisma migrate dev --name <name>
npx prisma migrate deploy
npx prisma generate
npx prisma studio
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user (triggers welcome email) |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/token-info` | Get current user info (requires JWT) |

### Users *(Admin only — requires JWT)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | List all users (filter by role, search by email, pagination) |
| GET | `/users/:id` | Get a specific user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Tasks *(Requires JWT)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | List user's tasks (filter by priority/status, search by title, pagination) |
| GET | `/tasks/:id` | Get a specific task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Notifications *(Requires JWT)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notifications/send-reminder` | Manually create a notification |
| GET | `/notifications` | List user's notifications |
| PATCH | `/notifications/:id/read` | Mark a notification as read |
| DELETE | `/notifications/:id` | Delete a notification |

## Request/Response Examples

### POST /auth/register – Register a New User

**Request Body:**
```json
{
  "email": "mykel@example.com",
  "password": "securepassword123",
  "name": "Mykel"
}
```

**Response (201):**
```json
{
  "id": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "email": "mykel@example.com",
  "name": "Mykel",
  "role": "USER",
  "createdAt": "2026-06-17T10:00:00.000Z",
  "updatedAt": "2026-06-17T10:00:00.000Z"
}
```

---

### POST /auth/login – Login

**Request Body:**
```json
{
  "email": "mykel@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "id": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "email": "mykel@example.com",
  "role": "USER",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI3MDM2OTY3LTk5YmUtNGRiZC05YTZhLTgzYTdjNzA1ODk2NyIsImVtYWlsIjoiam9ubmVsQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4MTY4NTI3NSwiZXhwIjoxNzgxNzcxNjc1fQ.pz0vTEf6DsCDtvCXtq8cBnuF6jscvey3LaIU8Z5AzvE"
}
```

---

### GET /auth/token-info – Get Current User Info

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "email": "mykel@example.com",
  "role": "USER",
  "iat": 1781685792,
  "exp": 1781772192
}
```

---

### POST /tasks – Create a Task

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Finish backend API",
  "description": "Complete all remaining endpoints",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2026-06-20T09:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Finish backend API",
  "description": "Complete all remaining endpoints",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2026-06-20T09:00:00.000Z",
  "userId": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "createdAt": "2026-06-17T10:05:00.000Z",
  "updatedAt": "2026-06-17T10:05:00.000Z"
}
```

---

### GET /tasks – List Tasks (with filter + pagination)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
```
GET /tasks?priority=HIGH&status=PENDING&search=backend&skip=0&take=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Finish backend API",
      "description": "Complete all remaining endpoints",
      "status": "PENDING",
      "priority": "HIGH",
      "dueDate": "2026-06-20T09:00:00.000Z",
      "userId": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
      "createdAt": "2026-06-17T10:05:00.000Z",
      "updatedAt": "2026-06-17T10:05:00.000Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "take": 10
}
```

---

### PATCH /tasks/:id – Update a Task

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Finish backend API",
  "description": "Complete all remaining endpoints",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2026-06-20T09:00:00.000Z",
  "userId": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "createdAt": "2026-06-17T10:05:00.000Z",
  "updatedAt": "2026-06-17T11:30:00.000Z"
}
```

---

### GET /users – List All Users (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Params:**
```
GET /users?role=USER&search=mykel&skip=0&take=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
      "email": "mykel@example.com",
      "name": "Mykel",
      "role": "USER",
      "createdAt": "2026-06-17T10:00:00.000Z",
      "updatedAt": "2026-06-17T10:00:00.000Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "take": 10
}
```

---

### PATCH /users/:id – Update a User (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Mykel Updated",
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "id": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "email": "mykel@example.com",
  "name": "Mykel Updated",
  "role": "ADMIN",
  "createdAt": "2026-06-17T10:00:00.000Z",
  "updatedAt": "2026-06-17T12:00:00.000Z"
}
```

---

### GET /notifications – List Notifications

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Task Reminder: Finish backend API",
    "dueDate": "2026-06-20T09:00:00.000Z",
    "userId": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
    "taskId": 1,
    "isRead": false,
    "createdAt": "2026-06-20T08:00:00.000Z"
  }
]
```

---

### PATCH /notifications/:id/read – Mark Notification as Read

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Task Reminder: Finish backend API",
  "dueDate": "2026-06-20T09:00:00.000Z",
  "userId": "a3f1c820-9b2d-4e77-b501-2f3a9d8c1e44",
  "taskId": 1,
  "isRead": true,
  "createdAt": "2026-06-20T08:00:00.000Z"
}
```

---

### Error Responses

**401 Unauthorized** – Missing or invalid token:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden** – Insufficient role:
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**404 Not Found** – Resource doesn't exist:
```json
{
  "statusCode": 404,
  "message": "Task not found"
}
```

**400 Bad Request** – Validation error:
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

## Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `email` | String (unique) | User email |
| `password` | String | Hashed password |
| `name` | String? | Optional display name |
| `role` | Enum | `USER` or `ADMIN` |
| `createdAt` | DateTime | Created timestamp |
| `updatedAt` | DateTime | Updated timestamp |

### Task
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key (auto-increment) |
| `title` | String | Task title |
| `description` | String? | Optional description |
| `status` | Enum | `PENDING`, `IN_PROGRESS`, or `COMPLETED` |
| `priority` | Enum | `LOW`, `MEDIUM`, or `HIGH` |
| `dueDate` | DateTime? | Optional due date |
| `userId` | String | Foreign key to User |
| `createdAt` | DateTime | Created timestamp |
| `updatedAt` | DateTime | Updated timestamp |

### Notification
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key (auto-increment) |
| `title` | String | Notification title |
| `dueDate` | DateTime | Task due date |
| `userId` | String | Foreign key to User |
| `taskId` | Int | Foreign key to Task |
| `isRead` | Boolean | Read status |
| `createdAt` | DateTime | Created timestamp |

## API Documentation (Swagger)
This project uses Swagger for interactive API documentation, allowing you to explore and test all endpoints directly from your browser.

Once the application is running, access the interactive Swagger UI at:
```http://localhost:3000/api```

![API Docs](docs/images/api-docs.png)

## Architecture Diagram

![Architecture Diagram](docs/images/architecture-diagram.svg)

## Video Demo

[![Watch the demo](https://img.youtube.com/vi/68HLsoONoyQ/maxresdefault.jpg)](https://youtu.be/68HLsoONoyQ)
