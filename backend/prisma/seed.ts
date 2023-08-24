import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const existingPreference = await prisma.preference.findUnique({
      where: { userId: user.id },
    });

    if (!existingPreference) {
      await prisma.preference.create({
        data: {
          userId: user.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
