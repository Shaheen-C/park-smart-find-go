
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import SearchFilters from "@/components/SearchFilters";
import ParkingSpacesList from "@/components/ParkingSpacesList";
import MapPlaceholder from "@/components/MapPlaceholder";
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
  available_spaces: number;
  description: string;
  contact_phone: string;
  contact_email: string;
  image_urls: string[];
  user_id?: string;
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
        <SearchFilters
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          onSearch={handleSearch}
        />

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParkingSpacesList
            loading={loading}
            filteredSpaces={filteredSpaces}
            parkingSpaces={parkingSpaces}
            onRefresh={loadParkingSpaces}
          />
          <MapPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default Search;
