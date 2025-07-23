interface DropshipProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    variants: any[];
    category: string;
    provider: string;
}

interface DropshipOrderItem {
    productId: string;
    quantity: number;
    name: string;
}