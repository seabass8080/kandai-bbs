import prisma from "@/lib/prisma";
import CreatePostForm from "@/components/CreatePostForm";
import PostItem from "@/components/PostItem";

export default async function ThreadDetailPage({ params }: { params: { threadId: string } }) {
  const threadIdString = params.threadId;

  const threadId = Number(threadIdString);

  if (isNaN(threadId)) {
    return <div>無効なスレッドIDが指定されました。</div>;
  }

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          reactions: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

  if (!thread) {
    return <div>スレッドが見つかりません</div>;
  }

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <header className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">{thread.title}</h1>
      </header>

      <div className="space-y-4">
        {thread.posts.map((post, index) => (
          <PostItem key={post.id} post={post} index={index} />
        ))}
      </div>

      <CreatePostForm threadId={thread.id} />
    </main>
  );
}
