import BoardSection from "./BoardSection";

interface BoardListProps {
  boards: {
    id: number;
    name: string;
  }[];
}

export default function BoardList({ boards }: BoardListProps) {
  return (
    <div className="space-y-8 md:col-span-2">
      {boards.map((board) => (
        <BoardSection key={board.id} boardId={board.id} boardName={board.name} />
      ))}
    </div>
  );
}
