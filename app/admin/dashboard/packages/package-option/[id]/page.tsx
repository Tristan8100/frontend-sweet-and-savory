'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, MapPin, Calendar, BrainCircuit, Lightbulb, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  if (!rating) return <span className="text-sm text-muted-foreground">No rating</span>;
  return (
    <div className="flex items-center gap-1">
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

export default function AdminPackageOptionPage() {
  const params = useParams();
  const [option, setOption] = useState<PackageOption | null>(null);
  const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
      try {
        const res = await api2.get(`/api/package-options-reservations/${params.id}`);
        if (res.data.success) setOption(res.data.data);
      } catch (err) {
        console.error("Error fetching package option:", err);
      } finally {
        setLoading(false);
      }
    };

  const handleAiAnalysis = async () => {
    if (!params.id) return;
    setAiLoading(true);
    try {
      const res = await api2.get(`/api/package-options-AI/${params.id}`);
      if (res.data.success) {
        toast.success('AI analysis generated successfully!');
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      toast.error('AI analysis failed: ' + err?.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading package option...</p>;
  if (!option) return <p className="text-center mt-20 text-red-500">Package option not found.</p>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-10">
      {/* Package Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {option.picture_url && (
          <div className="w-full h-64 md:w-1/3 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={`${option.picture_url}`}
              alt={option.name}
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 space-y-3">
          <h1 className="text-4xl font-bold">{option.name}</h1>
          <p className="text-muted-foreground">{option.description}</p>
          <p className="text-sm text-muted-foreground"><strong>Package ID:</strong> {option.package_id}</p>
          <p className="text-3xl font-bold text-primary">₱{Number(option.price).toLocaleString()}</p>
          <Button onClick={handleAiAnalysis} disabled={aiLoading}>
            {aiLoading ? 'Generating AI Insights...' : 'Generate AI Insights'}
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      {(option.analysis || option.recommendation) && (
        <Card className="bg-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" /> AI-Powered Insights
            </CardTitle>
            <CardDescription>Analysis and recommendations based on customer reviews.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {option.analysis && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-1">
                  <Lightbulb className="h-4 w-4" /> Analysis
                </h3>
                <p className="text-muted-foreground">{option.analysis}</p>
              </div>
            )}
            {option.recommendation && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4" /> Recommendation
                </h3>
                <p className="text-muted-foreground">{option.recommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reservations & Reviews */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Reservations & Reviews</h2>
        {option.reservations.length > 0 ? (
          <div className="space-y-4">
            {option.reservations.map((res) => (
              <Card key={res.id} className="shadow-sm">
                <CardHeader className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">User #{res.user_id}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(res.reservation_datetime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={res.status === 'Completed' ? 'default' : 'secondary'}>
                    {res.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{res.address}</span>
                  </div>

                  {res.review_text && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <StarRating rating={res.rating} />
                        {res.sentiment_analysis && (
                          <Badge>{res.sentiment_analysis}</Badge>
                        )}
                      </div>
                      <blockquote className="border-l-4 pl-4 italic text-muted-foreground flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5" /> {res.review_text}
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
