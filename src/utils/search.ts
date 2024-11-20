import { Prisma } from '@prisma/client';

const searchPayload = (search: string) => {
  const searchObject: Prisma.StringFilter = {
    contains: search.trim(),
    mode: 'insensitive',
  };

  return searchObject;
};

export default searchPayload;
