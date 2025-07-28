# Project Reorganization Plan

This document outlines a comprehensive plan to reorganize the e-commerce platform codebase according to industry best practices, ensuring consistency and eliminating redundancy between frontend and backend components.

## Current Issues Identified

1. **Inconsistent File Naming**: Mix of camelCase, PascalCase, and kebab-case across the project
2. **Duplicate Route Files**: Multiple files with similar functionality (e.g., `auth.ts` and `authRoutes.ts`)
3. **Inconsistent Directory Structure**: Lack of standardized organization for components and modules
4. **Type Duplication**: Redundant type definitions between frontend and backend
5. **Multiple Testing Approaches**: Scattered test files with inconsistent patterns
6. **Redundant Utility Functions**: Similar utility functions implemented in multiple places
7. **Inconsistent Error Handling**: Multiple approaches to error handling
8. **Scattered Configuration**: Configuration spread across multiple files

## Reorganization Principles

1. **Domain-Driven Design**: Organize code by business domain rather than technical function
2. **Consistent Naming Conventions**: Standardize on PascalCase for components, camelCase for functions/variables
3. **Shared Types**: Create a shared types directory for both frontend and backend
4. **Monorepo Structure**: Organize as a proper monorepo with clear separation of concerns
5. **Feature-Based Organization**: Group related files by feature rather than technical type
6. **Consistent API Patterns**: Standardize API request/response patterns
7. **Centralized Configuration**: Consolidate configuration in a single location
8. **Automated Testing**: Standardize testing approach with clear patterns

## New Project Structure

```
/shoppingcart
├── .github/                      # GitHub configuration
├── .vscode/                      # VS Code configuration
├── packages/                     # Monorepo packages
│   ├── api/                      # Backend API
│   │   ├── src/
│   │   │   ├── config/           # Configuration
│   │   │   ├── features/         # Feature modules
│   │   │   │   ├── auth/         # Authentication feature
│   │   │   │   │   ├── controllers/  # Controllers
│   │   │   │   │   ├── models/       # Data models
│   │   │   │   │   ├── routes/       # Route definitions
│   │   │   │   │   ├── services/     # Business logic
│   │   │   │   │   ├── validators/   # Input validation
│   │   │   │   │   └── index.ts      # Feature entry point
│   │   │   │   ├── products/     # Products feature
│   │   │   │   ├── categories/   # Categories feature
│   │   │   │   ├── cart/         # Cart feature
│   │   │   │   ├── orders/       # Orders feature
│   │   │   │   ├── users/        # Users feature
│   │   │   │   ├── vendors/      # Vendors feature
│   │   │   │   ├── news/         # News feature
│   │   │   │   └── ...           # Other features
│   │   │   ├── middleware/       # Shared middleware
│   │   │   ├── utils/            # Utility functions
│   │   │   ├── app.ts            # Express application
│   │   │   └── index.ts          # Entry point
│   │   ├── tests/                # Tests
│   │   │   ├── unit/             # Unit tests
│   │   │   ├── integration/      # Integration tests
│   │   │   └── e2e/              # End-to-end tests
│   │   ├── package.json          # Package configuration
│   │   └── tsconfig.json         # TypeScript configuration
│   ├── web/                      # Frontend application
│   │   ├── src/
│   │   │   ├── app/              # Next.js app directory
│   │   │   ├── components/       # React components
│   │   │   │   ├── ui/           # UI components
│   │   │   │   ├── layout/       # Layout components
│   │   │   │   └── features/     # Feature-specific components
│   │   │   │       ├── auth/     # Authentication components
│   │   │   │       ├── products/ # Product components
│   │   │   │       └── ...       # Other feature components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utility functions
│   │   │   ├── services/         # API service clients
│   │   │   └── context/          # React context providers
│   │   ├── public/               # Static assets
│   │   ├── tests/                # Tests
│   │   ├── package.json          # Package configuration
│   │   └── tsconfig.json         # TypeScript configuration
│   └── shared/                   # Shared code
│       ├── src/
│       │   ├── types/            # Shared type definitions
│       │   │   ├── models/       # Data model types
│       │   │   ├── api/          # API request/response types
│       │   │   └── index.ts      # Type exports
│       │   ├── constants/        # Shared constants
│       │   ├── utils/            # Shared utility functions
│       │   └── validation/       # Shared validation schemas
│       ├── package.json          # Package configuration
│       └── tsconfig.json         # TypeScript configuration
├── scripts/                      # Development and build scripts
├── docs/                         # Documentation
├── package.json                  # Root package configuration
└── README.md                     # Project documentation
```

