import Link from "next/link";
import prisma from "@/lib/prisma";

interface BoardSectionProps {
  boardId: number;
  boardName: string;
}

// コンポーネントをasyncにして、自身でデータを取得できるようにする
export default async function BoardSection({ boardId, boardName }: BoardSectionProps) {
  // このコンポーネントが必要とするスレッド情報を自分で取得する
  const threads = await prisma.thread.findMany({
    where: { boardId: boardId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-4 mb-4">{boardName}</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-200">
          {threads.map((thread) => (
            <li key={thread.id} className="py-3 flex justify-between items-center">
              <Link href={`/thread/${thread.id}`} className="text-blue-700 hover:underline hover:text-blue-900 transition-colors text-lg">
                {thread.title}
              </Link>
              <span className="text-sm text-gray-500">レス: {thread._count.posts}</span>
            </li>
          ))}
          {threads.length === 0 && <p className="text-gray-400 py-2">この板にはまだスレッドがありません。</p>}
        </ul>
      </div>
    </section>
  );
}
