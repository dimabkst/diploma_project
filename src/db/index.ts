import { PrismaClient } from '@prisma/client';
import { ITransacting } from './types';
import { HttpError } from '../utils/error';
import logger from '../utils/logger';

let prisma: PrismaClient;

if (process.env.NODE_ENV !== 'development') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ['query'] });
  }

  prisma = global.prisma;
}

export const transacting: ITransacting = async (prisma: PrismaClient, data: any, options?: any) => {
  let result;

  try {
    result = await prisma.$transaction(data, options?.transactionOptions);
  } catch (e) {
    if (e instanceof HttpError) throw e;

    logger.error('Transaction error:');
    logger.error(e);

    if (options?.meta) {
      logger.error('Transaction meta:');
      logger.error(options?.meta);
    }

    throw e;
  }

  return result;
};

export default prisma;
