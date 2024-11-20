import * as runtime from '@prisma/client/runtime/library';
import { Prisma, PrismaClient } from '@prisma/client';

export interface ITransacting {
  <R, U extends object>(
    prisma: PrismaClient,
    callback: (prisma: Prisma.TransactionClient) => Promise<R>,
    options?: {
      transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
      };
      meta?: U;
    }
  ): Promise<R>;

  <P extends Prisma.PrismaPromise<any>[], U extends object>(
    prisma: PrismaClient,
    queries: [...P],
    options?: {
      transactionOptions?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
      };
      meta?: U;
    }
  ): Promise<runtime.Types.Utils.UnwrapTuple<P>>;
}
