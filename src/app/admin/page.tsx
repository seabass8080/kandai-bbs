"use client";

import { authenticateAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400">
      {pending ? "ログイン中..." : "ログイン"}
    </button>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: FormData) => {
    setError(null);
    const password = formData.get("password") as string;
    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }

    const success = await authenticateAdmin(password);
    if (success) {
      toast.success("ログインに成功しました！");
      router.push("/admin/dashboard");
    } else {
      setError("パスワードが間違っています。");
      toast.error("ログインに失敗しました。");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">管理者ログイン</h1>
        <form action={handleLogin}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              パスワード
            </label>
            <input type="password" id="password" name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </main>
  );
}
