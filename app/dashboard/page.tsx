'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
    

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Users, Clock, Star } from "lucide-react"
import HeroSection from "@/components/sections/hero"

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
      
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">5+</h3>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">4.9</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make Your Event Special?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today for a personalized quote and let us handle the catering while you enjoy your event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              Get Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Call Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold">Delicious Catering</h3>
              </div>
              <p className="text-muted-foreground">Making every event memorable with exceptional food and service.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Corporate Events</li>
                <li>Weddings</li>
                <li>Private Parties</li>
                <li>Special Occasions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>+63 912 345 6789</li>
                <li>info@deliciouscatering.ph</li>
                <li>Manila, Philippines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Instagram
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Delicious Catering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
