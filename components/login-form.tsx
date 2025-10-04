import { Eye, EyeOff, Loader2 } from "lucide-react"; // add Eye icons
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <--- toggle state
  const router = useRouter();

  const attemptAdminLogin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post("/api/admin-login", credentials);
      login(res.data.admin_info, res.data.token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
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
      }
    },
    onError: (err: any) => {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401) {
        attemptAdminLogin({ email, password });
      } else if (status === 403) {
        api.post("/api/send-otp", { email })
          .then((otpRes) => {
            localStorage.setItem("email", email);
            router.push("/auth/verify-otp");
          })
          .catch(() => {
            setError("Failed to send OTP. Please try again later.");
          });
      } else {
        setError(message || "An unexpected error occurred.");
      }
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
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="grid gap-3 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // <--- toggle type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-7 p-0 h-8 w-8"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            {error && (
              <div className="text-red-500 text-center text-sm mt-2">{error}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
