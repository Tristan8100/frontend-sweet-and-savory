"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api2.get("/api/analytics");
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (!data) return <p>No analytics available</p>;

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Reservations</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{data.stats.totalReservations}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{data.stats.activeUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Packages</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{data.stats.totalPackages}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">₱{data.stats.revenue}</CardContent>
        </Card>
      </div>

      {/* Sentiment Ratio + Best Package Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Ratio */}
        <Card>
          <CardHeader><CardTitle>Sentiment Ratio</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Positive", value: data.sentimentRatios.positive },
                    { name: "Neutral", value: data.sentimentRatios.neutral },
                    { name: "Negative", value: data.sentimentRatios.negative },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Package Option */}
        <Card>
          <CardHeader><CardTitle>Best Package Option</CardTitle></CardHeader>
          <CardContent>
            {data.bestPackageOption ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{data.bestPackageOption.name}</h3>
                <p className="text-sm text-muted-foreground">{data.bestPackageOption.description}</p>
                <div className="flex gap-4 mt-2">
                  <Badge>Reservations: {data.bestPackageOption.reservations_count}</Badge>
                  <Badge>Reviews: {data.bestPackageOption.reviews_count}</Badge>
                </div>
                <Button asChild className="mt-4">
                  <a href={`/admin/dashboard/packages/package-option/${data.bestPackageOption.id}`}>View</a>
                </Button>
              </div>
            ) : (
              <p>No package option data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader><CardTitle>Monthly Revenue (Last 12 Months)</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reservations */}
      <Card>
        <CardHeader><CardTitle>Recent Reservations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.recentReservations.map((res: any) => (
              <div key={res.id} className="flex justify-between items-center p-2 border rounded-lg">
                <div>
                  <p className="font-medium">{res.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {res.package} • {res.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{res.status}</Badge>
                  {res.reviewed && <Badge variant="secondary">Reviewed</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
