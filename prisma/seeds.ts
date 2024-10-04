import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const permisoRead = await prisma.permisos.upsert({
    where: { n_per: 'Read' },
    update: {},
    create: {
      n_per: 'Read',
      abrev: 'RD',
    },
  });

  console.log('Datos iniciales insertados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
