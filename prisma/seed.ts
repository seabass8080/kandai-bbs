import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.reaction.deleteMany();
  await prisma.post.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.board.deleteMany();

  await prisma.board.create({
    data: { name: "授業・楽単情報" },
  });
  await prisma.board.create({
    data: { name: "サークル・部活" },
  });
  await prisma.board.create({
    data: { name: "雑談" },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
