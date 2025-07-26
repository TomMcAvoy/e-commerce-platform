-e 
import eventService, { EventNames } from "../services/eventService";
import { IProduct } from "../models/Product";
import { IUser } from "../models/User";

class SearchSubscriber {
  constructor() {
    this.registerListeners();
  }

  private registerListeners() {
    eventService.on(EventNames.PRODUCT_CREATED, this.onProductCreated);
    eventService.on(EventNames.PRODUCT_UPDATED, this.onProductUpdated);
    eventService.on(EventNames.PRODUCT_DELETED, this.onProductDeleted);
    eventService.on(EventNames.USER_CREATED, this.onUserCreated);
  }

  // Example handler for when a product is created
  public onProductCreated(product: IProduct) {
    console.log(`[EVENT] Product Created: ${product.name}. Indexing for search...`);
    // In a real app, you would call your search engine service here
    // e.g., searchService.indexProduct(product);
  }

  public onProductUpdated(product: IProduct) {
    console.log(`[EVENT] Product Updated: ${product.name}. Re-indexing for search...`);
  }

  public onProductDeleted(product: IProduct) {
    console.log(`[EVENT] Product Deleted: ${product.name}. Removing from search index...`);
  }
  
  public onUserCreated(user: IUser) {
    console.log(`[EVENT] User Created: ${user.email}. Sending welcome email...`);
    // e.g., emailService.sendWelcomeEmail(user);
  }
}

// Initialize the subscriber to start listening for events
export default new SearchSubscriber();

