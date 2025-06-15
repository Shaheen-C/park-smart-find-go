
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, MapPin, X } from "lucide-react";

interface SearchFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  availability: string;
  setAvailability: (availability: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  onSearch: () => void;
}

const SearchFilters = ({
  location,
  setLocation,
  availability,
  setAvailability,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  onSearch
}: SearchFiltersProps) => {
  const commonAmenities = [
    "Security Camera",
    "24/7 Access",
    "Covered Parking",
    "EV Charging",
    "Security Guard",
    "Lighting",
    "CCTV",
    "Washroom",
    "Water",
    "Rest Area"
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setAvailability("");
    setPriceRange([0, 1000]);
    setSelectedAmenities([]);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          Find Parking Spaces
        </CardTitle>
        <CardDescription>
          Search and filter available parking spaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Location Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Availability</label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">All Spaces</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="limited">Limited Spaces</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}/hour
            </label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:bg-green-50 hover:border-green-300"
                  }`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                  {selectedAmenities.includes(amenity) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onSearch}>
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
