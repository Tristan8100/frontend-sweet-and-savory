import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const attemptAdminLogin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post("/api/admin-login", credentials);
      login(res.data.admin_info, res.data.token);
      router.push("/admin/dashboard");
      console.log("Admin login successful");
    } catch (err: any) {
      console.error("Admin login failed", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post("/api/login", credentials).then((res) => res.data),
    onSuccess: (data) => {
      if (data.token) {
        login(data.user_info, data.token);
        router.push("/user/dashboard");
        console.log("User login successful");
      }
    },
    onError: (err: any) => {
      console.warn("User login failed, attempting admin login...");
      attemptAdminLogin({ email, password });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Use your user or admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
