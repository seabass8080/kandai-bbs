import prisma from "@/lib/prisma";
import BoardSection from "@/components/BoardSection";
import { createThread } from "./actions";

export const revalidate = 60;

export default async function Home() {
  const boards = await prisma.board.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      threads: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          _count: {
            select: { posts: true },
          },
        },
      },
    },
  });

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Kandai-BBS</h1>
        <p className="text-gray-600 mt-1">関西大学匿名掲示板</p>
      </header>

      <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">新しいスレッドを作成する</h2>
        <form action={createThread}>
          <div className="mb-4">
            <label htmlFor="boardId" className="block text-gray-700 font-semibold mb-2">
              カテゴリ（板）
            </label>
            <select id="boardId" name="boardId" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              スレッドタイトル
            </label>
            <input type="text" id="title" name="title" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required maxLength={100} />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
              最初の投稿
            </label>
            <textarea id="content" name="content" rows={5} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required></textarea>
          </div>

          <div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
              作成する
            </button>
          </div>
        </form>
      </section>

      <div className="space-y-8">
        {boards.map((board) => (
          <BoardSection key={board.id} board={board} />
        ))}
      </div>
    </main>
  );
}
