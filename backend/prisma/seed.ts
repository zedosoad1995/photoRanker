import { PrismaClient } from "@prisma/client";
import { calculateAge } from "@shared/helpers/date";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.dateOfBirth) continue;

    const age = calculateAge(user.dateOfBirth);

    console.log(age);

    await prisma.picture.updateMany({
      data: {
        age,
      },
      where: {
        userId: user.id,
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
