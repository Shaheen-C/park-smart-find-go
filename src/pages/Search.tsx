
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search as SearchIcon, Calendar, Clock } from "lucide-react";
import BackButton from "@/components/BackButton";

const Search = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Mock parking spaces data
  const parkingSpaces = [
    {
      id: 1,
      name: "Secure Residential Parking",
      location: "MG Road, Kochi",
      price: "₹50/hour",
      distance: "0.2 km away",
      rating: 4.8,
      amenities: ["CCTV", "Security", "Car Wash"],
      available: true
    },
    {
      id: 2,
      name: "Commercial Complex Parking",
      location: "Panampilly Nagar, Kochi",
      price: "₹40/hour",
      distance: "0.5 km away",
      rating: 4.6,
      amenities: ["Security", "Toilet", "24/7 Access"],
      available: true
    },
    {
      id: 3,
      name: "Private Driveway",
      location: "Kadavanthra, Kochi",
      price: "₹30/hour",
      distance: "0.8 km away",
      rating: 4.9,
      amenities: ["CCTV", "Covered"],
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
            </div>
            <BackButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              Find Parking Spaces
            </CardTitle>
            <CardDescription>
              Search for available parking spaces in your desired location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Parking Spaces</h2>
            {parkingSpaces.map((space) => (
              <Card key={space.id} className={`${!space.available ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{space.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {space.location} • {space.distance}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{space.price}</div>
                      <div className="text-sm text-gray-500">★ {space.rating}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {space.amenities.map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={space.available ? "default" : "secondary"} 
                      disabled={!space.available}
                      className="flex-1"
                    >
                      {space.available ? "Book Now" : "Not Available"}
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-96">
              <CardContent className="p-0 h-full">
                <div className="bg-gray-200 h-full rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">Parking locations will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
