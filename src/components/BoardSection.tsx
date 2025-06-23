import Link from "next/link";
import { Prisma } from "@/generated/prisma"; // Prismaが生成した型をインポート

// Boardとそれに紐づくThreadの情報を含む型を定義
type BoardWithThreads = Prisma.BoardGetPayload<{
  include: {
    threads: {
      include: {
        _count: {
          select: { posts: true };
        };
      };
    };
  };
}>;

// コンポーネントが受け取るpropsの型を定義
interface BoardSectionProps {
  board: BoardWithThreads;
}

export default function BoardSection({ board }: BoardSectionProps) {
  return (
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
  );
}
