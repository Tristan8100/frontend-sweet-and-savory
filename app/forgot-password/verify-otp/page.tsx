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

export default function VerifyOtp() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const VerifyOtp = useMutation({
        mutationFn: (credentials: { email: string; otp: string }) => 
            api.post('/api/forgot-password-token', credentials).then(res => res.data),
        onSuccess: (data) => {
            console.log('OTP verified successfully:', data.token);
            localStorage.setItem('reset-token', data.token);
            router.push('/forgot-password/reset-password');
        },
        onError: (error: any) => {
            console.error('OTP verification failed:', error);
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const email = localStorage.getItem('email');
        if (!email) {
            setError('Email not found. Please restart the password reset process.');
            return;
        }
        VerifyOtp.mutate({ email, otp });
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Verify OTP</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 6) {
                                            setOtp(value);
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={VerifyOtp.isPending}
                            >
                                {VerifyOtp.isPending ? 'Verifying...' : 'Verify OTP'}
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