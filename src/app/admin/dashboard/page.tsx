import { checkAdminAuth, logoutAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { deleteThread, deletePost } from "@/app/actions";

export default async function AdminDashboardPage() {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    redirect("/admin");
  }

  const boards = await prisma.board.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      threads: {
        orderBy: { createdAt: "desc" },
        include: {
          posts: {
            orderBy: { createdAt: "asc" },
            include: {
              reactions: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">管理者ダッシュボード</h1>
        <form action={logoutAdmin}>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            ログアウト
          </button>
        </form>
      </header>

      <div className="space-y-8">
        {boards.map((board) => (
          <section key={board.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-4 mb-4">
              板: {board.name} ({board.id})
            </h2>
            {board.threads.length === 0 ? (
              <p className="text-gray-400">この板にはまだスレッドがありません。</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {board.threads.map((thread) => (
                  <li key={thread.id} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-medium text-blue-700">
                        スレッド: {thread.title} ({thread.id})
                      </h3>
                      <form action={deleteThread}>
                        <input type="hidden" name="threadId" value={thread.id} />
                        <button type="submit" className="bg-red-400 hover:bg-red-500 text-white text-sm py-1 px-3 rounded">
                          スレッド削除
                        </button>
                      </form>
                    </div>
                    {thread.posts.length === 0 ? (
                      <p className="text-gray-400 pl-4">このスレッドにはまだ投稿がありません。</p>
                    ) : (
                      <ul className="pl-4 mt-2 space-y-3">
                        {thread.posts.map((post) => (
                          <li key={post.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                            <div className="text-gray-700 text-sm">
                              {post.content.substring(0, 50)}... ({post.id})
                              <div className="text-xs text-gray-500 mt-1">
                                投稿日時: {new Date(post.createdAt).toLocaleString()} | リアクション: {post.reactions.length}
                              </div>
                            </div>
                            <form action={deletePost}>
                              <input type="hidden" name="postId" value={post.id} />
                              <button type="submit" className="bg-red-300 hover:bg-red-400 text-white text-xs py-1 px-2 rounded">
                                レス削除
                              </button>
                            </form>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
