// src/components/CreateThreadForm.tsx
"use client";

import { createThread } from "@/app/actions";
import { useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Board {
  id: number;
  name: string;
}

// initialState の newThreadId の型を number | undefined に戻す
const initialState = {
  message: "",
  success: false,
  newThreadId: undefined as number | undefined, // ここを修正：string を削除
};

// createThread サーバーアクションの戻り値の型を再利用するための型エイリアス
type CreateThreadResult = Awaited<ReturnType<typeof createThread>>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400">
      {pending ? "作成中..." : "作成する"}
    </button>
  );
}

interface CreateThreadFormProps {
  boards: Board[];
}

export default function CreateThreadForm({ boards }: CreateThreadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, setState] = useState<CreateThreadResult>(initialState);

  const formAction = async (formData: FormData) => {
    setState({ ...initialState, message: "作成中...", success: false });
    const result = await createThread(formData);
    setState(result);
  };

  useEffect(() => {
    if (state.success && state.newThreadId) {
      toast.success(state.message);
      formRef.current?.reset();
      setTimeout(() => {
        router.push(`/thread/${state.newThreadId}`);
      }, 1500);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">新しいスレッドを作成する</h2>
      <form ref={formRef} action={formAction}>
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
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
