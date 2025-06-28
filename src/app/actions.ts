"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// フォームから渡されたデータを使って新しいスレッドを作成する非同期関数
export async function createThread(formData: FormData) {
  // フォームから各データを取得
  const boardId = Number(formData.get("boardId"));
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // 簡単なバリデーション
  if (!boardId || !title || !content) {
    return;
  }

  // データベースへの書き込み処理
  // スレッド作成と最初の投稿は一連の処理なので、トランザクションを使う
  const newThread = await prisma.$transaction(async (tx) => {
    // 1. まずスレッドを作成する
    const thread = await tx.thread.create({
      data: {
        title: title,
        boardId: boardId,
      },
    });

    // 2. 次に、そのスレッドの最初の投稿を作成する
    await tx.post.create({
      data: {
        threadId: thread.id,
        content: content,
      },
    });

    return thread;
  });

  // キャッシュをクリアして、トップページを再表示した時に新しいスレッドが反映されるようにする
  revalidatePath("/");

  // 新しく作成したスレッドの詳細ページにリダイレクトする
  redirect(`/thread/${newThread.id}`);
}

// 新しいレス（投稿）を作成する関数
export async function createPost(formData: FormData) {
  // フォームから必要なデータを取得
  const content = formData.get("content") as string;
  const threadId = Number(formData.get("threadId"));

  // 簡単なバリデーション
  if (!content || !threadId) {
    return;
  }

  // データベースに新しいPostを作成
  await prisma.post.create({
    data: {
      content: content,
      threadId: threadId,
    },
  });

  // 該当スレッドページのキャッシュをクリアして、新しい投稿が即時反映されるようにする
  revalidatePath(`/thread/${threadId}`);
}
