class DropshippingService {
    static instance: DropshippingService;

    static getInstance(): DropshippingService {
        if (!DropshippingService.instance) {
            DropshippingService.instance = new DropshippingService();
        }
        return DropshippingService.instance;
    }

    // Other methods and properties of the DropshippingService class
}

export default DropshippingService;