import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.reaction.deleteMany();
  await prisma.post.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.board.deleteMany();

  // Board（板）を作成
  const board1 = await prisma.board.create({
    data: { name: "授業・楽単情報" },
  });
  const board2 = await prisma.board.create({
    data: { name: "サークル・部活" },
  });
  const board3 = await prisma.board.create({
    data: { name: "雑談" },
  });

  console.log(`Created boards`);

  // Thread（スレッド）を作成
  const thread1 = await prisma.thread.create({
    data: {
      title: "2025年度春の楽単、教えてください",
      boardId: board1.id,
    },
  });
  const thread2 = await prisma.thread.create({
    data: {
      title: "〇〇先生のWebデザイン論の過去問求む",
      boardId: board1.id,
    },
  });
  const thread3 = await prisma.thread.create({
    data: {
      title: "新入生歓迎！おすすめの部活",
      boardId: board2.id,
    },
  });

  console.log(`Created threads`);

  // Post（投稿）を作成
  await prisma.post.createMany({
    data: [
      { content: "初投稿です。よろしくお願いします。", threadId: thread1.id },
      { content: "△△先生のマーケティング論はガチ", threadId: thread1.id },
      { content: "それは去年まで。今年から鬼単になったらしいよ", threadId: thread1.id },
      { content: "2023年のものなら持ってます！", threadId: thread2.id },
      { content: "新歓、めっちゃ楽しかったです！", threadId: thread3.id },
    ],
  });

  console.log(`Created posts`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
