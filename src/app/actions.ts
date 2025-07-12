"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// createThread関数
export async function createThread(prevState: any, formData: FormData): Promise<{ message: string; success: boolean; newThreadId?: number }> {
  const boardId = Number(formData.get("boardId"));
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!boardId || !title || !content) {
    return { message: "すべての項目を入力してください。", success: false };
  }

  try {
    const newThread = await prisma.$transaction(async (tx) => {
      const thread = await tx.thread.create({
        data: {
          title: title,
          boardId: boardId,
        },
      });
      await tx.post.create({
        data: {
          threadId: thread.id,
          content: content,
        },
      });
      return thread;
    });

    revalidatePath("/");
    return {
      message: "スレッドを作成しました！",
      success: true,
      newThreadId: newThread.id,
    };
  } catch (e) {
    console.error(e);
    return { message: "スレッドの作成に失敗しました。", success: false };
  }
}

// createPost関数
export async function createPost(prevState: any, formData: FormData): Promise<{ message: string; success: boolean }> {
  const content = formData.get("content") as string;
  const threadId = Number(formData.get("threadId"));

  if (!content || !threadId) {
    return { message: "入力内容が正しくありません。", success: false };
  }
  if (content.trim().length === 0) {
    return { message: "投稿内容を入力してください。", success: false };
  }

  try {
    await prisma.post.create({
      data: {
        content: content,
        threadId: threadId,
      },
    });

    revalidatePath(`/thread/${threadId}`);
    return { message: "レスを投稿しました！", success: true };
  } catch (e) {
    console.error(e);
    return { message: "投稿に失敗しました。", success: false };
  }
}

// addReaction関数
export async function addReaction(formData: FormData) {
  const postId = Number(formData.get("postId"));
  const threadId = Number(formData.get("threadId"));
  const reactionType = formData.get("reactionType") as string;

  if (!postId || !threadId || !reactionType) {
    return;
  }

  await prisma.reaction.create({
    data: {
      type: reactionType,
      postId: postId,
    },
  });

  revalidatePath(`/thread/${threadId}`);
}
