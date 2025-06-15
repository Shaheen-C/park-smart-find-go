
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, Search, MapPin, CreditCard, Calendar, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const About = () => {
  const { isSignedIn, setShowSignInModal } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      window.location.href = "/search";
    } else {
      setShowSignInModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 dark:bg-black/20 light:bg-white/20 border-b border-white/10 dark:border-white/10 light:border-black/10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png"
                alt="Parkiko Logo"
                className="h-8 w-auto"
              />
            </Link>
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About Parkiko
          </h1>
          <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent text-2xl font-bold tracking-wide mb-6">
            TRANSFORMING PARKING, ONE SPACE AT A TIME
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Finding a safe, convenient parking spot shouldn't be a daily struggle. Whether you're visiting a busy city center, exploring a new destination, or simply running errands, parking challenges can turn any journey into a stressful experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-6"></div>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every unused parking space is an opportunity – an opportunity for property owners to earn extra income and for drivers to find the perfect spot. Our platform bridges this gap by creating a trusted marketplace where parking space owners can list their available spots, and drivers can discover, book, and pay for parking with just a few clicks.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Offer</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* For Drivers */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-2xl">For Drivers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Smart Search</h4>
                    <p className="text-muted-foreground">Find parking spaces near your destination with our location-based search and interactive maps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Advanced Filtering</h4>
                    <p className="text-muted-foreground">Search by price, amenities, vehicle size, and availability to find exactly what you need</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Instant Booking</h4>
                    <p className="text-muted-foreground">Reserve your spot in advance or find immediate parking with real-time availability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Complete Information</h4>
                    <p className="text-muted-foreground">View detailed photos, amenities (security, CCTV, car wash, toilets), and honest reviews from other drivers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Secure Payments</h4>
                    <p className="text-muted-foreground">Pay safely through our integrated payment system with booking confirmations sent directly to you</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Parking Space Owners */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-2xl">For Parking Space Owners</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Easy Listing</h4>
                    <p className="text-muted-foreground">List your parking spaces with detailed descriptions, photos, and amenities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Flexible Management</h4>
                    <p className="text-muted-foreground">Update availability, set pricing, and manage bookings on your schedule</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Steady Income</h4>
                    <p className="text-muted-foreground">Monetize your unused parking spaces with our simple monthly subscription model</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Direct Communication</h4>
                    <p className="text-muted-foreground">Connect with customers through provided contact details for smooth transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Beyond Parking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Beyond Parking</CardTitle>
              <CardDescription className="text-center">
                We're not just about parking spaces. Our platform also helps you discover essential services nearby.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Public Toilets</h4>
                  <p className="text-muted-foreground">Find clean public toilet facilities near your parking spot</p>
                </div>
                <div>
                  <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Petrol Pumps</h4>
                  <p className="text-muted-foreground">Locate nearby fuel stations for convenient refueling</p>
                </div>
                <div>
                  <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Rest Areas</h4>
                  <p className="text-muted-foreground">Discover comfortable restroom facilities for your journey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Commitment to Quality</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We take the safety and satisfaction of our community seriously. Every listing includes detailed photos and descriptions, and our review system ensures transparency and accountability. Our automated quality monitoring removes consistently poor-performing listings, maintaining high standards across our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Safety First</h4>
                <p className="text-muted-foreground">Only legitimate, safe parking spaces make it onto our platform</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Transparency</h4>
                <p className="text-muted-foreground">Clear pricing, detailed amenities, and honest user reviews</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Reliability</h4>
                <p className="text-muted-foreground">Confirmed bookings, secure payments, and responsive customer support</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Continuous Improvement</h4>
                <p className="text-muted-foreground">Regular updates based on user feedback and changing needs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Focus Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Starting Local, Thinking Global</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're proud to launch in Kerala, India, where we understand the local parking challenges and can provide personalized service to our community. Our deep understanding of regional needs allows us to offer relevant solutions while building toward our vision of global expansion.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As we grow, we'll continue to adapt our platform to serve diverse markets while maintaining our core values of safety, convenience, and community.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Whether you're a driver tired of circling blocks looking for parking, or a property owner with unused space, we invite you to join our growing community. Together, we're making parking smarter, easier, and more efficient for everyone.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleGetStarted}>
              Find Parking Now
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/list-space">List Your Space</Link>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent text-xl font-bold">
            Park Smart, Park Easy
          </div>
          <p className="text-muted-foreground mt-2">
            Because your time is valuable, and parking shouldn't be complicated.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png"
              alt="Parkiko Logo"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-muted-foreground mb-4">
            Questions or need support? Our team is here to help.
          </p>
          <p className="text-muted-foreground">
            Contact us through the platform or reach out to our customer support team.
          </p>
          <div className="border-t border-border mt-8 pt-8">
            <p className="text-muted-foreground">&copy; 2024 Parkiko. All rights reserved. Made with ❤️ in Kerala.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
