'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Your existing Axios instance
import { useRouter } from 'next/navigation';
import { Router } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const {login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [name, setName] = useState('');
  const router = useRouter();

  const RegisterMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string; name: string }) => 
      api.post('/api/register', credentials).then(res => res.data),
    onSuccess: (data) => {
        console.log('Registration successful:', data);
        router.push('/auth/login'); // Redirect to dashboard on success
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    RegisterMutation.mutate({ email, password, name });
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
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={RegisterMutation.isPending}>
          {RegisterMutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      {RegisterMutation.isError && (
        <div>
            Error: {
            // Try to extract friendly error message
            (RegisterMutation.error as any)?.response?.data?.errors?.email?.[0]
            || (RegisterMutation.error as any)?.response?.data?.message
            || RegisterMutation.error.message
            }
        </div>
        )}

    </div>
  );
}