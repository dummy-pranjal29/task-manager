# Task Manager - Full Stack Kanban Application

A full-stack Task Management System with user authentication, REST APIs, and a Kanban board UI with drag-and-drop functionality.

## Features

### Authentication System

- **User Registration**: Sign up with name, email, and password
- **User Login**: Secure login with JWT-based sessions
- **Profile Management**: View, edit, and delete user profile
- **Password Management**: Change password with current password verification

### Task Management

- **Create Tasks**: Add tasks with title, description, and due date
- **Read Tasks**: View all tasks or filter by status
- **Update Tasks**: Edit task details
- **Delete Tasks**: Remove tasks
- **Status Management**: Move tasks between Pending, In Progress, and Completed

### Kanban Board

- **Drag and Drop**: Move tasks between columns seamlessly
- **Real-time Updates**: Task status persists after refresh
- **Three Columns**: Pending, In Progress, Completed
- **Visual Indicators**: Due date status (overdue tasks highlighted)

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js

### Backend

- **Framework**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js (Credentials provider)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Project Structure

```
task-manager/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/  # NextAuth API route
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts   # GET, POST tasks
│   │   │   │   └── [id]/      # GET, PUT, DELETE single task
│   │   │   └── users/
│   │   │       ├── signup/    # User registration
│   │   │       └── profile/   # Profile CRUD operations
│   │   ├── dashboard/         # Main Kanban board
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── profile/           # Profile management
│   │   ├── layout.tsx         # Root layout with Providers
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── KanbanBoard.tsx    # Drag-drop board
│   │   ├── TaskCard.tsx       # Individual task card
│   │   └── Providers.tsx      # Session provider
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── prisma.ts          # Prisma client
│   └── types/
│       └── next-auth.d.ts     # TypeScript definitions
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install

```bash
cd task-manager
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Database (MongoDB connection string)
DATABASE_URL="mongodb://localhost:27017/task-manager"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string"

# JWT Secret
JWT_SECRET="your-jwt-secret-key"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## API Overview

### Authentication Endpoints

| Method | Endpoint                         | Description      |
| ------ | -------------------------------- | ---------------- |
| POST   | `/api/auth/callback/credentials` | Login            |
| POST   | `/api/users/signup`              | Register user    |
| GET    | `/api/users/profile`             | Get current user |
| PUT    | `/api/users/profile`             | Update profile   |
| DELETE | `/api/users/profile`             | Delete account   |

### Task Endpoints

| Method | Endpoint          | Description                                     |
| ------ | ----------------- | ----------------------------------------------- |
| GET    | `/api/tasks`      | Get all tasks (with optional `?status=` filter) |
| POST   | `/api/tasks`      | Create new task                                 |
| GET    | `/api/tasks/[id]` | Get single task                                 |
| PUT    | `/api/tasks/[id]` | Update task                                     |
| DELETE | `/api/tasks/[id]` | Delete task                                     |

### Request/Response Examples

**Create Task (POST /api/tasks)**

```json
{
  "title": "Complete project",
  "description": "Finish the Kanban board",
  "dueDate": "2024-12-31"
}
```

**Response**

```json
{
  "message": "Task created",
  "task": {
    "id": "...",
    "title": "Complete project",
    "description": "Finish the Kanban board",
    "status": "pending",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Update Task Status (PUT /api/tasks/[id])**

```json
{
  "status": "in-progress"
}
```

## External Setup Requirements

### MongoDB

1. **Local MongoDB**:

   - Install MongoDB Community Server
   - Start mongod service
   - Default URL: `mongodb://localhost:27017/task-manager`

2. **MongoDB Atlas (Cloud)**:
   - Create free tier cluster at https://cloud.mongodb.com
   - Create database user
   - Whitelist IP (0.0.0.0/0 for development)
   - Get connection string
   - Replace `DATABASE_URL` in `.env`

### Dependencies

All npm dependencies are already in `package.json`:

```bash
npm install
```

## Usage Flow

1. **Landing Page**: Visit home page, click "Get Started"
2. **Sign Up**: Create account with name, email, password
3. **Login**: Use credentials to authenticate
4. **Dashboard**: View Kanban board with your tasks
5. **Create Task**: Click "Add New Task" to create tasks
6. **Manage Tasks**:
   - Drag tasks between columns to change status
   - Click "Edit" to modify task details
   - Click "Delete" to remove task
7. **Profile**: Click "Profile" to manage account settings

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT-based session management
- Protected API routes (require authentication)
- User data isolation (users only see their own tasks)
- Input validation with Zod
- Secure HTTP-only cookies

## Development Notes

- All API routes are protected and require authentication
- Task ownership is verified on all operations
- MongoDB ObjectId validation
- Error handling with appropriate HTTP status codes
- Responsive design with Tailwind CSS
- Mobile-friendly Kanban board

## License

MIT
