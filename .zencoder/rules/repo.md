---
description: Repository Information Overview
alwaysApply: true
---

# E-Commerce Platform Information

## Summary
A modern, full-stack e-commerce platform built with TypeScript, featuring multi-vendor marketplace capabilities and dropshipping integration. Similar to platforms like Temu and Amazon, designed for selling clothes, apparel, and makeup.

## Structure
- **src/**: Backend source code (Express.js, TypeScript)
  - controllers/, models/, routes/, middleware/, services/, types/, utils/
- **frontend/**: Next.js frontend application
  - app/, components/, lib/, types/
- **uploads/**: File upload directory
- **dist/**: Compiled TypeScript output
- **tests/**: Test files (unit, integration, e2e)

## Language & Runtime
**Language**: TypeScript
**Version**: ES2020 target
**Backend Framework**: Express.js
**Frontend Framework**: Next.js 15
**Build System**: TypeScript Compiler (tsc)
**Package Manager**: npm

## Dependencies

### Backend Dependencies
**Main Dependencies**:
- express: ^4.19.2 - Web framework
- mongoose: ^8.5.1 - MongoDB ODM
- jsonwebtoken: ^9.0.2 - Authentication
- bcryptjs: ^2.4.3 - Password hashing
- node-cron: ^3.0.3 - Task scheduling
- axios: ^1.11.0 - HTTP client

**Development Dependencies**:
- typescript: ^5.5.3
- ts-node: ^10.9.2
- nodemon: ^3.1.4
- jest: ^30.0.0 (implied from @types/jest)
- mongodb-memory-server: ^10.1.4

### Frontend Dependencies
**Main Dependencies**:
- next: ^14.2.5
- react: ^18.3.1
- react-dom: ^18.3.1
- @stripe/react-stripe-js: ^3.8.0
- tailwind-merge: ^3.3.1
- @radix-ui components

**Development Dependencies**:
- tailwindcss: ^3.4.0
- postcss: ^8.5.6
- autoprefixer: ^10.4.21

## Build & Installation
```bash
# Clone the repository
git clone <repository-url>
cd shoppingcart

# Quick setup (installs dependencies, creates .env, builds project)
npm run setup

# Or manual setup
npm install
cd frontend && npm install
cp .env.example .env
npm run build

# Start development servers
npm run dev:all  # Both frontend and backend
npm run dev:server  # Backend only
npm run dev:frontend  # Frontend only

# Build for production
npm run build
npm start
```

## Testing
**Framework**: Jest with ts-jest
**Test Location**: src/__tests__/, tests/
**Naming Convention**: *.test.ts, *.spec.ts
**Configuration**: jest.config.ts, jest.setup.ts
**Run Command**:
```bash
npm test  # Run all tests
npm run test:api  # API endpoint tests
```

## Environment Configuration
**Main Variables**:
- PORT=3000
- NODE_ENV=development
- MONGODB_URI=mongodb://localhost:27017/shoppingcart
- REDIS_URL=redis://localhost:6379
- JWT_SECRET, JWT_EXPIRES_IN
- STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
- FRONTEND_URL=http://localhost:3001