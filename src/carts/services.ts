export const assignCartTotalAmountInfo = (cart: {
  totalAmount?: number;
  cartProducts: { totalAmount?: number; quantity: number; product: { price: number } }[];
}) => {
  cart.totalAmount = cart.cartProducts.reduce((sum, cp) => {
    cp.totalAmount = cp.quantity * cp.product.price;
    return sum + cp.totalAmount;
  }, 0);
};
