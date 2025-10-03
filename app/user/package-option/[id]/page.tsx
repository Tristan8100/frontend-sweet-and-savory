'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, MapPin, Calendar, BrainCircuit, Lightbulb, User } from "lucide-react";
import ReservationDialog from "@/components/user/create-reservation";

interface Reservation {
  id: number;
  user_id: number;
  package_option_id: number;
  status: string;
  price_purchased: number;
  reservation_datetime: string;
  address: string;
  review_text: string | null;
  rating: number | null;
  sentiment_analysis: string | null;
}

interface PackageOption {
  id: number;
  package_id: number;
  name: string;
  description: string;
  price: number;
  picture_url?: string;
  analysis?: string;
  recommendation?: string;
  reservations: Reservation[];
}

const StarRating = ({ rating }: { rating: number | null }) => {
  if (rating === null || rating === 0) {
    return <span className="text-sm text-muted-foreground">No rating</span>;
  }
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};


export default function PackageOptionPage() {
  const params = useParams();
  const [option, setOption] = useState<PackageOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchData = async () => {
      try {
        const res = await api2.get(`/api/package-options-reservations/${params.id}`);
        if (res.data.success) {
          setOption(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching package option:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <p className="text-center mt-20">Loading package details...</p>;
  }

  if (!option) {
    return <p className="text-center mt-20 text-red-500">Package option not found.</p>;
  }

  return (
    <div className="container mx-auto max-w-5xl pt-16 sm:pt-12 px-4 border border-red-500">
      <div className="pt-6 mb-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">{option.name}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10">{option.description}</p>
      <ReservationDialog packageOptionId={option.id} />
      </div>
      
      {/* --- Package Details & Image --- */}
      <Card className="mb-10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-6 flex flex-col justify-between">
            <div>
              <CardTitle className="mb-4">Package Overview</CardTitle>
              <p className="text-3xl font-bold text-primary mb-4">
                ₱{option.price}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Package ID:</strong> {option.package_id}
              </p>
            </div>
          </div>
          {option.picture_url && (
            <div className="relative h-64:h-full w-full">
              <Image
                src={`${api2.defaults.baseURL}${option.picture_url}`}
                alt={option.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
        </div>
      </Card>

      {/* --- AI-Powered Insights Section --- */}
      {(option.analysis || option.recommendation) && (
        <Card className="mb-10 bg-secondary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    AI-Powered Insights
                </CardTitle>
                <CardDescription>Automated analysis and recommendations based on customer feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {option.analysis && (
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-1"><Lightbulb className="h-4 w-4"/>Analysis</h3>
                        <p className="text-muted-foreground">{option.analysis}</p>
                    </div>
                )}
                {option.recommendation && (
                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-1"><Star className="h-4 w-4"/>Recommendation</h3>
                        <p className="text-muted-foreground">{option.recommendation}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}

      {/* --- Reservations & Reviews Section --- */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Reviews & Reservations</h2>
        {option.reservations && option.reservations.length > 0 ? (
          <div className="space-y-6">
            {option.reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <Avatar>
                          {/* You could fetch user image here if available */}
                          <AvatarFallback><User /></AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="font-semibold">User #{reservation.user_id}</p>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(reservation.reservation_datetime).toLocaleDateString()}</span>
                         </div>
                       </div>
                    </div>
                    <Badge variant={reservation.status === 'Completed' ? 'default' : 'secondary'}>
                        {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.address}</span>
                  </div>
                  
                  {/* Review Section */}
                  {reservation.review_text && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                          <StarRating rating={reservation.rating} />
                          {reservation.sentiment_analysis && (
                              <Badge>
                                  {reservation.sentiment_analysis}
                              </Badge>
                          )}
                      </div>
                      <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
                        <MessageSquare className="inline-block h-4 w-4 mr-2" />
                        {reservation.review_text}
                      </blockquote>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-10">No reservations found for this package option.</p>
        )}
      </div>
    </div>
  );
}