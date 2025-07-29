export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isPrimary: boolean;
}

export interface IPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

interface IDropshippingProvider {
    isEnabled: boolean;
    getProducts(query: any): Promise<any[]>;
    getProduct(productId: string): Promise<any>;
}