'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api2 } from "@/lib/api";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  reservations_count: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{current_page: number, last_page: number}>({current_page: 1, last_page: 1});

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page when search changes
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users with backend filtering & pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api2.get("/api/get-users", {
          params: { search: debouncedSearch, page }
        });

        setUsers(res.data.data); // paginated data
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl lg:text-3xl font-bold">Users</h2>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          {loading && <p>Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Reservations</th>
                      <th className="py-2 px-3">Created At</th>
                      <th className="py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-2 px-3 font-medium">{user.name}</td>
                          <td className="py-2 px-3">{user.email}</td>
                          <td className="py-2 px-3">{user.reservations_count}</td>
                          <td className="py-2 px-3 text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-3">
                            <Link href={`/admin/dashboard/users/${user.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center space-x-2 mt-4">
                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="px-2 py-1 bg-muted rounded">{page} / {pagination.last_page}</span>
                <Button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
