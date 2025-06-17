
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, User, MapPin, LogOut, Settings, CreditCard, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const { isSignedIn, setShowSignInModal, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFindParking = () => {
    if (isSignedIn) {
      navigate("/search");
    } else {
      setShowSignInModal(true);
    }
    setMobileMenuOpen(false);
  };

  const handleListSpace = () => {
    if (isSignedIn) {
      navigate("/list-space");
    } else {
      setShowSignInModal(true);
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 dark:bg-black/20 light:bg-white/20 border-b border-white/10 dark:border-white/10 light:border-black/10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/parkiko" className="hover:opacity-80 transition-opacity">
                <img
                  src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png"
                  alt="Parkiko Logo"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={handleFindParking}
                className="text-white/80 dark:text-white/80 light:text-black/80 hover:text-green-500 transition-colors"
              >
                Find Parking
              </button>
              <button
                onClick={handleListSpace}
                className="text-white/80 dark:text-white/80 light:text-black/80 hover:text-green-500 transition-colors"
              >
                List Your Space
              </button>
              <Link to="/nearby-facilities" className="text-white/80 dark:text-white/80 light:text-black/80 hover:text-green-500 transition-colors">
                Nearby Facilities
              </Link>
              <Link to="/fastag-recharge" className="text-white/80 dark:text-white/80 light:text-black/80 hover:text-green-500 transition-colors">
                FASTag Recharge
              </Link>
              <Link to="/about" className="text-white/80 dark:text-white/80 light:text-black/80 hover:text-green-500 transition-colors">
                About
              </Link>
              <ThemeToggle />

              {isSignedIn ? (
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center space-x-2 text-white/80 dark:text-white/80 light:text-black/80 font-medium hover:text-green-500 transition-colors cursor-pointer focus:outline-none"
                      aria-label="User menu"
                      type="button"
                    >
                      <User className="h-5 w-5" />
                      <span>
                        {user?.user_metadata?.first_name || user?.email}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 min-w-[160px] bg-card text-foreground shadow-lg rounded-lg border">
                    <DropdownMenuItem
                      onClick={() => navigate("/my-reservations")}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" /> My Reservations
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/manage-listings")}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" /> Manage Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/80 dark:text-white/80 light:text-black/80">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <button
                      onClick={handleFindParking}
                      className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2"
                    >
                      <Search className="h-5 w-5" />
                      <span>Find Parking</span>
                    </button>
                    
                    <button
                      onClick={handleListSpace}
                      className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>List Your Space</span>
                    </button>
                    
                    <button
                      onClick={() => handleMobileNavClick("/nearby-facilities")}
                      className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Nearby Facilities</span>
                    </button>
                    
                    <button
                      onClick={() => handleMobileNavClick("/fastag-recharge")}
                      className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>FASTag Recharge</span>
                    </button>
                    
                    <button
                      onClick={() => handleMobileNavClick("/about")}
                      className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2"
                    >
                      <span>About</span>
                    </button>

                    <div className="border-t border-border pt-4">
                      {isSignedIn ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 text-foreground">
                            <User className="h-5 w-5" />
                            <span className="font-medium">
                              {user?.user_metadata?.first_name || user?.email}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleMobileNavClick("/my-reservations")}
                            className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2 w-full"
                          >
                            <Calendar className="h-5 w-5" />
                            <span>My Reservations</span>
                          </button>
                          
                          <button
                            onClick={() => handleMobileNavClick("/manage-listings")}
                            className="flex items-center space-x-2 text-left text-foreground hover:text-green-500 transition-colors p-2 w-full"
                          >
                            <Settings className="h-5 w-5" />
                            <span>Manage Listings</span>
                          </button>
                          
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 text-left text-red-600 hover:text-red-700 transition-colors p-2 w-full"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => handleMobileNavClick("/login")}
                          >
                            Sign In
                          </Button>
                          <Button 
                            className="w-full" 
                            onClick={() => handleMobileNavClick("/register")}
                          >
                            Get Started
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="min-h-screen px-4 py-16 text-center relative flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/2220292/pexels-photo-2220292.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Prominent Slogan */}
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent text-2xl md:text-3xl font-bold tracking-wide mb-2">
              PARK SMART, PARK EASY
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

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
        
        <div className="grid md:grid-cols-4 gap-8">
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

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>FASTag Recharge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quick and convenient FASTag recharge for seamless toll payments across Kerala highways.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-muted-foreground">Join thousands of drivers and parking space owners in Kerala</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleFindParking}>
              Find Parking Now
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white border-green-600" onClick={handleListSpace}>
              List Your Space
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/fastag-recharge">Recharge FASTag</Link>
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
                <img
                  src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png"
                  alt="Parkiko Logo"
                  className="h-8 w-auto"
                />
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
