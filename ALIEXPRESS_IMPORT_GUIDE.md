# AliExpress Bulk Catalog Import Guide

## Overview
This guide explains how to bulk import product catalogs from AliExpress into your e-commerce platform. The system supports multiple import methods to accommodate different use cases and data sources.

## Import Methods

### 1. CSV Catalog Import
Import products using a structured CSV file with product data.

**Endpoint:** `POST /api/dropshipping/aliexpress/csv-import`

**Required Fields:**
- `productUrl` - AliExpress product URL
- `title` - Product title/name
- `price` - Product price

**Optional Fields:**
- `productId` - AliExpress product ID
- `description` - Product description
- `salePrice` - Discounted price
- `currency` - Price currency (default: USD)
- `images` - Comma-separated image URLs
- `category` - Product category
- `brand` - Product brand
- `sku` - Custom SKU
- `weight` - Product weight
- `dimensions` - Product dimensions
- `variants` - Product variants/specifications
- `freeShipping` - Free shipping flag (true/false)
- `shippingTime` - Estimated shipping time
- `shippingCost` - Shipping cost
- `supplierName` - Supplier/seller name
- `supplierRating` - Supplier rating
- `supplierCountry` - Supplier country
- `moq` - Minimum order quantity
- `stock` - Available stock

**Example CSV Data:**
```csv
productUrl,title,price,description,category,brand,images,freeShipping,shippingTime
https://www.aliexpress.com/item/1234567890.html,Wireless Bluetooth Headphones,25.99,High-quality wireless headphones,Electronics,TechBrand,https://example.com/img1.jpg,true,7-15 days
https://www.aliexpress.com/item/9876543210.html,Phone Case,12.50,Protective phone case,Accessories,PhoneBrand,https://example.com/img2.jpg,true,5-10 days
```

**Request Example:**
```json
{
  "csvData": [
    {
      "productUrl": "https://www.aliexpress.com/item/1234567890.html",
      "title": "Wireless Bluetooth Headphones",
      "price": "25.99",
      "description": "High-quality wireless headphones with noise cancellation",
      "category": "Electronics",
      "brand": "TechBrand",
      "images": "https://example.com/image1.jpg,https://example.com/image2.jpg",
      "freeShipping": "true",
      "shippingTime": "7-15 days"
    }
  ],
  "vendorId": "vendor_123",
  "importSettings": {
    "markupPercentage": 30,
    "autoPublish": false,
    "priceRounding": true,
    "skipDuplicates": true
  }
}
```

### 2. URL-Based Import
Import products directly from AliExpress product URLs.

**Endpoint:** `POST /api/dropshipping/aliexpress/url-import`

**Supported URL Formats:**
- `https://www.aliexpress.com/item/{productId}.html`
- `https://www.aliexpress.com/item/{productId}`
- `https://aliexpress.com/item/{productId}`
- `https://m.aliexpress.com/item/{productId}.html`

**Request Example:**
```json
{
  "productUrls": [
    "https://www.aliexpress.com/item/1234567890.html",
    "https://www.aliexpress.com/item/9876543210.html"
  ],
  "vendorId": "vendor_123",
  "importSettings": {
    "markupPercentage": 35,
    "autoPublish": false,
    "priceRounding": true
  }
}
```

### 3. Get Import Guide
Get detailed import templates and configuration options.

**Endpoint:** `GET /api/dropshipping/aliexpress/import-guide`

## Import Settings

### Pricing Configuration
- **markupPercentage** (0-200): Percentage markup to apply to original price
- **minPrice** (default: 1.00): Minimum allowed price
- **maxPrice** (default: 10000.00): Maximum allowed price
- **priceRounding** (default: true): Round prices to nearest cent

### Publishing Options
- **autoPublish** (default: false): Automatically publish imported products
- **skipDuplicates** (default: true): Skip products that already exist

### Category Mapping
```json
{
  "categoryMapping": {
    "Consumer Electronics": "Electronics",
    "Computer & Office": "Computers",
    "Home & Garden": "Home"
  }
}
```

## Implementation Examples

### Frontend JavaScript Example
```javascript
// CSV Import
async function importAliExpressCatalog(csvData, settings) {
  try {
    const response = await fetch('/api/dropshipping/aliexpress/csv-import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        csvData,
        vendorId: currentVendorId,
        importSettings: settings
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`Import completed: ${result.data.summary.successful} successful, ${result.data.summary.failed} failed`);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

// URL Import
async function importFromUrls(urls, settings) {
  try {
    const response = await fetch('/api/dropshipping/aliexpress/url-import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productUrls: urls,
        vendorId: currentVendorId,
        importSettings: settings
      })
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('URL import failed:', error);
    throw error;
  }
}

// Get Import Guide
async function getImportGuide() {
  try {
    const response = await fetch('/api/dropshipping/aliexpress/import-guide', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to get import guide:', error);
    throw error;
  }
}
```

### CSV File Processing Example
```javascript
// Parse CSV file for import
function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            data.push(row);
          }
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Usage
document.getElementById('csvFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const csvData = await parseCSVFile(file);
      const settings = {
        markupPercentage: 30,
        autoPublish: false,
        priceRounding: true,
        skipDuplicates: true
      };
      
      const result = await importAliExpressCatalog(csvData, settings);
      console.log('Import completed:', result);
    } catch (error) {
      console.error('Import failed:', error);
    }
  }
});
```

## Best Practices

### 1. Data Validation
- Always validate product URLs before import
- Check for required fields (title, price, productUrl)
- Verify image URLs are accessible
- Validate price formats and ranges

### 2. Pricing Strategy
- Use competitive markup percentages (20-50%)
- Set appropriate minimum and maximum prices
- Consider market research for pricing
- Factor in shipping costs and fees

### 3. Product Management
- Review imported products before publishing
- Check for trademark or copyright issues
- Verify product descriptions and specifications
- Update categories and tags as needed

### 4. Quality Control
- Monitor supplier ratings and feedback
- Check shipping times and reliability
- Verify product quality and customer reviews
- Maintain good supplier relationships

### 5. Performance Optimization
- Process imports in batches (max 100 products)
- Use background processing for large imports
- Implement retry mechanisms for failed imports
- Monitor import performance and success rates

## Error Handling

### Common Errors
- **Invalid URL format**: Check AliExpress URL structure
- **Missing required fields**: Ensure title, price, and productUrl are provided
- **Duplicate products**: Enable skipDuplicates to avoid conflicts
- **Invalid price**: Check price format and ranges
- **Network timeout**: Retry failed imports

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "originalData": { /* original product data */ },
  "url": "https://..." // for URL imports
}
```

## Limitations

- Maximum 100 products per import batch
- Import processing may take several minutes
- Some product data may require manual review
- Images must be publicly accessible URLs
- Rate limiting applies to prevent abuse

## Security Considerations

- All imports require vendor or admin authentication
- Input validation and sanitization applied
- Rate limiting to prevent abuse
- Audit logging for all import activities
- Secure handling of external URLs and data

## API Rate Limits

- **CSV Import**: 5 requests per minute
- **URL Import**: 10 requests per minute  
- **Import Guide**: 20 requests per minute

## Support

For technical support or questions about the import functionality:
1. Check the import guide endpoint for latest documentation
2. Review error messages and logs
3. Contact technical support with import batch IDs
4. Provide sample data for troubleshooting

---

*Last Updated: January 21, 2025*
*Version: 1.0.0*
