
import { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import NearbyFacilities from "@/components/NearbyFacilities";

const NearbyFacilitiesPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Nearby Facilities</h1>
            <p className="text-lg text-muted-foreground">
              Find petrol pumps, toilets, and rest areas near your location
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <NearbyFacilities 
              userLocation={userLocation}
              onLocationUpdate={setUserLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyFacilitiesPage;
