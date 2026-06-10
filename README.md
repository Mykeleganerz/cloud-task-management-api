# Cloud Task Management API

A NestJS-based REST API for managing users and tasks with role-based access control, JWT authentication, and Redis caching.

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

## Project Setup

```bash
npm install
```

## Compile and Run the Project

```bash
# development
npm run start

# development with watch mode
npm run start:dev

# debug mode with watch
npm run start:debug

# production mode
npm run start:prod

# build
npm run build
```

## Additional Commands

```bash
# Code formatting
npm run format

# Linting
npm run lint

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## Environment Configuration

Create a `.env` file in the `backend/` directory:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600
ROLES_KEY=roles
```

## Docker Setup

The project includes Redis via Docker Compose. Start Redis:

```bash
docker-compose up -d
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/token-info` - Get current user info (requires JWT)

### Users (Admin only, requires JWT)

- `POST /users` - Create a new user
- `GET /users` - List all users (supports filtering by role, search by email, pagination)
- `GET /users/:id` - Get a specific user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Tasks (Requires JWT)

- `POST /tasks` - Create a new task
- `GET /tasks` - List user's tasks (supports filtering by priority/status, search by title, pagination)
- `GET /tasks/:id` - Get a specific task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Data Models

### User
- `id` (UUID) - Primary key
- `email` (unique) - User email
- `password` - Hashed password
- `name` (optional) - User's name
- `role` - USER or ADMIN
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
- `tasks` - Relation to user's tasks

### Task
- `id` (auto-increment) - Primary key
- `title` - Task title
- `description` (optional) - Task description
- `status` - PENDING, IN_PROGRESS, or COMPLETED
- `priority` - LOW, MEDIUM, or HIGH
- `dueDate` (optional) - Due date
- `userId` - Foreign key to User
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
