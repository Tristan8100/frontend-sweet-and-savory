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
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function VerifyOtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isEmailLoaded, setIsEmailLoaded] = useState(false);
  const router = useRouter();

  // Retrieve email from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
      setIsEmailLoaded(true);
    }
  }, []);

  const verifyOtpMutation = useMutation({
    mutationFn: (credentials: { email: string; otp: string }) => 
      api.post('/api/verify-otp', credentials).then(res => res.data),
    onSuccess: (data) => {
      console.log('Verification successful:', data);
      // Clear the stored email after successful verification
      localStorage.removeItem('email');
      router.push('/auth/login'); //hmm need to put some message flash something
    },
    onError: (error: any) => {
      console.log('Verification failed:', error);
      if (error.response?.data) {
        setError(error.response.data.message || "Invalid verification code");
      } else {
        setError("An unexpected error occurred");
      }
    },
  });

  const resendOtpMutation = useMutation({ //NOT YET TESTED
    mutationFn: () => 
      api.post('/api/send-otp', { email }).then(res => res.data),
    onSuccess: () => {
      console.log('OTP resent successfully');
    },
    onError: (error: any) => {
      console.log('Resend failed:', error);
      if (error.response?.data) {
        setError(error.response.data.message || "Failed to resend OTP");
      }
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^[0-9]{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray.slice(0, 6));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailLoaded) {
      setError("Email not found. Please try the verification process again.");
      return;
    }
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }
    console.log(fullOtp);
    verifyOtpMutation.mutate({ email, otp: fullOtp });
  };

  const handleResendOtp = () => {
    if (!email) {
      setError("Email not found. Please try the verification process again.");
      return;
    }
    resendOtpMutation.mutate();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-xl"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Didn't receive a code?{' '}
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    className="underline underline-offset-4 hover:text-primary"
                    disabled={resendOtpMutation.isPending}
                  >
                    {resendOtpMutation.isPending ? 'Sending...' : 'Resend code'}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
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