/**
 * Cart type definitions following copilot TypeScript patterns
 */
export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  image?: string;
  vendorId?: string;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  total: number;
  updatedAt: Date;
  createdAt?: Date;
}

export interface ICartResponse {
  success: boolean;
  data: ICart;
  message?: string;
}
