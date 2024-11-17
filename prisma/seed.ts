import prisma from '../src/db';
import { UserRole, OrderStatus } from '../src/db/types';
import logger from '../src/utils/logger';

// To seed in development run: npx prisma db seed
async function main() {
  await Promise.all([
    ...Object.keys(UserRole).map((role) => prisma.userRole.upsert({ where: { role }, update: {}, create: { role } })),
    ...Object.keys(OrderStatus).map((status) => prisma.orderStatus.upsert({ where: { status }, update: {}, create: { status } })),
  ]);

  logger.info(`Seeded ${Object.keys(UserRole).length} user roles`);
  logger.info(`Seeded ${Object.keys(OrderStatus).length} order statuses`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
