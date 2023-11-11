import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const pics = await prisma.picture.findMany();

  for (const pic of pics) {
    await prisma.picture.update({
      data: {
        freeRating: pic.rating
      },
      where: {
        id: pic.id
      }
    })
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
