import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.reaction.deleteMany();
  await prisma.post.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.board.deleteMany();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
