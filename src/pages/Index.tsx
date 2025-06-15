import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, PlusCircle, Shield, Clock, DollarSign, Star, Navigation, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isSignedIn, setShowSignInModal, signOut } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Search submitted:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ParkEase</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/search" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Parking
              </Link>
              <Link to="/nearby-facilities" className="text-gray-600 hover:text-blue-600 transition-colors">
                Nearby Facilities
              </Link>
              <Link to="/fastag-recharge" className="text-gray-600 hover:text-blue-600 transition-colors">
                FASTag Recharge
              </Link>
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Link to="/list-space">
                    <Button variant="outline">List Your Space</Button>
                  </Link>
                  <Link to="/manage-listings">
                    <Button variant="outline">Manage Listings</Button>
                  </Link>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowSignInModal(true)}>
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Perfect Parking Spaces
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, book, and manage parking spaces with ease. Whether you're looking for a spot or want to rent out your space, we've got you covered.
          </p>
          
          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <Link to="/search">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Find Parking</h3>
                  <p className="text-sm text-gray-600">Search for available parking spaces near you</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => !isSignedIn ? setShowSignInModal(true) : null}>
              <Link to={isSignedIn ? "/list-space" : "#"}>
                <CardContent className="p-6 text-center">
                  <PlusCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">List Your Space</h3>
                  <p className="text-sm text-gray-600">Rent out your parking space and earn money</p>
                </CardContent>
              </Link>
            </Card>

            <Link to="/nearby-facilities">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Navigation className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Nearby Facilities</h3>
                  <p className="text-sm text-gray-600">Find petrol pumps, toilets & rest areas</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/fastag-recharge">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">FASTag Recharge</h3>
                  <p className="text-sm text-gray-600">Quick and secure toll tag recharge</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Search Section */}
          <section className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Find Parking Near You
            </h2>
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center">
              <Input
                type="text"
                placeholder="Enter a location..."
                className="flex-grow mr-4 mb-2 md:mb-0"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button type="submit">Search</Button>
            </form>
          </section>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose ParkEase?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-sm text-gray-600">
                All parking spaces are verified for your peace of mind.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Book your parking space in seconds with our simple interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Affordable Prices</h3>
              <p className="text-sm text-gray-600">
                Find parking spaces that fit your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
