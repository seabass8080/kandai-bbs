import prisma from "@/lib/prisma";
import CreateThreadForm from "@/components/CreateThreadForm";
import BoardList from "@/components/BoardList";

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

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <div className="md:col-span-1 mb-8 md:mb-0">
          <CreateThreadForm boards={boards} />
        </div>

        <BoardList boards={boards} />
      </div>
    </main>
  );
}
