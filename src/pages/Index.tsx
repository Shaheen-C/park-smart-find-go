
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Calendar, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const { isSignedIn, setShowSignInModal } = useAuth();
  const navigate = useNavigate();

  const handleFindParking = () => {
    if (isSignedIn) {
      navigate("/search");
    } else {
      setShowSignInModal(true);
    }
  };

  const handleListSpace = () => {
    if (isSignedIn) {
      navigate("/list-space");
    } else {
      setShowSignInModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold text-foreground">Parkiko</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={handleFindParking}
              className="text-muted-foreground hover:text-green-500 transition-colors"
            >
              Find Parking
            </button>
            <button 
              onClick={handleListSpace}
              className="text-muted-foreground hover:text-green-500 transition-colors"
            >
              List Your Space
            </button>
            <Link to="/about" className="text-muted-foreground hover:text-green-500 transition-colors">About</Link>
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Find & Book Parking Spaces Instantly
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover secure parking spots near you or monetize your unused parking space. 
            Perfect for visitors, tourists, and daily commuters across Kerala.
          </p>
          
          {/* Search Bar */}
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-2xl mx-auto border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter location (e.g., Kochi, Thiruvananthapuram)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleFindParking}>
                <Search className="mr-2 h-5 w-5" />
                Search Parking
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose Parkiko?</h3>
          <p className="text-lg text-muted-foreground">The smartest way to find and book parking in Kerala</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Easy Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find available parking spaces near your destination with our intuitive search and map interface.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Instant Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reserve parking spots in advance or book immediately. Secure payment with instant confirmation.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <User className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Trusted Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verified parking space owners and transparent reviews ensure safe and reliable parking experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8">Join thousands of drivers and parking space owners in Kerala</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleFindParking}>
              Find Parking Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={handleListSpace}>
              List Your Space
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-green-500" />
                <span className="text-lg font-bold">Parkiko</span>
              </div>
              <p className="text-muted-foreground">
                Kerala's premier parking marketplace connecting drivers with secure parking spaces.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Drivers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/search" className="hover:text-green-500">Find Parking</Link></li>
                <li><Link to="/how-it-works" className="hover:text-green-500">How It Works</Link></li>
                <li><Link to="/mobile-app" className="hover:text-green-500">Mobile App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/list-space" className="hover:text-green-500">List Your Space</Link></li>
                <li><Link to="/pricing" className="hover:text-green-500">Pricing</Link></li>
                <li><Link to="/resources" className="hover:text-green-500">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-green-500">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-green-500">Contact Us</Link></li>
                <li><Link to="/safety" className="hover:text-green-500">Safety</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Parkiko. All rights reserved. Made with ❤️ in Kerala.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
