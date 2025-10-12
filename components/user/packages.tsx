'use client'

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Packages() {
    const [packages, setPackages] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchPackages = async () => {
          try {
            const res = await api2.get('/api/admin-packages');
            if (res.data.success) {
              setPackages(res.data.data);
            }
          } catch (err) {
            console.error('Error fetching packages:', err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPackages();
      }, []);
    
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Loading packages...</p>
          </div>
        );
      }
    return (
    <>
          {/* Packages Section */}
      <section id="packages" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Catering Packages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated packages, each designed to deliver exceptional taste and memorable
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`${pkg.picture_url}`}
                    alt={pkg.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {pkg.options?.map((option: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{option.name}</h4>
                          <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                            ₱{Number(option.price).toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/user/package/${pkg.id}`}>
                    Order Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>);
}