import prisma from '../src/db';
import { UserRole } from '../src/db/types';
import logger from '../src/utils/logger';

async function main() {
  await Promise.all(
    Object.keys(UserRole).map((role) => prisma.userRole.upsert({ where: { role }, update: {}, create: { role } }))
  );

  logger.info(`Seeded ${Object.keys(UserRole).length} user roles`);
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
