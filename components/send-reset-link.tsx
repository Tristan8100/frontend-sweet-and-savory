'use client';

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
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function SendResetLinkForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const resetLinkMutation = useMutation({
    mutationFn: (credentials: { email: string }) => 
      api.post('/api/forgot-password', credentials).then(res => res.data),
    onSuccess: (data) => {
      console.log('Reset link sent successfully:', data);
      localStorage.setItem('verificationEmail', email); // Store email for OTP verification
      router.push('/forgot-password/verify-otp');
    },
    onError: (error: any) => {
      console.log('Failed to send reset link:', error);
      if (error.response?.data) {
        setError(error.response.data.message || "Failed to send reset link");
      } else {
        setError("An unexpected error occurred");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    resetLinkMutation.mutate({ email });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={resetLinkMutation.isPending}
              >
                {resetLinkMutation.isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
              {error && (
                <div className="text-red-500 text-center text-sm mt-2">
                  {error}
                </div>
              )}
              <div className="text-center text-sm">
                Remember your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}