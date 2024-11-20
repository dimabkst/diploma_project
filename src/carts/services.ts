export function assignCartTotalAmountInfo<
  T extends {
    totalAmount?: number;
    cartProducts: { totalAmount?: number; quantity: number; product: { price: number } }[];
  },
>(cart: T): asserts cart is T & { totalAmount: number; cartProducts: { totalAmount: number }[] } {
  cart.totalAmount = cart.cartProducts.reduce((sum, cp) => {
    cp.totalAmount = cp.quantity * cp.product.price;
    return sum + cp.totalAmount;
  }, 0);
}
