# Collabzz Team Task Manager API



## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT-based authentication
- Protected task routes
- Create, read, update, and delete tasks
- Only task creators can update or delete their tasks
- Task status validation: `todo`, `in-progress`, `done`
- Optional status filtering on `GET /tasks`
- Bonus: pagination and title search

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- cookie-parser

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

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/collabzz
JWT_SECRET=your_secret_key
```

3. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:8000`

## Authentication

`POST /auth/register` and `POST /auth/login` return a JWT token in the response.

Protected task routes accept either:

- `Authorization: Bearer <token>`
- or the `token` cookie automatically set on login/register

## Routes

### Auth

`POST /auth/register`

Sample body:

```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com",
  "password": "password123"
}
```

`POST /auth/login`

Sample body:

```json
{
  "email": "saurabh@example.com",
  "password": "password123"
}
```

### Tasks

`POST /tasks`

Sample body:

```json
{
  "title": "Build API",
  "description": "Complete internship assignment",
  "status": "todo",
  "assignedTo": "OPTIONAL_USER_ID"
}
```

Notes:

- `createdBy` is set automatically from the logged-in user
- `assignedTo` is optional

`GET /tasks`

Optional query params:

- `status=todo`
- `search=api`
- `page=1`
- `limit=10`

`GET /tasks/:id`

`PUT /tasks/:id`

Sample body:

```json
{
  "title": "Build final API",
  "description": "Polish documentation",
  "status": "in-progress"
}
```

`DELETE /tasks/:id`

## Business Rules

- Passwords are hashed before storing
- All task routes are protected
- Status only allows `todo`, `in-progress`, `done`
- Only the creator can update or delete a task

## Postman Collection

The repo includes:

`Collabzz.postman_collection.json`

## Run Checklist

- Add `.env`
- Run MongoDB
- Run `npm install`
- Run `npm run dev`
