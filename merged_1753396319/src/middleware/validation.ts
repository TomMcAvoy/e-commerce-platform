import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const { body, param, query, validationResult, check } = require('express-validator');

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => error.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

// Custom validators
const isStrongPassword = (password: any): boolean => {
  // At least 6 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const isValidSlug = (slug: any): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
};

export const validateRegister = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  check('password')
    .custom((value: any) => {
      if (!isStrongPassword(value)) {
        throw new Error('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    }),
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  check('role')
    .optional()
    .isIn(['customer', 'vendor', 'admin'])
    .withMessage('Role must be customer, vendor, or admin'),
  handleValidationErrors
];

export const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateForgotPassword = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  handleValidationErrors
];

export const validateResetPassword = [
  param('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  check('password')
    .custom((value: any) => {
      if (!isStrongPassword(value)) {
        throw new Error('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    }),
  handleValidationErrors
];

// Product validation rules
export const validateCreateProduct = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name must be less than 200 characters'),
  check('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  check('category')
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  check('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ max: 50 })
    .withMessage('SKU must be less than 50 characters'),
  handleValidationErrors
];

export const validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ObjectId'),
  check('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Product name must be less than 200 characters'),
  check('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  check('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  check('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  handleValidationErrors
];

export const validateCreateCategory = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name must be less than 100 characters'),
  check('slug')
    .trim()
    .notEmpty()
    .withMessage('Category slug is required')
    .isLength({ max: 100 })
    .withMessage('Category slug must be less than 100 characters')
    .custom((value: any) => {
      if (!isValidSlug(value)) {
        throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
      }
      return true;
    }),
  check('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  check('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid ID'),
  handleValidationErrors
];

export const validateUpdateCategory = [
  param('id')
    .isMongoId()
    .withMessage('Category ID must be a valid MongoDB ObjectId'),
  check('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category name must be less than 100 characters'),
  check('slug')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category slug cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category slug must be less than 100 characters')
    .custom((value: any) => {
      if (!isValidSlug(value)) {
        throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
      }
      return true;
    }),
  handleValidationErrors
];

// Cart validation rules
export const validateAddToCart = [
  check('productId')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ObjectId'),
  check('variantId')
    .optional()
    .isMongoId()
    .withMessage('Variant ID must be a valid MongoDB ObjectId'),
  check('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  handleValidationErrors
];

export const validateUpdateCartItem = [
  param('itemId')
    .isMongoId()
    .withMessage('Cart item ID must be a valid MongoDB ObjectId'),
  check('quantity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Quantity must be between 0 and 100'),
  handleValidationErrors
];

// Order validation rules
export const validateCreateOrder = [
  check('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  check('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('Shipping first name is required'),
  check('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Shipping last name is required'),
  check('shippingAddress.address1')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  check('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Shipping city is required'),
  check('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Shipping state is required'),
  check('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Shipping postal code is required'),
  check('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Shipping country is required'),
  check('billingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('Billing first name is required'),
  check('billingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Billing last name is required'),
  check('billingAddress.address1')
    .trim()
    .notEmpty()
    .withMessage('Billing address is required'),
  check('billingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Billing city is required'),
  check('billingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Billing state is required'),
  check('billingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Billing postal code is required'),
  check('billingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Billing country is required'),
  handleValidationErrors
];

// Vendor validation rules
export const validateVendorRegister = [
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  check('password')
    .custom((value: any) => {
      if (!isStrongPassword(value)) {
        throw new Error('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    }),
  check('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  check('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ max: 200 })
    .withMessage('Business name must be less than 200 characters'),
  check('businessAddress')
    .trim()
    .notEmpty()
    .withMessage('Business address is required')
    .isLength({ max: 500 })
    .withMessage('Business address must be less than 500 characters'),
  check('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  check('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State must be less than 100 characters'),
  check('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
  check('zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required')
    .isLength({ max: 20 })
    .withMessage('ZIP code must be less than 20 characters'),
  check('taxId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tax ID must be less than 50 characters'),
  handleValidationErrors
];

// Common validations
export const validateMongoId = (paramName: string = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Dropshipping validation rules
export const validateDropshippingImport = [
  check('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required'),
  check('provider')
    .isIn(['printful', 'spocket', 'aliexpress', 'modalyst'])
    .withMessage('Provider must be one of: printful, spocket, aliexpress, modalyst'),
  handleValidationErrors
];

export const validateBulkImport = [
  check('searchQuery')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ max: 100 })
    .withMessage('Search query must be less than 100 characters'),
  check('provider')
    .isIn(['printful', 'spocket', 'aliexpress', 'modalyst'])
    .withMessage('Provider must be one of: printful, spocket, aliexpress, modalyst'),
  check('maxProducts')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max products must be between 1 and 100'),
  handleValidationErrors
];
