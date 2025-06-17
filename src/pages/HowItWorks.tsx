
import { Search, MapPin, CreditCard, Car, Clock, Shield, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How Parkiko Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how easy it is to find parking or earn money from your unused parking space
          </p>
        </div>

        {/* For Drivers Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">For Drivers</h2>
            <p className="text-lg text-muted-foreground">Find and book parking in just a few clicks</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Enter your destination and browse available parking spaces nearby
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <CardTitle className="text-lg">Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Check prices, amenities, and reviews to find the perfect spot
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Reserve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Reserve instantly and get confirmation for your parking spot
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <CardTitle className="text-lg">Navigate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Get directions and access details to reach your parking spot
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-teal-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <CardTitle className="text-lg">Park</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Park safely and leave a review to help other drivers
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-6">Why Choose Parkiko for Parking?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Guaranteed Availability</h4>
                  <p className="text-muted-foreground text-sm">Pre-book to guarantee your parking spot is waiting for you</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Safe & Secure</h4>
                  <p className="text-muted-foreground text-sm">All parking spaces are verified and reviewed by our community</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Save Time</h4>
                  <p className="text-muted-foreground text-sm">No more circling around looking for parking spots</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Owners Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">For Space Owners</h2>
            <p className="text-lg text-muted-foreground">Turn your unused parking space into income</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <CardTitle className="text-lg">List Your Space</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Add photos, set availability, and describe your parking space
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <CardTitle className="text-lg">Set Your Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Choose hourly or daily rates based on your location and demand
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Get Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Receive instant notifications when drivers book your space
                </p>
              </CardContent>
            </Card>

            <Card className="text-center relative">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <CardTitle className="text-lg">Earn Money</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Get paid weekly with our secure payment system
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of drivers and space owners in Kerala
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link to="/search">Find Parking Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/list-space">List Your Space</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
