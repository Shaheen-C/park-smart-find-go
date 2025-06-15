
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
  const [availability, setAvailability] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredSpaces, setFilteredSpaces] = useState<ParkingSpace[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadParkingSpaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [location, availability, priceRange, selectedAmenities, parkingSpaces]);

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

  const getAvailabilityStatus = (space: ParkingSpace) => {
    const available = space.available_spaces || 0;
    if (available === 0) {
      return "full";
    } else if (available <= space.capacity * 0.3) {
      return "limited";
    } else {
      return "available";
    }
  };

  const applyFilters = () => {
    let filtered = parkingSpaces;

    // Location filter
    if (location.trim()) {
      filtered = filtered.filter(space =>
        space.location.toLowerCase().includes(location.toLowerCase()) ||
        space.space_name.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Availability filter
    if (availability && availability !== "all") {
      filtered = filtered.filter(space => {
        const status = getAvailabilityStatus(space);
        return status === availability;
      });
    }

    // Price range filter
    filtered = filtered.filter(space =>
      space.price_per_hour >= priceRange[0] && space.price_per_hour <= priceRange[1]
    );

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(space =>
        selectedAmenities.every(amenity =>
          space.amenities?.includes(amenity)
        )
      );
    }

    setFilteredSpaces(filtered);
  };

  const handleSearch = () => {
    console.log("Search clicked with filters:", {
      location,
      availability,
      priceRange,
      selectedAmenities
    });
    
    const filterCount = [
      location ? 1 : 0,
      availability && availability !== "all" ? 1 : 0,
      priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0,
      selectedAmenities.length > 0 ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    toast({
      title: "Filters applied",
      description: `Found ${filteredSpaces.length} parking spaces with ${filterCount} active filters`
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
        <div className="mb-8">
          <SearchFilters
            location={location}
            setLocation={setLocation}
            availability={availability}
            setAvailability={setAvailability}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ParkingSpacesList
              loading={loading}
              filteredSpaces={filteredSpaces}
              parkingSpaces={parkingSpaces}
              onRefresh={loadParkingSpaces}
            />
          </div>
          <div>
            <MapPlaceholder 
              location={filteredSpaces.length > 0 ? filteredSpaces[0].location : undefined}
              onClick={() => {
                if (filteredSpaces.length > 0) {
                  const location = filteredSpaces[0].location;
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
                  window.open(googleMapsUrl, '_blank');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
