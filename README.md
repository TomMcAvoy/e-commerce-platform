# E-Commerce Platform with Dropshipping Integration

A modern, full-stack e-commerce platform built with TypeScript, featuring multi-vendor marketplace capabilities and dropshipping integration. Similar to platforms like Temu and Amazon, designed for selling clothes, apparel, and makeup.

## 🚀 Features

### Core Features
- **Multi-Vendor Marketplace**: Support for multiple vendors with separate storefronts
- **Dropshipping Integration**: Connect with suppliers like AliExpress, Spocket, and Printful
- **Product Management**: Comprehensive product catalog with variants, inventory tracking
- **User Management**: Customer accounts, vendor dashboards, admin panel
- **Shopping Cart**: Session-based and persistent user carts
- **Order Management**: Complete order lifecycle from placement to fulfillment
- **Payment Processing**: Secure payments via Stripe
- **Search & Filtering**: Advanced product search with filters
- **Reviews & Ratings**: Product reviews and vendor ratings system

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication with role-based access
- **Database**: MongoDB with Redis for caching and sessions
- **File Upload**: Image upload and management
- **Email Integration**: Automated emails for orders, notifications
- **Rate Limiting**: API protection against abuse
- **Security**: Comprehensive security measures

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **Authentication**: JWT
- **Payment**: Stripe
- **Email**: Nodemailer
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
├── src/                    # Backend source code
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   └── index.ts          # Server entry point
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js 15 app directory
│   ├── components/       # React components
│   ├── lib/             # Frontend utilities
│   └── types/           # Frontend types
├── uploads/              # File upload directory
└── dist/                # Compiled TypeScript output
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- Redis
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoppingcart
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/shoppingcart
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   # ... other environment variables
   ```

4. **Start MongoDB and Redis**
   ```bash
   # MongoDB
   mongod
   
   # Redis
   redis-server
   ```

5. **Run the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev:all
   ```
   
   **Backend only:**
   ```bash
   npm run dev:server
   ```
   
   **Frontend only:**
   ```bash
   npm run dev:frontend
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Vendor/Admin)
- `PUT /api/products/:id` - Update product (Vendor/Admin)
- `DELETE /api/products/:id` - Delete product (Vendor/Admin)
- `GET /api/products/search` - Search products

### Additional Endpoints
- Cart management (`/api/cart`)
- Order management (`/api/orders`)
- User management (`/api/users`)
- Vendor operations (`/api/vendors`)
- Category management (`/api/categories`)
- Dropshipping integration (`/api/dropshipping`)

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication with role-based access control:

- **Customer**: Can browse, purchase, review products
- **Vendor**: Can manage their products, view orders, analytics
- **Admin**: Full platform access, user management, system settings
- **Moderator**: Content moderation, user support

## 🛒 E-commerce Features

### Product Management
- Product variants (size, color, etc.)
- Inventory tracking
- SEO optimization
- Image management
- Category organization

### Order Processing
- Shopping cart management
- Checkout process
- Payment processing
- Order tracking
- Vendor order separation

### Dropshipping Integration
- Supplier management
- Product import from suppliers
- Automated order fulfillment
- Inventory synchronization

## 🎨 Frontend Features

- Responsive design with Tailwind CSS
- Modern React components
- Server-side rendering with Next.js
- Optimized images and performance
- Progressive Web App capabilities

## 🔧 Development

### Available Scripts
- `npm run dev:server` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits

## 🌐 Deployment

### Environment Setup
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Set up Redis Cloud or self-hosted Redis
3. Configure Stripe for payments
4. Set up SMTP for emails
5. Configure dropshipping API keys

### Production Deployment
The application can be deployed on:
- **Backend**: Vercel, Railway, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud, AWS ElastiCache

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Happy Shopping! 🛍️**
