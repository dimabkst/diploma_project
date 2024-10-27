import { Prisma } from '@prisma/client';

const searchPayload = (search: string) => {
  const searchObject: Prisma.StringFilter = {
    contains: search.trim(),
  };

  return searchObject;
};

export default searchPayload;
