import prisma from '../src/db';
import logger from '../src/utils/logger';

// To seed in development run: npx prisma db seed
async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
