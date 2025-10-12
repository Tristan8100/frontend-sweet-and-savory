'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api2 } from "@/lib/api";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PackageOption {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Package {
  id: number;
  name: string;
  description: string;
  picture_url?: string;
  analysis?: string;
  recommendation?: string;
  options: PackageOption[];
}

export default function PackagePage() {
  const params = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchPackage = async () => {
      try {
        const { data } = await api2.get(`/api/admin-packages/${params.id}`);
        if (data.success) {
          setPkg(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch package:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params?.id]);

  if (loading) {
    return <p className="text-center mt-10">Loading package details...</p>;
  }

  if (!pkg) {
    return <p className="text-center mt-10 text-red-500">Package not found.</p>;
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl pt-12 md:pt-0 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
          {pkg.picture_url && (
            <Image
              src={`${pkg.picture_url}`}
              alt={pkg.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{pkg.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">{pkg.description}</p>

          {/* Analysis & Recommendation */}
          {pkg.analysis && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Analysis</h3>
              <p className="text-muted-foreground">{pkg.analysis}</p>
            </div>
          )}
          {pkg.recommendation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Recommendation</h3>
              <p className="text-muted-foreground">{pkg.recommendation}</p>
            </div>
          )}

          {/* Options */}
          <h2 className="text-2xl font-semibold mb-4">Available Options</h2>
          <div className="space-y-4">
            {pkg.options.map((option) => (
              <div
                key={option.id}
                className="border rounded-xl p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{option.name}</h4>
                  <Badge
                    variant="secondary"
                    className="text-base"
                  >
                    ₱{option.price.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>

                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => console.log(`Order option ${option.id}`)}
                >
                <Link href={`/user/package-option/${option.id}`}>
                    Order Now
                </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
