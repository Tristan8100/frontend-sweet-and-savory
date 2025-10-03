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
import { Filter, Eye, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
        const res = await api2.get("/api/reservations-status", { params: { search: debouncedSearch } });
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
              if (diffInDays === 1) {
                indicator = "soon";
              } else if (diffInDays < 0) {
                indicator = "late";
              }
            }

            return {
              id: r.id,
              user: r.user || r.user_name || "Unknown",
              package: r.package || r.packageOption?.package?.name || "N/A",
              package_option: r.package_option || r.packageOption?.name || "N/A",
              package_option_id: r.package_option?.id || 0,
              status: r.status,
              indicator,
              date: reservationDate.toLocaleDateString(),
              amount: r.amount || r.price_purchased || 0,
              review_text: r.review_text,
              rating: r.rating,
            };
          });
          setReservations(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [debouncedSearch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-accent text-accent-foreground";
      case "pending": return "bg-secondary text-secondary-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleView = async (id: number) => {
    try {
      const res = await api2.get(`/api/reservations/${id}`);
      if (res.data.success) {
        const r = res.data.data;
        const reservationDate = new Date(r.reservation_datetime || r.created_at);
        reservationDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let indicator: "soon" | "late" | null = null;
        if (r.status === "pending" || r.status === "confirmed") {
          const diffInDays = Math.ceil(
            (reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffInDays === 1) {
            indicator = "soon";
          } else if (diffInDays < 0) {
            indicator = "late";
          }
        }

        setSelectedReservation({
          id: r.id,
          user: r.user?.name || "Unknown",
          package: r.package_option?.package?.name || "N/A",
          package_option: r.package_option?.name || "N/A",
          package_option_id: r.package_option?.id || 0,
          status: r.status,
          indicator,
          date: reservationDate.toLocaleDateString(),
          amount: r.price_purchased || 0,
          review_text: r.review_text,
          rating: r.rating,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedReservation) return;
    setStatusUpdating(true);
    try {
      const res = await api2.put(`/api/reservations-status/${selectedReservation.id}`, { status: newStatus });
      if (res.data.success) {
        setReservations(prev =>
          prev.map(r => (r.id === selectedReservation.id ? { ...r, status: newStatus } : r))
        );
        setSelectedReservation(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredReservations = reservations.filter(r =>
    (r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.package.toLowerCase().includes(search.toLowerCase()) ||
      r.package_option.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || r.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search reservations..."
          className="w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

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
                  {filteredReservations.map(r => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="p-4">{r.user}</td>
                      <td className="p-4">{r.package}</td>
                      <td className="p-4">{r.package_option}</td>
                      <td className="p-4">{r.date}</td>
                      <td className="p-4 flex items-center gap-2">
                        <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                        {r.indicator === "soon" && (
                          <Badge className="bg-yellow-500 text-black">Soon</Badge>
                        )}
                        {r.indicator === "late" && (
                          <Badge className="bg-red-500 text-white">Late</Badge>
                        )}
                      </td>
                      <td className="p-4">₱{r.amount}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleView(r.id)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 && (
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

      {selectedReservation && (
        <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Customer:</strong> {selectedReservation.user}</p>
              <p><strong>Package:</strong> {selectedReservation.package}</p>
              <p><strong>Option:</strong> {selectedReservation.package_option}</p>
              <p><strong>Date:</strong> {selectedReservation.date}</p>
              <p><strong>Status:</strong> 
                <span className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(selectedReservation.status)}>{selectedReservation.status}</Badge>
                  {selectedReservation.indicator === "soon" && (
                    <Badge className="bg-yellow-500 text-black">Soon</Badge>
                  )}
                  {selectedReservation.indicator === "late" && (
                    <Badge className="bg-red-500 text-white">Late</Badge>
                  )}
                </span>
              </p>
              <p><strong>Amount:</strong> ₱{selectedReservation.amount}</p>
              {selectedReservation.status === 'completed' && selectedReservation.rating && (
                <p><strong>Rating:</strong> {selectedReservation.rating} / 5</p>
              )}
              <Button variant="outline" asChild>
                <Link href={`/admin/dashboard/packages/package-option/${selectedReservation.package_option_id}`}>
                  View Package
                </Link>
              </Button>
              <div className="mt-4">
                <Select
                  value={selectedReservation.status}
                  onValueChange={handleStatusUpdate}
                  disabled={statusUpdating}   // disable now
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change status" />
                    {statusUpdating && (
                      <span className="ml-2 text-sm text-muted-foreground animate-pulse">
                        Updating...
                      </span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
