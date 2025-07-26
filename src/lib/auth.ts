"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_AUTH_COOKIE_NAME = "kandai-bbs-admin-auth";

/**
 * 管理者パスワードを検証し、認証Cookieを設定
 * @param password 入力されたパスワード
 * @returns 認証が成功した場合はtrue、失敗した場合はfalse
 */
export async function authenticateAdmin(password: string): Promise<boolean> {
  if (ADMIN_PASSWORD === undefined) {
    console.error("ADMIN_PASSWORD is not set in environment variables.");
    return false;
  }

  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_AUTH_COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return true;
  }
  return false;
}

/**
 * 現在のセッションが管理者として認証されているか確認します。
 * @returns 認証されている場合はtrue、そうでない場合はfalse
 */
export async function checkAdminAuth(): Promise<boolean> {
  return cookies().get(ADMIN_AUTH_COOKIE_NAME)?.value === "true";
}

export async function logoutAdmin() {
  cookies().delete(ADMIN_AUTH_COOKIE_NAME);
  redirect("/admin");
}
