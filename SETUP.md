# Backend Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=restaurant_inventory
JWT_SECRET=your_secure_jwt_secret_min_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
PORT=3002
```

### 4. Database Setup

```bash
# Run migrations
npm run migration:run

# Database will be automatically seeded with demo data on first run
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3002`
Swagger docs: `http://localhost:3002/api/docs`

## Demo Credentials

After seeding:
- **Email:** admin@restaurant.com
- **Password:** Admin@123456

## Testing the API

1. Open Swagger UI at `http://localhost:3002/api/docs`
2. Click "Authorize" and use the demo credentials
3. Try the endpoints with pre-populated demo data

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | PostgreSQL server hostname | localhost |
| DB_PORT | PostgreSQL server port | 5432 |
| DB_USERNAME | PostgreSQL username | postgres |
| DB_PASSWORD | PostgreSQL password | yourpassword |
| DB_NAME | Database name | restaurant_inventory |
| JWT_SECRET | Secret for signing JWTs (min 32 chars) | your_secret_key_min_32_characters |
| NODE_ENV | Environment (development/production) | development |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| PORT | API server port | 3001 |

## Common Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Building
npm run build              # Build for production
npm start                  # Run production build

# Database
npm run migration:generate # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# Testing
npm test                   # Run tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report

# Code Quality
npm run lint              # Lint code
npm run format            # Format with Prettier
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set production environment variables in `.env`

3. Run migrations:
```bash
npm run migration:run
```

4. Start the application:
```bash
npm start
```

## Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Create database: `createdb restaurant_inventory`

### Port Already in Use
- Change PORT in `.env` to an available port
- Or kill the process: `lsof -i :3002` then `kill -9 <PID>`

### JWT Errors
- Ensure JWT_SECRET is at least 32 characters
- Check that the secret doesn't contain special characters that need escaping

### Seeding Errors
- Run migrations first: `npm run migration:run`
- Check database connection in `.env`
