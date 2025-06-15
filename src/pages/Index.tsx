import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MapPin, Star, Shield, Zap, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [features] = useState([
    {
      title: "Extensive Coverage",
      description: "Find parking spaces in numerous locations.",
      icon: MapPin,
    },
    {
      title: "Verified Listings",
      description: "Trust in our verified parking spaces for reliability.",
      icon: Star,
    },
    {
      title: "Secure Transactions",
      description: "Enjoy secure and seamless payment options.",
      icon: Shield,
    },
    {
      title: "Instant Booking",
      description: "Book your parking space quickly and effortlessly.",
      icon: Zap,
    },
  ]);

  const { user, signOut, showSignInModal, setShowSignInModal } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="backdrop-blur-xl bg-black/20 dark:bg-black/20 light:bg-white/20 shadow-lg border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png" alt="Parkiko Logo" className="h-8 w-auto" />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/list-space">
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 border-green-600">
                      List Your Space
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/20">
                        <User className="h-5 w-5 mr-2" />
                        {user.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border border-border">
                      <DropdownMenuItem asChild>
                        <Link to="/manage-listings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Listings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowSignInModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-green-900 mb-4">
                Find Your Perfect Parking Spot with Parkiko
              </h1>
              <p className="text-lg text-green-700 mb-6">
                Effortlessly search, reserve, and pay for parking spaces in
                seconds. Parkiko simplifies your parking experience.
              </p>
              <Link to="/search">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Search className="mr-2 h-4 w-4" />
                  Find Parking Now
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="/hero-parking.webp"
                alt="Parking Illustration"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Why Choose Parkiko?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-green-500" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Ready to Simplify Your Parking?
          </h2>
          <p className="text-lg text-green-700 mb-6">
            Join Parkiko today and experience hassle-free parking.
          </p>
          <Link to="/search">
            <Button className="bg-green-600 hover:bg-green-700">
              Explore Parking Spaces
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