## Implementation Steps

### 1. Create Monorepo Structure

1. Set up workspace configuration in root `package.json`
2. Create package directories: `api`, `web`, and `shared`
3. Configure TypeScript for each package
4. Set up dependencies between packages

### 2. Migrate Shared Types

1. Identify common types used in both frontend and backend
2. Move these to the `shared/src/types` directory
3. Update imports in both frontend and backend

### 3. Reorganize Backend (API)

1. Create feature-based directory structure
2. Move controllers, models, routes, and services to their respective feature directories
3. Standardize file naming and exports
4. Implement consistent error handling
5. Update imports and references

### 4. Reorganize Frontend (Web)

1. Organize components by feature and type
2. Create consistent API service clients
3. Implement proper state management
4. Standardize styling approach
5. Update imports and references

### 5. Standardize Testing

1. Create consistent test directory structure
2. Implement standardized testing patterns
3. Set up test utilities and fixtures
4. Configure CI/CD for testing

### 6. Update Build and Deployment

1. Configure build scripts for the monorepo
2. Set up development environment
3. Configure production builds
4. Update deployment scripts

## Specific Changes for Slug Consistency

### Backend (API)

1. Ensure all models with slug fields have:
   - Proper field definition: `slug: { type: String, required: true, unique: true, trim: true, lowercase: true }`
   - Compound index with tenant: `ModelSchema.index({ slug: 1, tenantId: 1 }, { unique: true })`
   - Pre-save hook for slug generation and uniqueness

2. Standardize slug-based route handlers:
   ```typescript
   // In features/[feature]/routes/[feature]Routes.ts
   router.get('/slug/:slug', getBySlug);
   ```

3. Implement consistent controller methods:
   ```typescript
   // In features/[feature]/controllers/[feature]Controller.ts
   export const getBySlug = asyncHandler(async (req, res, next) => {
     const item = await Model.findOne({ 
       slug: req.params.slug,
       tenantId: req.tenantId
     });
     
     if (!item) {
       return next(new AppError(`Item not found with slug ${req.params.slug}`, 404));
     }
     
     res.status(200).json({ success: true, data: item });
   });
   ```

### Frontend (Web)

1. Create consistent API service methods:
   ```typescript
   // In services/api/[feature].ts
   export const getBySlug = async (slug: string): Promise<T | null> => {
     try {
       const data = await apiClient(`/${feature}/slug/${slug}`);
       return data.data;
     } catch (error) {
       return null;
     }
   };
   ```

2. Implement consistent page routing:
   ```typescript
   // In app/[feature]/[slug]/page.tsx
   export default async function FeatureDetailPage({ params }: { params: { slug: string } }) {
     const item = await getBySlug(params.slug);
     
     if (!item) {
       notFound();
     }
     
     return <FeatureDetail item={item} />;
   }
   ```

## Benefits of Reorganization

1. **Improved Developer Experience**: Consistent patterns make the codebase easier to navigate
2. **Reduced Redundancy**: Shared code eliminates duplication
3. **Better Maintainability**: Feature-based organization makes changes more localized
4. **Enhanced Scalability**: Clear separation of concerns allows for better scaling
5. **Easier Onboarding**: Standardized patterns reduce learning curve for new developers
6. **Improved Performance**: Optimized imports and shared code reduce bundle size
7. **Better Testing**: Consistent testing patterns improve coverage and reliability

## Migration Strategy

To minimize disruption, we recommend implementing this reorganization in phases:

1. **Phase 1**: Set up monorepo structure and shared types
2. **Phase 2**: Reorganize backend API
3. **Phase 3**: Reorganize frontend application
4. **Phase 4**: Standardize testing
5. **Phase 5**: Update build and deployment

Each phase should include comprehensive testing to ensure functionality is preserved.