# CRUD Todo Application

A full-stack todo application built with React, Node.js, Express, and PostgreSQL.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- 🎨 Beautiful, responsive UI with modern design
- 🔒 Input validation and error handling
- 📱 Mobile-friendly responsive design
- ⚡ Real-time updates with optimistic UI
- 🗄️ PostgreSQL database with proper indexing
- 🚀 Production-ready architecture

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **PostgreSQL** (version 12 or higher)
- **npm** or **yarn**

## Database Setup

### 1. Install PostgreSQL

**On Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user

**On macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

Open PostgreSQL command line (psql):

```bash
# Connect as postgres user
sudo -u postgres psql

# Or on Windows, use pgAdmin or command prompt:
psql -U postgres
```

Create the database and user:

```sql
-- Create database
CREATE DATABASE todo_app;

-- Create user (replace 'your_username' and 'your_password' with your preferred credentials)
CREATE USER your_username WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_app TO your_username;

-- Exit psql
\q
```

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Installation and Setup

1. **Clone or download the project files**

2. **Install dependencies:**
```bash
npm install
```

3. **Start the application:**
```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend development server (port 5173).

4. **Open your browser and navigate to:**
```
http://localhost:5173
```

## Project Structure

```
├── server/
│   ├── database/
│   │   └── init.js          # Database initialization and connection
│   ├── routes/
│   │   └── todos.js         # Todo API routes
│   └── index.js             # Express server setup
├── src/
│   ├── components/
│   │   ├── TodoForm.tsx     # Todo creation/editing form
│   │   ├── TodoItem.tsx     # Individual todo item
│   │   └── TodoList.tsx     # Todo list with filtering
│   ├── hooks/
│   │   └── useTodos.ts      # Custom hook for todo operations
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   └── todo.ts          # TypeScript type definitions
│   └── App.tsx              # Main application component
├── .env.example             # Environment variables template
└── README.md                # This file
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check endpoint

## Troubleshooting

### Database Connection Issues

1. **Check if PostgreSQL is running:**
```bash
# On Linux/macOS
sudo systemctl status postgresql

# On Windows, check Services or use:
net start postgresql-x64-13
```

2. **Verify database credentials:**
- Make sure the database name, username, and password in `.env` match what you created
- Test connection manually: `psql -h localhost -U your_username -d todo_app`

3. **Check firewall settings:**
- Ensure PostgreSQL port (5432) is not blocked by firewall

### Common Errors

- **"database does not exist"**: Make sure you created the database as shown in step 2
- **"authentication failed"**: Check your username and password in the `.env` file
- **"connection refused"**: PostgreSQL service might not be running

### Port Conflicts

If ports 3001 or 5173 are already in use:
- Change `PORT=3001` in `.env` to another port
- The frontend port can be changed in `vite.config.ts`

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a production PostgreSQL database
3. Configure proper CORS origins
4. Use environment variables for all sensitive data
5. Consider using a process manager like PM2

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Icons**: Lucide React
- **Validation**: Express Validator