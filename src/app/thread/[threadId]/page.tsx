import prisma from "@/lib/prisma";
import { createPost } from "@/app/actions";

// ページのpropsの型を定義
interface ThreadDetailPageProps {
  params: {
    threadId: string;
  };
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  // URLから取得したthreadIdを使って、該当するスレッドをDBから取得
  // postsも一緒に取得する
  const thread = await prisma.thread.findUnique({
    where: {
      id: Number(params.threadId),
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "asc", // 投稿は古い順に表示
        },
      },
    },
  });

  // スレッドが見つからない場合はエラー表示
  if (!thread) {
    return <div>スレッドが見つかりません</div>;
  }

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      {/* スレッドタイトル */}
      <header className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">{thread.title}</h1>
      </header>

      {/* レス一覧 */}
      <div className="space-y-4">
        {thread.posts.map((post, index) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-baseline mb-2 text-sm text-gray-500">
              {/* レス番号 */}
              <span className="font-bold mr-2">{index + 1}:</span>
              {/* 投稿日時 */}
              <span>投稿日時: {new Date(post.createdAt).toLocaleString("ja-JP")}</span>
            </div>
            {/* 投稿内容 */}
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
      </div>

      {/* ▼▼▼ ここからレス投稿フォームを追加 ▼▼▼ */}
      <section className="mt-8 pt-6 border-t border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800">レスを投稿する</h2>
        <form action={createPost}>
          {/* どのスレッドへの投稿かを示すために、見えない形でthreadIdを送る */}
          <input type="hidden" name="threadId" value={thread.id} />

          <div className="mb-4">
            <textarea name="content" rows={5} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required placeholder="投稿内容を入力"></textarea>
          </div>

          <div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
              投稿する
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
