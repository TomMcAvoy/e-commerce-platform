interface IProduct {
    _id: string;
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    variants: any[];
    category: string;
}