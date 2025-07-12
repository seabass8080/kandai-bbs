import prisma from "@/lib/prisma";
import CreatePostForm from "@/components/CreatePostForm";
import PostItem from "@/components/PostItem";

interface ThreadDetailPageProps {
  params: {
    threadId: string;
  };
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const thread = await prisma.thread.findUnique({
    where: {
      id: Number(params.threadId),
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          reactions: true,
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{thread.title}</h1>
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
