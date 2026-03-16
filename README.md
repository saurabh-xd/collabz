# Collabzz Team Task Manager API


## Features

- User registration and login with hashed passwords
- JWT-protected task routes
- Task CRUD operations
- Creator-only update and delete permissions
- Status validation for `todo`, `in-progress`, and `done`
- Filtering by status
- Bonus: pagination and title search with query params

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```text
src/
  app.js
  index.js
  controllers/
  db/
  middleware/
  models/
  routes/
  utils/
```

## Setup Instructions

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file using `.env.example`:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/collabzz
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the server:

```bash
npm run dev
```

The API will run at `http://localhost:8000`.

## API Endpoints

### Auth

#### Register

- Method: `POST`
- Route: `/auth/register`

Sample request:

```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com",
  "password": "password123"
}
```

Sample response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Saurabh",
      "email": "saurabh@example.com"
    },
    "token": "JWT_TOKEN"
  }
}
```

#### Login

- Method: `POST`
- Route: `/auth/login`

Sample request:

```json
{
  "email": "saurabh@example.com",
  "password": "password123"
}
```

Sample response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "name": "Saurabh",
      "email": "saurabh@example.com"
    }
  }
}
```

### Tasks

All task routes require this header:

```text
Authorization: Bearer JWT_TOKEN
```

#### Create Task

- Method: `POST`
- Route: `/tasks`

Sample request:

```json
{
  "title": "Build API",
  "description": "Complete the internship assignment",
  "status": "todo",
  "assignedTo": "USER_ID"
}
```

#### Get All Tasks

- Method: `GET`
- Route: `/tasks`
- Optional query params:
  - `status=todo`
  - `search=api`
  - `page=1`
  - `limit=10`

Example:

```text
GET /tasks?status=todo&search=api&page=1&limit=10
```

#### Get Task By ID

- Method: `GET`
- Route: `/tasks/:id`

#### Update Task

- Method: `PUT`
- Route: `/tasks/:id`
- Only the creator can update

Sample request:

```json
{
  "title": "Build final API",
  "description": "Add README and polish responses",
  "status": "in-progress"
}
```

#### Delete Task

- Method: `DELETE`
- Route: `/tasks/:id`
- Only the creator can delete

Sample delete response:

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Business Rules Implemented

- Passwords are hashed before being stored
- JWT is required on all task routes
- Task status only accepts `todo`, `in-progress`, and `done`
- Only the task creator can update or delete the task

## Notes

- `GET /tasks` returns paginated results sorted by latest created task first
- `assignedTo` is optional, but if provided it must be a valid existing user
- Invalid task IDs and invalid status values return proper error responses

## Postman Collection

A ready-to-import Postman collection is included in the repository:

`Collabzz.postman_collection.json`

## Run Checklist

- Add environment variables
- Ensure MongoDB is running locally or provide a MongoDB Atlas URI
- Run `npm install`
- Run `npm run dev`


