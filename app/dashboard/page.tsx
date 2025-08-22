'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-700">Welcome to your dashboard!</p>
      <div className="mt-6">
        <a href="/dashboard/settings" className="text-blue-500 hover:underline">
          Go to Settings
        </a>
      </div>
      <div className="mt-6">
        <p className="text-gray-700">User: {user?.name}</p>
        <p className="text-gray-700">Email: {user?.email}</p>
      </div>
    </div>
  );
}