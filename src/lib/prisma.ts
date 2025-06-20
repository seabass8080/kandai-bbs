import { PrismaClient } from "../generated/prisma";

// グローバルオブジェクトにPrismaClientのインスタンスをキャッシュする
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // 開発環境では実行されたクエリをログに出力する設定
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 本番環境以外では、ホットリロードで新しいインスタンスが作られないようにする
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
