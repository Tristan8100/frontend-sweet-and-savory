"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api2 } from "@/lib/api";

export default function UserView() {
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api2.get(`/api/get-user/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>No user found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* User Info */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
          <p className="font-medium">
            Total Reservations: {user.reservations_count}
          </p>
        </CardContent>
      </Card>

      {/* Reservations */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Reservations</h3>
          {user.reservations.length === 0 ? (
            <p className="text-muted-foreground">No reservations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Address</th>
                    <th className="py-2 px-3">Review</th>
                    <th className="py-2 px-3">Rating</th>
                    <th className="py-2 px-3">Sentiment</th>
                    <th className="py-2 px-3">Package</th>
                  </tr>
                </thead>
                <tbody>
                  {user.reservations.map((res: any) => (
                    <tr key={res.id} className="border-b">
                      <td className="py-2 px-3">{res.status}</td>
                      <td className="py-2 px-3">₱{res.price_purchased}</td>
                      <td className="py-2 px-3">
                        {res.reservation_datetime
                          ? new Date(res.reservation_datetime).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-2 px-3">{res.address || "-"}</td>
                      <td className="py-2 px-3">{res.review_text || "-"}</td>
                      <td className="py-2 px-3">{res.rating ?? "-"}</td>
                      <td className="py-2 px-3">{res.sentiment_analysis || "-"}</td>
                      <td className="py-2 px-3">
                        {res.package_option_id ? (
                          <Link href={`/admin/dashboard/packages/package-option/${res.package_option_id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
