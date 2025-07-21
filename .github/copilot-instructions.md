# Copilot Instructions for E-Commerce Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern e-commerce platform built with TypeScript, featuring:
- **Backend**: Node.js with Express, MongoDB, Redis
- **Frontend**: Next.js with React and Tailwind CSS
- **Features**: Multi-vendor marketplace, dropshipping integration, authentication

## Technology Stack
- **Backend**: TypeScript, Node.js, Express.js, MongoDB (Mongoose), Redis, JWT authentication
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Payment**: Stripe integration
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Express validation middleware

## Architecture Patterns
- **MVC Pattern**: Models, Controllers, Routes separation
- **Middleware**: Authentication, error handling, rate limiting
- **Services**: Business logic separation
- **Types**: Comprehensive TypeScript interfaces

## Key Features to Implement
1. **User Management**: Registration, login, profiles, roles (customer, vendor, admin)
2. **Product Management**: CRUD operations, categories, variants, inventory
3. **Vendor System**: Multi-vendor marketplace with vendor dashboards
4. **Shopping Cart**: Session-based and user-based carts
5. **Order Management**: Order processing, tracking, fulfillment
6. **Payment Processing**: Stripe integration for secure payments
7. **Dropshipping**: Integration with suppliers (AliExpress, Spocket, Printful)
8. **Search & Filtering**: Advanced product search and filtering
9. **Reviews & Ratings**: Product reviews and vendor ratings
10. **Admin Dashboard**: Platform management and analytics

## Code Style Guidelines
- Use TypeScript for all new files
- Follow RESTful API conventions
- Implement proper error handling with custom error classes
- Use async/await instead of promises
- Implement input validation for all endpoints
- Use proper HTTP status codes
- Follow the established folder structure

## Database Models
- User (customers, vendors, admins)
- Product (with variants, inventory, SEO)
- Category (hierarchical categories)
- Order (with vendor order separation)
- Cart (session and user-based)
- Vendor (business information, verification)
- Review (product reviews and ratings)

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
