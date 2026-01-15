# Restaurant Inventory Management System - Backend

A production-ready NestJS backend for restaurant inventory management with complete authentication, validation, error handling, logging, database migrations, seeding, API documentation, and security features.

## Features

### ✅ Core Features (1-4)
- **Environment Configuration** - Centralized config with database and JWT management
- **Validation Decorators** - Comprehensive input validation with password strength requirements
- **Error Handling** - Global exception filters with structured error responses
- **Authentication & Authorization** - JWT-based auth with bcrypt password hashing

### ✅ Production Features (5-10)
- **Database Migrations** - TypeORM migrations for schema versioning and deployment
- **Seeding** - Automatic demo data for testing and development
- **Swagger Documentation** - Interactive API docs at `/api/docs`
- **Logging** - Request and error logging with interceptors
- **Unit & Integration Tests** - Jest test suites for services and controllers
- **Rate Limiting & Security** - Helmet protection, CORS, rate limiting, input sanitization

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
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
JWT_SECRET=your_jwt_secret_min_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Run database migrations**
```bash
npm run migration:run
```

5. **Start the development server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3002`

## API Documentation

Access the interactive Swagger documentation at: `http://localhost:3001/api/docs`

### Authentication Endpoints
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Login and get JWT token

### Items Endpoints
- `GET /api/items` - Get all inventory items
- `POST /api/items` - Add new item (requires JWT)
- `GET /api/items/:id` - Get item details
- `PATCH /api/items/:id` - Update item (requires JWT)
- `DELETE /api/items/:id` - Delete item (requires JWT)
- `GET /api/items/low-stock` - Get items below reorder level
- `GET /api/items/expiring` - Get items expiring soon

### Locations Endpoints
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Add new location (requires JWT)
- `GET /api/locations/:id` - Get location details
- `PATCH /api/locations/:id` - Update location (requires JWT)
- `DELETE /api/locations/:id` - Delete location (requires JWT)
- `GET /api/locations/:id/stats` - Get location statistics

### Alerts Endpoints
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert (requires JWT)
- `PATCH /api/alerts/:id` - Resolve alert (requires JWT)
- `GET /api/alerts/critical` - Get critical alerts

## Demo Credentials

The database is automatically seeded with demo data:

**Admin Account:**
- Email: `admin@restaurant.com`
- Password: `Admin@123456`

**Demo Data:**
- 3 restaurant locations
- Multiple inventory items with various categories
- Sample alerts for low stock and expiring items

## Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build for production
npm start                  # Run production build

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Testing
npm test                   # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Lint and fix code
npm run format            # Format code with Prettier
```

## Project Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── exceptions/          # Custom exception classes
│   │   ├── filters/             # Global exception filters
│   │   ├── interceptors/        # Logging and other interceptors
│   │   ├── middleware/          # Rate limiting middleware
│   │   └── pipes/               # Custom validation pipes
│   ├── config/
│   │   ├── database.config.ts   # Database configuration
│   │   ├── jwt.config.ts        # JWT configuration
│   │   └── typeorm.config.ts    # TypeORM configuration
│   ├── database/
│   │   ├── migrations/          # TypeORM migrations
│   │   └── seeds/               # Database seeding
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   ├── items/               # Items management module
│   │   ├── locations/           # Locations management module
│   │   └── alerts/              # Alerts management module
│   ├── app.module.ts            # Main application module
│   └── main.ts                  # Application entry point
├── test/                         # E2E tests
├── .env.example                  # Environment variables template
├── ormconfig.json                # TypeORM configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies

## Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Authentication:** Secure token-based auth with configurable expiration
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable allowed origins
- **Input Validation:** Whitelist and transform all inputs
- **Helmet:** Sets security HTTP headers
- **SQL Injection Prevention:** Parameterized TypeORM queries
- **Environment Variables:** Secrets stored in .env, not in code

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR, hashed)
- name (VARCHAR)
- created_at, updated_at (Timestamps)

### Locations Table
- id (UUID, Primary Key)
- name (VARCHAR)
- address (VARCHAR)
- staff_count (INT)
- status (ENUM: active, inactive, maintenance)
- created_at, updated_at (Timestamps)

### Items Table
- id (UUID, Primary Key)
- name (VARCHAR)
- sku (VARCHAR, Unique)
- quantity (DECIMAL)
- unit (VARCHAR)
- supplier (VARCHAR)
- cost (DECIMAL)
- selling_price (DECIMAL)
- reorder_level (DECIMAL)
- expiry_date (TIMESTAMP)
- category (VARCHAR)
- location_id (UUID, Foreign Key)
- created_at, updated_at (Timestamps)

### Alerts Table
- id (UUID, Primary Key)
- title (VARCHAR)
- message (TEXT)
- type (ENUM: warning, critical, info, expiry)
- severity (ENUM: low, medium, high, critical)
- resolved (BOOLEAN)
- item_id (UUID, Foreign Key, nullable)
- created_at, updated_at (Timestamps)

## Deployment

### Deploy to Production

1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
```bash
NODE_ENV=production
JWT_SECRET=<your-secure-jwt-secret>
DB_HOST=<your-production-db-host>
DB_PASSWORD=<your-production-db-password>
```

3. **Run migrations in production**
```bash
npm run migration:run
```

4. **Start the application**
```bash
npm start
```

### Recommended Deployment Platforms
- Render
- Railway
- Heroku
- AWS EC2
- DigitalOcean

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DB credentials in .env
- Check if database exists: `createdb restaurant_inventory`

### JWT Secret Not Set
- Make sure JWT_SECRET is at least 32 characters
- Never commit JWT_SECRET to version control

### Port Already in Use
- Change PORT in .env to an available port
- Or kill the process: `lsof -i :3002` then `kill -9 <PID>`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit and push
6. Create a pull request

## License

UNLICENSED

## Support

For issues or questions, please open an issue in the repository.
```

```typescript file="" isHidden
