'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
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

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [password_confirmation, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const ResetPassword = useMutation({
        mutationFn: (credentials: { 
            email: string; 
            token: string; 
            password: string; 
            password_confirmation: string 
        }) => api.post('/api/reset-password', credentials).then(res => res.data),
        onSuccess: (data) => {
            console.log('Password reset successful:', data);
            localStorage.removeItem('reset-token');
            localStorage.removeItem('email');
            router.push('/auth/login');
        },
        onError: (error: any) => {
            console.error('Password reset failed:', error);
            setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('reset-token');
        const email = localStorage.getItem('email');
        if (!token || !email) {
            setError('Session expired. Please restart the password reset process.');
            return;
        }
        ResetPassword.mutate({ email, token, password, password_confirmation });
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Please enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={password_confirmation}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={ResetPassword.isPending}
                            >
                                {ResetPassword.isPending ? 'Resetting...' : 'Reset Password'}
                            </Button>
                            {error && (
                                <div className="text-red-500 text-center text-sm mt-2">
                                    {error}
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}