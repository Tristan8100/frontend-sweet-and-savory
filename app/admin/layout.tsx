'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, setUser } = useAuth();

    useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await api.get("/api/verify-admin", { //RETURN THE IMAGE PATH IF EXIST AH
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(res.data.user_info);
        console.log("User set:", res.data.user_info); // por debugging again
      } catch (error) {
        console.error("Verification failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
      }
    };

    verifyUser();
  }, [router, setUser]);

  // Por debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!user) {
    // This will trigger if verification fails
    return null;
  }
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center justify-center bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
