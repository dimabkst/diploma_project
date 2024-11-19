import { Prisma } from '@prisma/client';

export const cartView = {
  cartProducts: {
    select: {
      id: true,
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  },
} satisfies Prisma.CartSelect;
