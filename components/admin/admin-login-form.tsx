"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Не удалось войти");
        return;
      }
      toast.success("Добро пожаловать в панель администратора");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Ошибка соединения. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <Card className="shadow-lifted">
        <CardHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-800 text-white dark:bg-accent-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="mt-2">Панель администратора</CardTitle>
          <CardDescription>Введите пароль для доступа к управлению данными</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-sm text-danger-500">{error}</p>}
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? "Проверка..." : "Войти"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-ink-400 dark:text-ink-500">
            Демо-доступ: пароль указан в файле .env.local.example
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
