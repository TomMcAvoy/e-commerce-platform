import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { tenantResolver } from './middleware/tenantResolver';

// Import routes statically for reliability
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import vendorRoutes from './routes/vendorRoutes';
import dropshippingRoutes from './routes/dropshippingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoutes from './routes/webhookRoutes';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- CORE MIDDLEWARE ---
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- MULTI-TENANCY MIDDLEWARE ---
app.use(tenantResolver);

// --- API ROUTES ---
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/dropshipping', dropshippingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// --- ERROR HANDLING ---
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

