import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Vendor E-Commerce API',
      version,
      description: 'API documentation for the multi-vendor e-commerce platform, built with Node.js, Express, and MongoDB. This documentation is generated automatically from the source code.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/thomasmcavoy/shoppingcart',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer {token}',
        },
      },
    },
  },
  // Path to the API docs. The JSDoc comments in these files will be parsed.
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);