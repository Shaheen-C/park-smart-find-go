
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import { parkingService } from "@/services/parkingService";
import { useToast } from "@/hooks/use-toast";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  amenities: string[];
  created_at: string;
  capacity: number;
  description: string;
  contact_phone: string;
  contact_email: string;
  image_urls: string[];
}

const Search = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredSpaces, setFilteredSpaces] = useState<ParkingSpace[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadParkingSpaces();
  }, []);

  useEffect(() => {
    // Filter parking spaces based on location search
    if (location.trim()) {
      const filtered = parkingSpaces.filter(space =>
        space.location.toLowerCase().includes(location.toLowerCase()) ||
        space.space_name.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredSpaces(filtered);
    } else {
      setFilteredSpaces(parkingSpaces);
    }
  }, [location, parkingSpaces]);

  const loadParkingSpaces = async () => {
    setLoading(true);
    try {
      const result = await parkingService.getParkingSpaces();
      if (result.error) {
        toast({
          title: "Error loading parking spaces",
          description: "Failed to fetch parking listings. Please try again.",
          variant: "destructive"
        });
      } else {
        setParkingSpaces(result.data);
        setFilteredSpaces(result.data);
      }
    } catch (error) {
      console.error("Error loading parking spaces:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading parking spaces.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log("Search clicked with:", { location, date, time });
    toast({
      title: "Search functionality",
      description: `Searching for parking in: ${location || 'all locations'}`
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const formatAmenities = (amenities: string[]) => {
    return amenities?.slice(0, 3) || [];
  };

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
              <BackButton />
            </div>
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
                <label className="block text-sm font-medium mb-2 text-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSearch}>
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {loading ? "Loading..." : `Available Parking Spaces (${filteredSpaces.length})`}
              </h2>
              {!loading && parkingSpaces.length > 0 && (
                <Button variant="outline" onClick={loadParkingSpaces}>
                  Refresh
                </Button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading parking spaces...</p>
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {parkingSpaces.length === 0 
                    ? "No parking spaces listed yet. Be the first to list your space!" 
                    : "No parking spaces found matching your search criteria."
                  }
                </p>
                <Link to="/list-space">
                  <Button className="mt-4">List Your Space</Button>
                </Link>
              </div>
            ) : (
              filteredSpaces.map((space) => (
                <Card key={space.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{space.space_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {space.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">
                          {formatPrice(space.price_per_hour)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Capacity: {space.capacity}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {space.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formatAmenities(space.amenities).map((amenity) => (
                        <span key={amenity} className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {space.amenities?.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{space.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Book Now
                      </Button>
                      <Link to={`/parking/${space.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Map Placeholder */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-96">
              <CardContent className="p-0 h-full">
                <div className="bg-muted h-full rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-foreground">Interactive Map</p>
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
