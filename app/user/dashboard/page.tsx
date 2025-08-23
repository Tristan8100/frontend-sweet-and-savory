'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
    

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Users, Clock, Star } from "lucide-react"
import HeroSection from "@/components/sections/hero"
import UserHeroSection from '@/components/user/user-hero';

export default function DashboardPage() {
  const { user } = useAuth();
  const packages = [
    {
      id: 1,
      name: "Pasta Paradise Package",
      description: "Authentic Italian pasta dishes perfect for any gathering",
      image: "/images/sv2.jpg",
      options: [
        {
          name: "Classic Combo",
          price: 1000,
          description: "Spaghetti Marinara, Fettuccine Alfredo, Caesar Salad, Garlic Bread",
        },
        {
          name: "Premium Selection",
          price: 1500,
          description: "Lasagna, Penne Arrabbiata, Chicken Parmigiana, Mixed Greens, Tiramisu",
        },
        {
          name: "Family Feast",
          price: 2200,
          description: "All classic items plus Ravioli, Carbonara, Antipasto Platter, Italian Desserts",
        },
      ],
    },
    {
      id: 2,
      name: "Sweet Endings Package",
      description: "Decadent desserts to make your event unforgettable",
      image: "/images/sv1.jpg",
      options: [
        {
          name: "Mini Delights",
          price: 800,
          description: "Assorted mini cupcakes, chocolate truffles, fruit tarts",
        },
        {
          name: "Celebration Special",
          price: 1200,
          description: "Custom cake, cheesecake slices, macarons, chocolate fountain",
        },
        {
          name: "Ultimate Sweet Table",
          price: 1800,
          description: "Everything in Celebration Special plus cookies, brownies, ice cream bar",
        },
      ],
    },
    {
      id: 3,
      name: "Filipino Fiesta Package",
      description: "Traditional Filipino dishes that bring comfort and joy",
      image: "/images/sv1.jpg",
      options: [
        {
          name: "Home Style",
          price: 1100,
          description: "Adobo, Pancit, Fried Rice, Lumpia, Fresh Fruits",
        },
        {
          name: "Festival Feast",
          price: 1600,
          description: "Lechon Kawali, Kare-Kare, Sisig, Pancit Canton, Halo-Halo",
        },
        {
          name: "Grand Celebration",
          price: 2500,
          description: "Complete festival spread plus Crispy Pata, Seafood, Traditional Desserts",
        },
      ],
    },
    {
      id: 4,
      name: "International Fusion Package",
      description: "A worldly selection of international favorites",
      image: "/images/sv2.jpg",
      options: [
        {
          name: "Global Tastes",
          price: 1300,
          description: "Chicken Teriyaki, Beef Tacos, Pad Thai, Mediterranean Salad",
        },
        {
          name: "World Tour",
          price: 1900,
          description: "Korean BBQ, Indian Curry, Mexican Fajitas, Greek Gyros, Asian Stir-fry",
        },
        {
          name: "Continental Deluxe",
          price: 2800,
          description: "Premium international selection with appetizers, mains, and desserts from 6 cuisines",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      
      <UserHeroSection />

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
                    src={pkg.image || "/placeholder.svg"}
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
                    {pkg.options.map((option, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{option.name}</h4>
                          <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                            ₱{option.price.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    Order Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
