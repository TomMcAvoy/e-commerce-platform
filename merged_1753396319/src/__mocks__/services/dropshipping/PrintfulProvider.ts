class DropshippingService {
    static instance;

    static getInstance() {
        if (!this.instance) {
            this.instance = new DropshippingService();
        }
        return this.instance;
    }

    // Other methods of the DropshippingService class
}

export { DropshippingService };