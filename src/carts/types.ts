export interface IAddProductsPayload {
  productId: number;
  quantity?: number;
}

export interface IRemoveCartProductsPayload {
  cartProductIds?: number[];
  productIds?: number[];
  removeAll?: boolean;
}

export interface IEditCartProductsPayload {
  cartProductId: number;
  quantity: number;
}
