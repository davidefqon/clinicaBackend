import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear algunos roles si no existen
  const roleAdmin = await prisma.roles.upsert({
    where: { n_rol: 'Admin' },
    update: {},
    create: {
      n_rol: 'Admin',
      abrev: 'ADM',
    },
  });

  const roleUser = await prisma.roles.upsert({
    where: { n_rol: 'User' },
    update: {},
    create: {
      n_rol: 'User',
      abrev: 'USR',
    },
  });

  // 2. Crear algunos permisos si no existen
  const permisoRead = await prisma.permisos.upsert({
    where: { n_per: 'Read' },
    update: {},
    create: {
      n_per: 'Read',
      abrev: 'RD',
    },
  });

  const permisoWrite = await prisma.permisos.upsert({
    where: { n_per: 'Write' },
    update: {},
    create: {
      n_per: 'Write',
      abrev: 'WR',
    },
  });

  // 3. Relacionar los permisos con los roles en la tabla De_permiso
  await prisma.de_permiso.createMany({
    data: [
      { id_rol: roleAdmin.id_rol, id_per: permisoRead.id_per, estado: true },
      { id_rol: roleAdmin.id_rol, id_per: permisoWrite.id_per, estado: true },
      { id_rol: roleUser.id_rol, id_per: permisoRead.id_per, estado: true },
    ],
    skipDuplicates: true, // Omitir duplicados en caso de que ya existan
  });

  // 4. Crear una subunidad si no existe
  const subUnidad1 = await prisma.sub_unidad.upsert({
    where: { n_subUni: 'Sub Unidad 1' },
    update: {},
    create: {
      n_subUni: 'Sub Unidad 1',
      abrev: 'SU1',
    },
  });

  // 5. Crear un usuario asignado a un rol y una subunidad
  const hashedPassword = await prisma.$executeRawUnsafe(
    `SELECT crypt('password123', gen_salt('bf'))`
  ); // Asegúrate de usar bcrypt en la vida real

  const user = await prisma.usuario.upsert({
    where: { dni: '12345678' }, // Clave única por dni
    update: {},
    create: {
      dni: '12345678',
      n_usu: 'Usuario Admin',
      estado: true,
      password: hashedPassword, // Guardar el password hasheado
      rol_id: roleAdmin.id_rol,
      id_sub: subUnidad1.id_subUni,
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
