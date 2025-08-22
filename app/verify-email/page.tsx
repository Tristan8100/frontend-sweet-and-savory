'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Your existing Axios instance
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
    const [otp, setotp] = useState('');
  const router = useRouter();

  const VerifyOtp = useMutation({
    mutationFn: (credentials: { email: string; otp: string }) => 
      api.post('/api/verify-otp', credentials).then(res => res.data),
    onSuccess: (data) => {
        console.log('Verifying successful:', data);
        router.push('/login'); // Redirect to dashboard on success
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    VerifyOtp.mutate({ email, otp });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="number"
          value={otp}
          onChange={(e) => setotp(e.target.value)}
          placeholder="otp"
          required
        />
        <button type="submit" disabled={VerifyOtp.isPending}>
          {VerifyOtp.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      {VerifyOtp.isError && (
        <div>Error: {VerifyOtp.error.message}</div>
      )}

    </div>
  );
}