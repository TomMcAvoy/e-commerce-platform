# Copilot Instructions for E-Commerce Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Multi-vendor e-commerce platform with dropshipping integration, similar to Amazon/Temu. Built with TypeScript full-stack architecture featuring separate backend API server and Next.js frontend.

## Critical Development Workflows

### Server Management (Essential Commands)
```bash
# Quick start for new developers
npm run setup                    # One-time setup: installs deps, creates .env, builds
npm run dev:all                  # Start both servers (backend:3000, frontend:3001)

# Individual server control
npm run dev:server               # Backend only (port 3000)
npm run dev:frontend             # Frontend only (port 3001)

# Emergency stop (when Ctrl+C doesn't work)
npm run stop                     # Graceful shutdown
npm run kill                     # Force kill all processes on ports 3000-3001
```

### Debugging & Testing Ecosystem
- **Primary Debug Dashboard**: `http://localhost:3001/debug` (Next.js route with API testing)
- **Static Debug Page**: `http://localhost:3001/debug-api.html` (pure HTML/JS for CORS testing)
- **API Health Endpoints**: `http://localhost:3000/health` & `http://localhost:3000/api/status`
- **Test Commands**: `npm test` (comprehensive), `npm run test:api` (quick validation)

## Architecture Patterns

### Backend Structure (src/)
- **Controllers**: Handle HTTP requests, use `sendTokenResponse()` pattern for auth
- **Services**: Business logic separation (see `DropshippingService` class pattern)
- **Middleware**: Chain pattern with custom `AppError` class for error handling
- **Models**: Mongoose schemas with virtual fields and performance indexes
- **Routes**: Express routers grouped by feature (`/api/auth`, `/api/products`, etc.)

### Frontend Structure (frontend/)
- **App Router**: Next.js 15 app directory with server components by default
- **Context Pattern**: `CartProvider` wraps entire app for state management
- **API Integration**: Centralized in `lib/api.ts` with `API_BASE_URL` configuration
- **Component Organization**: UI components in `/components`, pages in `/app`

### Cross-Service Communication
- **Frontend → Backend**: Direct HTTP calls via `fetch()` to `http://localhost:3000/api/*`
- **CORS Configuration**: Allows `http://localhost:3001` origin for development
- **Environment Variables**: Backend uses `.env`, frontend uses `NEXT_PUBLIC_*` prefix

## Project-Specific Conventions

### Error Handling Pattern
```typescript
// Backend: Custom AppError class with HTTP status codes
throw new AppError('Not authorized, no token', 401);

// Frontend: Standardized API response structure
const response = await fetch(url);
const data = await response.json();
if (!response.ok) throw new Error(data.message);
```

### Authentication Flow
- JWT tokens stored in HTTP-only cookies via `sendTokenResponse()`
- Protected routes use `protect` middleware checking `Bearer` tokens
- Frontend auth state managed in components, not global state

### Database Patterns
- All models use timestamps and indexes for performance
- Compound indexes on frequently queried fields (vendor + category)
- Virtual fields for calculated properties (discount percentages)

### Development vs Production
- Development: Separate servers, CORS enabled, extensive logging
- Uses `concurrently` package to run multiple dev servers
- Database seeding available via `npm run seed`

## Critical Integration Points

### Dropshipping Service Architecture
- Provider pattern with `IDropshippingProvider` interface
- Supports multiple suppliers (Printful, Spocket) with unified API
- Environment-based provider initialization in constructor

### File Upload System
- Multer middleware for handling multipart forms
- Uploads stored in `/uploads` directory (not in version control)
- Image processing should reference existing patterns

### Testing Infrastructure
- Comprehensive test scripts with health checks and CORS validation
- Uses curl, Newman (Postman), Artillery (load testing) when available
- Browser automation with Playwright for E2E testing
- Test reports generated in JSON format with timestamps

## Key Files That Define Patterns
- `src/index.ts`: Server initialization and middleware setup
- `src/controllers/authController.ts`: Authentication patterns
- `src/services/dropshipping/DropshippingService.ts`: Service layer architecture
- `frontend/lib/api.ts`: Frontend API integration patterns
- `frontend/app/layout.tsx`: Global layout and context setup

## Environment & Configuration
- Backend `.env` variables: `MONGODB_URI`, `JWT_SECRET`, `REDIS_URL`, provider API keys
- Frontend environment: `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
- CORS configured for local development (`localhost:3001` → `localhost:3000`)
- Rate limiting and security headers configured via Helmet

## API Endpoints Structure
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/users/*` - User management
- `/api/vendors/*` - Vendor operations
- `/api/orders/*` - Order management
- `/api/cart/*` - Shopping cart operations
- `/api/categories/*` - Category management
- `/api/dropshipping/*` - Dropshipping integration

## Security Considerations
- JWT token authentication
- Rate limiting
- Input sanitization
- CORS configuration
- Helmet.js for security headers
- Password hashing with bcryptjs

## Environment Variables
Always use environment variables for:
- Database connections
- JWT secrets
- API keys (payment, email, dropshipping)
- File upload configurations
- Rate limiting settings
