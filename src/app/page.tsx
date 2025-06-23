import prisma from "@/lib/prisma";
import Link from "next/link";

// 60秒ごとにページのキャッシュを更新する設定
export const revalidate = 60;

export default async function Home() {
  // DBからカテゴリ(Board)とそれに紐づくスレッド(Thread)を取得
  const boards = await prisma.board.findMany({
    orderBy: {
      createdAt: "asc", // カテゴリは作成順で表示
    },
    include: {
      threads: {
        orderBy: {
          createdAt: "desc", // スレッドは新しい順で表示
        },
        take: 5, // 各カテゴリの最新5件のスレッドのみ表示
        include: {
          _count: {
            // 各スレッドの投稿数をカウント
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

      {/* ここに新規スレッド作成フォームを後で追加します */}

      <div className="space-y-8">
        {boards.map((board) => (
          <section key={board.id}>
            <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-4 mb-4">{board.name}</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {board.threads.map((thread) => (
                  <li key={thread.id} className="py-3 flex justify-between items-center">
                    <Link href={`/thread/${thread.id}`} className="text-blue-700 hover:underline hover:text-blue-900 transition-colors text-lg">
                      {thread.title}
                    </Link>
                    <span className="text-sm text-gray-500">レス: {thread._count.posts}</span>
                  </li>
                ))}
                {board.threads.length === 0 && <p className="text-gray-400 py-2">この板にはまだスレッドがありません。</p>}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
