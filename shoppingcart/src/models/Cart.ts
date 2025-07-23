interface ICart {
    _id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        name: string;
        sku: string;
    }>;
}

class Cart implements ICart {
    _id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        name: string;
        sku: string;
    }>;

    constructor(userId: string) {
        this._id = this.generateId();
        this.userId = userId;
        this.items = [];
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    addItem(productId: string, quantity: number, price: number, name: string, sku: string) {
        this.items.push({ productId, quantity, price, name, sku });
    }

    removeItem(productId: string) {
        this.items = this.items.filter(item => item.productId !== productId);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}