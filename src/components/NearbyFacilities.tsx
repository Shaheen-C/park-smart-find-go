
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Fuel, Navigation, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Facility {
  place_id: string;
  name: string;
  vicinity: string;
  types: string[];
  opening_hours?: {
    open_now: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  distance?: number;
  phone?: string;
}

interface NearbyFacilitiesProps {
  userLocation?: { lat: number; lng: number };
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const NearbyFacilities = ({ userLocation, onLocationUpdate }: NearbyFacilitiesProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<string>("gas_station");
  const { toast } = useToast();

  const facilityTypes = [
    { key: "gas_station", label: "Petrol Pumps", icon: Fuel },
    { key: "toilet", label: "Toilets", icon: Building },
    { key: "rest_area", label: "Rest Areas", icon: MapPin }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onLocationUpdate?.(location);
        searchNearbyFacilities(location, activeType);
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Location error",
          description: "Unable to get your current location. Please enable location services.",
          variant: "destructive"
        });
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const searchNearbyFacilities = async (location: { lat: number; lng: number }, type: string) => {
    setLoading(true);
    try {
      console.log("Searching for facilities:", { location, type });
      
      const { data, error } = await supabase.functions.invoke('nearby-facilities', {
        body: {
          lat: location.lat,
          lng: location.lng,
          type: type,
          radius: 5000 // 5km radius
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Received facilities:", data);
      
      const facilitiesData = data?.facilities || [];
      setFacilities(facilitiesData);
      
      toast({
        title: "Facilities found",
        description: `Found ${facilitiesData.length} nearby ${facilityTypes.find(f => f.key === type)?.label.toLowerCase()}`
      });
    } catch (error) {
      console.error("Error searching facilities:", error);
      toast({
        title: "Search failed",
        description: "Unable to search for nearby facilities. Please try again.",
        variant: "destructive"
      });
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      searchNearbyFacilities(userLocation, activeType);
    }
  }, [userLocation, activeType]);

  const handleFacilityTypeChange = (type: string) => {
    setActiveType(type);
    if (userLocation) {
      searchNearbyFacilities(userLocation, type);
    }
  };

  const openInMaps = (facility: Facility) => {
    const { lat, lng } = facility.geometry.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Facilities
        </CardTitle>
        <CardDescription>
          Find petrol pumps, toilets, and rest areas near you using OpenStreetMap data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Get Location Button */}
          {!userLocation && (
            <Button 
              onClick={getCurrentLocation} 
              disabled={loading}
              className="w-full"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {loading ? "Getting Location..." : "Get My Location"}
            </Button>
          )}

          {/* Facility Type Filters */}
          <div className="flex flex-wrap gap-2">
            {facilityTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Badge
                  key={type.key}
                  variant={activeType === type.key ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    activeType === type.key
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:bg-green-50 hover:border-green-300"
                  }`}
                  onClick={() => handleFacilityTypeChange(type.key)}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {type.label}
                </Badge>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching nearby facilities...</p>
            </div>
          )}

          {/* Facilities List */}
          {!loading && facilities.length > 0 && (
            <div className="space-y-3">
              {facilities.map((facility) => (
                <div
                  key={facility.place_id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{facility.name}</h4>
                      <p className="text-xs text-muted-foreground">{facility.vicinity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {facility.distance && (
                          <span className="text-xs text-muted-foreground">
                            {facility.distance.toFixed(1)} km away
                          </span>
                        )}
                        {facility.opening_hours?.open_now && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Open Now
                          </span>
                        )}
                        {facility.phone && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            📞 {facility.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInMaps(facility)}
                      className="ml-2"
                      title="Open in Google Maps"
                    >
                      <Navigation className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && facilities.length === 0 && userLocation && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No {facilityTypes.find(f => f.key === activeType)?.label.toLowerCase()} found nearby</p>
              <p className="text-xs text-muted-foreground mt-1">Try expanding your search radius or check a different facility type</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyFacilities;
