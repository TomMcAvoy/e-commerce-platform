import express from 'express';
import countryFeaturesController from '../controllers/countryFeaturesController';

const router = express.Router();

// Get all available countries with features
router.route('/countries')
  .get(countryFeaturesController.getAvailableCountries);

// Get country-specific featured products
router.route('/:country/products')
  .get(countryFeaturesController.getCountryFeaturedProducts);

// Get country-specific vacation vendor
router.route('/:country/vacation')
  .get(countryFeaturesController.getCountryVacationVendor);

export default router;