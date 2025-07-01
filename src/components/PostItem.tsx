"use client";

import { useState } from "react";
import { addReaction } from "@/app/actions";

// 型定義は変更なし
interface PostItemProps {
  post: {
    id: number;
    content: string;
    createdAt: Date;
    threadId: number;
    reactions: {
      type: string;
    }[];
  };
  index: number;
}

const availableReactions = ["👍", "😂", "😮", "🤔"];

export default function PostItem({ post, index }: PostItemProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const reactionCounts = post.reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ▼▼▼ 新しいフォーム送信ハンドラを作成 ▼▼▼
  const handleFormAction = async (formData: FormData) => {
    // まずサーバーアクションを呼び出してDBを更新
    await addReaction(formData);
    // 処理が終わったら、ピッカーを閉じる
    setIsPickerOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-baseline mb-2 text-sm text-gray-500">
        <span className="font-bold mr-2">{index + 1}:</span>
        <span>投稿日時: {new Date(post.createdAt).toLocaleString("ja-JP")}</span>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>

      <div className="flex items-center space-x-2 relative">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <div key={emoji} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
            <span>{emoji}</span>
            <span className="ml-1">{count}</span>
          </div>
        ))}

        <button onClick={() => setIsPickerOpen(!isPickerOpen)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-1 rounded-full text-sm leading-none" aria-label="リアクションを追加">
          ＋👍
        </button>

        {isPickerOpen && (
          <div className="absolute bottom-10 left-0 flex items-center space-x-1 bg-white border border-gray-300 rounded-full shadow-lg p-1">
            {availableReactions.map((emoji) => (
              // ▼▼▼ actionに新しいハンドラを渡す ▼▼▼
              <form action={handleFormAction} key={emoji}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="threadId" value={post.threadId} />
                <input type="hidden" name="reactionType" value={emoji} />
                <button
                  type="submit"
                  className="hover:bg-gray-200 text-gray-800 font-bold p-1 rounded-full text-xl flex items-center"
                  // ここからonClickを削除！
                >
                  {emoji}
                </button>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
