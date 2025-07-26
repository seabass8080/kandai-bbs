"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logoutAdmin, checkAdminAuth } from "@/lib/auth";

export async function createThread(formData: FormData): Promise<{ message: string; success: boolean; newThreadId?: number }> {
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

export async function createPost(formData: FormData): Promise<{ message: string; success: boolean }> {
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

export async function logout() {
  await logoutAdmin();
}

export async function deleteThread(formData: FormData) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    console.error("Unauthorized attempt to delete thread.");
    return { message: "認証されていません。", success: false };
  }

  const threadId = Number(formData.get("threadId"));

  if (isNaN(threadId)) {
    return { message: "無効なスレッドIDです。", success: false };
  }

  try {
    await prisma.reaction.deleteMany({
      where: {
        post: {
          threadId: threadId,
        },
      },
    });
    await prisma.post.deleteMany({
      where: {
        threadId: threadId,
      },
    });
    await prisma.thread.delete({
      where: { id: threadId },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/thread/${threadId}`);
    return { message: "スレッドを削除しました。", success: true };
  } catch (error) {
    console.error("Failed to delete thread:", error);
    return { message: "スレッドの削除に失敗しました。", success: false };
  }
}

export async function deletePost(formData: FormData) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    console.error("Unauthorized attempt to delete post.");
    return { message: "認証されていません。", success: false };
  }

  const postId = Number(formData.get("postId"));

  if (isNaN(postId)) {
    return { message: "無効な投稿IDです。", success: false };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { threadId: true },
    });

    if (!post) {
      return { message: "投稿が見つかりません。", success: false };
    }

    await prisma.reaction.deleteMany({
      where: { postId: postId },
    });
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/thread/${post.threadId}`);
    return { message: "投稿を削除しました。", success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { message: "投稿の削除に失敗しました。", success: false };
  }
}
