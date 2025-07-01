"use client";

import { createThread } from "@/app/actions";

interface CreateThreadFormProps {
  boards: {
    id: number;
    name: string;
  }[];
}

export default function CreateThreadForm({ boards }: CreateThreadFormProps) {
  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">新しいスレッドを作成する</h2>
      <form action={createThread}>
        <div className="mb-4">
          <label htmlFor="boardId" className="block text-gray-700 font-semibold mb-2">
            カテゴリ（板）
          </label>
          <select id="boardId" name="boardId" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
            スレッドタイトル
          </label>
          <input type="text" id="title" name="title" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required maxLength={100} />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
            最初の投稿
          </label>
          <textarea id="content" name="content" rows={5} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" required></textarea>
        </div>

        <div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
            作成する
          </button>
        </div>
      </form>
    </section>
  );
}
