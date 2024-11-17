export const assignCartTotalAmountInfo = (cart: {
  totalAmount?: number;
  cartProducts: { quantity: number; product: { price: number } }[];
}) => {
  cart.totalAmount = cart.cartProducts.reduce((sum, c) => sum + c.quantity * c.product.price, 0);
};
