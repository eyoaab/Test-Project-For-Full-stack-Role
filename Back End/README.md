# CRM Backend

A Node.js/TypeScript backend for managing entries with role-based permissions. Users can create and track their own entries, while managers can review and approve them.

## What's Inside

This is a typical Express + TypeScript + MongoDB setup with JWT auth. The main idea is simple: regular users submit entries (think expense reports, requests, etc.), and managers can view and approve/reject them.

**Tech:**
- Express with TypeScript
- MongoDB (Mongoose)
- JWT authentication (bcrypt for passwords)
- Swagger docs at `/api-docs`
- Basic security stuff (helmet, cors, rate limiting)

## How It's Organized

Standard MVC pattern with a services layer:

```
src/
├── models/         User and Entry schemas
├── controllers/    Route handlers
├── services/       Business logic
├── middlewares/    Auth, validation, error handling
├── routes/         API endpoints
├── config/         Database and env setup
├── utils/          Helper functions
└── app.ts          Express setup
```

## Setup

You'll need Node.js 18+ and MongoDB running somewhere.

```bash
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB connection string and a strong JWT secret:

```env
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=pick-something-random-and-long
PORT=3000
```

Create your first manager account (you need at least one):

```bash
npm run seed:manager
```

This creates `admin@example.com` / `admin123` by default. Change these credentials in `.env` if you want.

Start the server:

```bash
npm run dev
```

Visit `http://localhost:3000/api-docs` to see all endpoints and try them out.

## How to Use

### Register and Login

Anyone can register as a regular user:

```bash
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123"
}
```

Only managers can create other managers:

```bash
POST /api/v1/auth/register/manager
Authorization: Bearer <manager-token>
{
  "email": "newmanager@example.com",
  "password": "password123"
}
```

Login works the same for everyone:

```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

You get back a JWT token. Include it in requests: `Authorization: Bearer <token>`

### Working with Entries

**As a user:**
- Create entries: `POST /api/v1/entries`
- View your entries: `GET /api/v1/entries/my`

**As a manager:**
- View all entries: `GET /api/v1/entries`
- Filter by status: `GET /api/v1/entries?status=pending`
- Approve/reject: `PATCH /api/v1/entries/:id/status`

Entries have a `status` field that starts as `pending`. Managers can change it to `approved` or `rejected`.

## Data Models

**User:**
```typescript
{
  email: string
  password: string  // hashed with bcrypt
  role: 'user' | 'manager'
}
```

**Entry:**
```typescript
{
  title: string
  description: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'  // defaults to pending
  createdBy: ObjectId  // reference to User
}
```

## Security Notes

Passwords are hashed with bcrypt before storage. JWTs expire after 24 hours.

There's rate limiting in place:
- 100 requests per 15 minutes (general)
- 5 login attempts per 15 minutes (authentication)

All requests are validated. If you send bad data, you'll get a 400 with details about what's wrong.

## Development

Run `npm run dev` for development with auto-reload.

Build for production: `npm run build` then `npm start`

Lint: `npm run lint`

## Common Issues

**"Failed to connect to MongoDB"**  
Check that MongoDB is running and your `MONGO_URI` is correct.

**"Invalid or expired token"**  
Your JWT expired (24 hours) or is malformed. Login again.

**Rate limit errors**  
You're making too many requests. Wait 15 minutes or adjust the rate limits in `src/middlewares/rateLimiter.middleware.ts`.

## Environment Variables

Required:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A long random string for signing tokens

Optional:
- `PORT` - Defaults to 3000
- `NODE_ENV` - Set to `production` when deploying
- `FIRST_MANAGER_EMAIL` / `FIRST_MANAGER_PASSWORD` - For the seed script

## Project Notes

The codebase follows a standard MVC pattern with a services layer to keep business logic separate from route handlers. TypeScript is configured with strict mode.

Error responses are centralized and follow a consistent format. In development mode, you get stack traces. In production, errors are sanitized.

There's a health check at `/health` if you need it for monitoring.

Check `API_EXAMPLES.md` for curl examples and `MANAGER_SETUP.md` for details on the manager registration flow.
