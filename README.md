# Backend API

A comprehensive RESTful API for task management with user authentication.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [Code Quality Tools](#code-quality-tools)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

## Tech Stack

This project uses a modern Node.js stack with the following technologies:

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Token for secure authentication
- **bcryptjs**: Library for hashing passwords
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development utility for automatic server restarts

## Features

- **User Authentication**
  - Secure signup and login with JWT
  - Password hashing for security
  - Token-based authentication
  - Logout functionality with token blacklisting
  
- **Task Management**
  - Create, read, update, and delete tasks
  - Tasks include title, description, due date, status, priority, and category
  - Task filtering by user
  
- **Security**
  - JWT token authentication
  - Password hashing
  - Token blacklisting for secure logout
  - Input validation
  
- **Development Tools**
  - ESLint for code quality
  - Prettier for code formatting
  - Husky for Git hooks
  - Conventional commit messages

## Project Structure

```
backend/
├── controllers/           # Business logic for routes
│   ├── authController.js  # Authentication logic
│   └── taskController.js  # Task management logic
├── env/                   # Environment configurations
│   └── development.env    # Development environment variables
├── middleware/
│   └── authMiddleware.js  # JWT authentication middleware
├── models/                # Database models (Mongoose schemas)
│   ├── BlacklistToken.js  # Model for blacklisted tokens
│   ├── Task.js           # Task data model
│   └── User.js           # User data model
├── routes/                # API route definitions
│   ├── auth.js           # Authentication routes
│   └── tasks.js          # Task management routes
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
└── server.js             # Application entry point
```

## API Documentation

### Authentication

#### Signup

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **Success Response**:
  - **Code**: 201 Created
  - **Content**:

    ```json
    {
      "status": "success",
      "message": "User registered successfully."
    }
    ```

- **Error Response**:
  - **Code**: 400 Bad Request (Invalid input)
  - **Content**:

    ```json
    {
      "status": "error",
      "message": "Email and password are required."
    }
    ```

  - **Code**: 409 Conflict (Email already exists)
  - **Content**:

    ```json
    {
      "status": "error",
      "message": "Email already exists. Please use a different email address."
    }
    ```

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

    ```json
    {
      "status": "ok",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

- **Error Response**:
  - **Code**: 401 Unauthorized (Invalid credentials)
  - **Content**:

    ```json
    {
      "status": "error",
      "message": "Invalid password. Please try again."
    }
    ```

#### Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

    ```json
    {
      "status": "success",
      "message": "Logout successful"
    }
    ```

- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:

    ```json
    {
      "status": "error",
      "message": "Authorization token is required"
    }
    ```

### Tasks

All task endpoints require authentication with the `Authorization: Bearer <token>` header.

#### Get All Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

    ```json
    [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Complete project documentation",
        "description": "Write comprehensive README for the backend API",
        "dueDate": "2025-06-01T00:00:00.000Z",
        "status": "pending",
        "priority": "high",
        "category": "documentation",
        "createdBy": "60d21b4667d0d8992e610c83"
      },
      // ... more tasks
    ]
    ```

#### Create Task

- **URL**: `/tasks`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

  ```json
  {
    "title": "Review code",
    "description": "Review pull request #42",
    "dueDate": "2025-06-05T14:00:00.000Z",
    "status": "pending",
    "priority": "medium",
    "category": "development"
  }
  ```

- **Success Response**:
  - **Code**: 200 OK
  - **Content**: The created task object

#### Update Task

- **URL**: `/tasks/:taskId`
- **Method**: `PUT`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

  ```json
  {
    "title": "Review code - updated",
    "status": "completed"
  }
  ```

- **Success Response**:
  - **Code**: 200 OK
  - **Content**: The updated task object

#### Delete Task

- **URL**: `/tasks/:taskId`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

    ```json
    {
      "message": "Task deleted successfully"
    }
    ```

## Environment Setup

Create a file named `development.env` in the `env` directory with the following variables:

```
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/taskmanager
JWT_SECRETKEY=yoursecretkeyhere
JWT_TOKEN_EXPIRYTIME=24h
```

## Getting Started

1. Install dependencies:

```
npm install
```

2. Start MongoDB service (make sure MongoDB is installed).

3. Start the development server:

```
npm run dev
```

4. The API will be available at `http://localhost:3000` (or the port you specified).

## Code Quality Tools

This project uses several tools to maintain code quality and consistency:

### ESLint

ESLint is used to enforce code style and quality standards.

- Run `npm run lint` to check for linting issues
- Run `npm run lint:fix` to automatically fix linting issues where possible

### Prettier

Prettier is used for consistent code formatting.

- Run `npm run format` to format all code according to the project's style guidelines

### Husky & Git Hooks

Husky is used to set up Git hooks that run before commits and ensure code quality.

- **pre-commit**: Runs lint-staged to check and fix issues in staged files
- **commit-msg**: Validates commit messages based on conventional commit format

### Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>
```

Common types include:

- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Changes that do not affect code behavior (formatting, etc.)
- refactor: Code changes that neither fix a bug nor add a feature
- test: Adding or updating tests
- chore: Changes to the build process, dependencies, etc.
