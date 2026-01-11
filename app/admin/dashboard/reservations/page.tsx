'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Reservation {
  id: number;
  user: string;
  package: string;
  package_option: string;
  package_option_id: number;
  status: string;
  date: string;
  amount: number;
  indicator?: "soon" | "late" | null;
  review_text?: string;
  rating?: number;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{current_page: number, last_page: number}>({current_page: 1, last_page: 1});

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          search: debouncedSearch
        };
        if (statusFilter !== "all") params.status = statusFilter;

        const res = await api2.get("/api/reservations-status", { params });

        if (res.data.success) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const mapped = res.data.data.map((r: any) => {
            const reservationDate = new Date(r.date || r.created_at);
            reservationDate.setHours(0, 0, 0, 0);

            let indicator: "soon" | "late" | null = null;
            if (r.status === "pending" || r.status === "confirmed") {
              const diffInDays = Math.ceil(
                (reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );
              if (diffInDays === 1) indicator = "soon";
              else if (diffInDays < 0) indicator = "late";
            }

            return {
              id: r.id,
              user: r.user || "Unknown",
              package: r.package || "N/A",
              package_option: r.package_option || "N/A",
              package_option_id: r.package_option_id || 0,
              status: r.status,
              indicator,
              date: reservationDate.toLocaleDateString(),
              amount: r.amount || 0,
              review_text: r.review_text,
              rating: r.rating
            };
          });

          setReservations(mapped);
          setPagination({current_page: res.data.pagination.current_page, last_page: res.data.pagination.last_page});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [debouncedSearch, statusFilter, page]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-accent text-accent-foreground";
      case "pending": return "bg-secondary text-secondary-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const updateStatus = async (reservationId: number, newStatus: string, oldStatus: string) => {
    // update
    setReservations((prev) =>
      prev.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res))
    );

    try {
      const res = await api2.put(`/api/reservations-status/${reservationId}`, { status: newStatus });

      if (!res.data.success) {
        // Rollback
        setReservations((prev) =>
          prev.map((res) => (res.id === reservationId ? { ...res, status: oldStatus } : res))
        );
        alert(res.data.message || "Failed to update status");
      }
    } catch (err: any) {
      // Rollback again
      setReservations((prev) =>
        prev.map((res) => (res.id === reservationId ? { ...res, status: oldStatus } : res))
      );
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search reservations..."
          className="w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={(val) => { setPage(1); setStatusFilter(val); }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center p-4">Loading reservations...</p>
            ) : (
              <table className="w-full min-w-[600px]">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Package</th>
                    <th className="p-4 font-medium">Option</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="p-4">{r.user}</td>
                      <td className="p-4">{r.package}</td>
                      <td className="p-4">{r.package_option}</td>
                      <td className="p-4">{r.date}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                          
                          <Select
                            value={r.status}
                            onValueChange={(newStatus) => updateStatus(r.id, newStatus, r.status)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          {r.indicator === "soon" && <Badge className="bg-yellow-500 text-black">Soon</Badge>}
                          {r.indicator === "late" && <Badge className="bg-red-500 text-white">Late</Badge>}
                        </div>
                      </td>
                      <td className="p-4">₱{r.amount}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedReservation(r)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-muted-foreground">No reservations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <span className="px-2 py-1 bg-muted rounded">{page} / {pagination.last_page}</span>
        <Button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)}>Next</Button>
      </div>

      {/* Details Panel */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedReservation(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Reservation Details</h2>
              <button onClick={() => setSelectedReservation(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <div><strong>Customer:</strong> {selectedReservation.user}</div>
              <div><strong>Package:</strong> {selectedReservation.package}</div>
              <div><strong>Option:</strong> {selectedReservation.package_option}</div>
              <div><strong>Date:</strong> {selectedReservation.date}</div>
              <div><strong>Status:</strong> <Badge className={getStatusColor(selectedReservation.status)}>{selectedReservation.status}</Badge></div>
              <div><strong>Amount:</strong> ₱{selectedReservation.amount}</div>
              <Link href={`/admin/dashboard/packages/package-option/${selectedReservation.package_option_id}`}>
                <Button variant="outline" className="w-full mt-4">View Package</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}