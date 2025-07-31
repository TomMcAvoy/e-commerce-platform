
import express from 'express';
const router = express.Router();

try {
  const socialRoutes = require('./socialRoutes');
  console.log('Social routes loaded:', typeof socialRoutes);
  console.log('Default export:', typeof socialRoutes.default);
} catch (error) {
  console.log('Error loading social routes:', error.message);
  console.log('Error code:', error.code);
}
