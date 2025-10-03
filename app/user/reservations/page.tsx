"use client";

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Reservation = {
  id: number;
  status: string;
  reservation_datetime: string;
  price_purchased: string;
  address: string;
  review_text?: string;
  rating?: number;
  sentiment_analysis?: string;
  package_option: {
    id: number;
    name: string;
    package: {
      id: number;
      name: string;
    };
  };
};

const statuses = ["all", "pending", "confirmed", "cancelled", "completed"];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [submittingReviewId, setSubmittingReviewId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchReservations = async (status: string) => {
    setLoading(true);
    try {
      const url =
        status === "all"
          ? "/api/my-reservations-status"
          : `/api/my-reservations-status?status=${status}`;
      const res = await api2.get(url);
      setReservations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(activeStatus);
  }, [activeStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cancelReservation = async (id: number) => {
    try {
      const res = await api2.patch(`/api/my-reservations-update/${id}`);
      toast.success(res.data.message || "Reservation cancelled!");
      fetchReservations(activeStatus);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel reservation.");
    }
  };

  const submitReview = async (reservationId: number) => {
    if (!reviewText || reviewRating <= 0) {
      toast.error("Please provide review text and rating.");
      return;
    }

    setSubmittingReviewId(reservationId);

    try {
      const res = await api2.post(`/api/reservations/${reservationId}/review`, {
        review_text: reviewText,
        rating: reviewRating,
      });
      toast.success(res.data.message || "Review submitted successfully!");
      setReviewText("");
      setReviewRating(0);
      fetchReservations(activeStatus);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReviewId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-10 pt-20 md:pt-10 bg-background">
  <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Reservations</h1>
      <Tabs
        defaultValue="all"
        value={activeStatus}
        onValueChange={setActiveStatus}
        className="w-full"
      >
        <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {statuses.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

        {statuses.map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : reservations.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No {status === "all" ? "" : status} reservations found.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="shadow-lg rounded-lg overflow-hidden relative">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">
                        {reservation.package_option.name} (
                        {reservation.package_option.package.name})
                      </CardTitle>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Date:</strong> {new Date(reservation.reservation_datetime).toLocaleString()}</p>
                      <p><strong>Price:</strong> ₱{reservation.price_purchased}</p>
                      <p><strong>Address:</strong> {reservation.address}</p>

                      {reservation.rating !== undefined && (
                        <p className="flex items-center mt-2">
                          <strong>Rating:</strong>{" "}
                          <span className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (reservation.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </span>
                        </p>
                      )}

                      {reservation.review_text && (
                        <p className="mt-2"><strong>Review:</strong> {reservation.review_text}</p>
                      )}

                      {reservation.sentiment_analysis && (
                        <p className="mt-2"><strong>AI Insight:</strong> {reservation.sentiment_analysis}</p>
                      )}

                      {/* Cancel Button with AlertDialog */}
                      {reservation.status === "pending" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="mt-3 flex items-center gap-2">
                              <Trash2 className="h-4 w-4" /> Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this reservation? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="space-x-2">
                              <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelReservation(reservation.id)} className="bg-red-600 hover:bg-red-700">Cancel Reservation</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {/* Review Form */}
                      {reservation.status === "completed" && !reservation.review_text && (
                        <div className="mt-4 space-y-2 border-t pt-3">
                          <Label>Write a Review:</Label>
                          <Input
                            placeholder="Your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="rounded-md border-gray-300"
                          />
                          <div className="flex items-center space-x-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-6 w-6 cursor-pointer ${i < reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                                onClick={() => setReviewRating(i + 1)}
                              />
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => submitReview(reservation.id)}
                            disabled={submittingReviewId === reservation.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {submittingReviewId === reservation.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                        </div>
                      )}

                      <Button size="sm" variant="outline" className="mt-2 w-full">
                        <Link href={`/user/package-option/${reservation.package_option.package.id}`}>
                          View Package
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
