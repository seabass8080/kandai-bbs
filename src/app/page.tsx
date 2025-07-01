import prisma from "@/lib/prisma";
import BoardSection from "@/components/BoardSection";
import CreateThreadForm from "@/components/CreateThreadForm";

export const revalidate = 60;

export default async function Home() {
  const boards = await prisma.board.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Kandai-BBS</h1>
        <p className="text-gray-600 mt-1">関西大学匿名掲示板</p>
      </header>

      <CreateThreadForm boards={boards} />

      <div className="space-y-8">
        {boards.map((board) => (
          <BoardSection key={board.id} boardId={board.id} boardName={board.name} />
        ))}
      </div>
    </main>
  );
}
