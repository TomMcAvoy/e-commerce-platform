class DropshippingService {
	static instance;

	static getInstance() {
		if (!this.instance) {
			this.instance = new DropshippingService();
		}
		return this.instance;
	}

	// Other methods for DropshippingService
}

export { DropshippingService };