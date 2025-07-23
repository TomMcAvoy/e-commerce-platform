import { IUserDocument } from '../../models/User';
import { IProductDocument } from '../../models/Product';

export function getUserId(user: IUserDocument): string {
  return user._id.toString();
}

export function getProductId(product: IProductDocument): string {
  return product._id.toString();
}

export function getUserObjectId(user: IUserDocument) {
  return user._id;
}

export function getProductObjectId(product: IProductDocument) {
  return product._id;
}
