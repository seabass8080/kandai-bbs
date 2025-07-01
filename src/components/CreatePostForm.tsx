"use client";

import { createPost } from "@/app/actions";

interface CreatePostFormProps {
  threadId: number;
}

export default function CreatePostForm({ threadId }: CreatePostFormProps) {
  return (
    <section className="mt-8 pt-6 border-t border-gray-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800">レスを投稿する</h2>
      <form action={createPost}>
        <input type="hidden" name="threadId" value={threadId} />
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
  );
}
