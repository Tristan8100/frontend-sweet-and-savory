'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Users, Clock, Star } from "lucide-react"
import HeroSection from "@/components/sections/hero"
import { useState, useEffect } from 'react';
import { api2 } from "@/lib/api";
import Link from "next/link";
import Packages from "@/components/user/packages"
import Image from "next/image"

export default function CateringLandingPage() {

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

      <Packages />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                At Sweet and Savory, we are passionate about creating unforgettable experiences through exquisite food and exceptional service. 
                With years of experience in catering for events of all sizes, we ensure every detail is taken care of, so you can enjoy your special occasion stress-free.
              </p>
              <p className="text-lg text-muted-foreground">
                Our team of professional chefs and event specialists work closely with you to tailor menus and services to match your vision, ensuring that every event is not just catered, but celebrated.
              </p>
            </div>
            <div>
              <Image
                src="/images/sv2.jpg"
                alt="About Delicious Catering"
                width={400}      // Set desired width
                height={400}     // Set same height to make it square
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
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
