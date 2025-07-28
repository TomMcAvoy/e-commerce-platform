// This file is now redundant as the interface is defined in types.ts.
// To maintain a clean architecture, this file will re-export the type from types.ts.
import { IDropshippingProvider as IProvider } from './types';

// Re-exporting the main interface for components that use this file as an entry point.
export type IDropshippingProvider = IProvider;
