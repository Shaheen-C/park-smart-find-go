import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Car, Clock } from "lucide-react";
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
  vehicle_types: string[];
  additional_charges?: string;
}

const ParkingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [parkingSpace, setParkingSpace] = useState<ParkingSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadParkingDetails(id);
    }
  }, [id]);

  const loadParkingDetails = async (spaceId: string) => {
    setLoading(true);
    try {
      const result = await parkingService.getParkingSpaceById(spaceId);
      if (result.error) {
        toast({
          title: "Error loading parking details",
          description: "Failed to fetch parking space details. Please try again.",
          variant: "destructive"
        });
      } else {
        setParkingSpace(result.data);
      }
    } catch (error) {
      console.error("Error loading parking details:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading parking details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading parking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!parkingSpace) {
    return (
      <div className="min-h-screen bg-background">
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">Parking space not found.</p>
            <Link to="/search">
              <Button className="mt-4">Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{parkingSpace.space_name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {parkingSpace.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-green-500">
                    {formatPrice(parkingSpace.price_per_hour)}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">Capacity: {parkingSpace.capacity}</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {parkingSpace.description}
                </p>

                {parkingSpace.additional_charges && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Additional Charges:</h4>
                    <p className="text-sm text-muted-foreground">{parkingSpace.additional_charges}</p>
                  </div>
                )}

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parkingSpace.amenities?.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="bg-green-900 text-green-300">
                      {amenity}
                    </Badge>
                  ))}
                  {(!parkingSpace.amenities || parkingSpace.amenities.length === 0) && (
                    <p className="text-muted-foreground">No amenities listed</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Accepted Vehicle Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parkingSpace.vehicle_types?.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                  {(!parkingSpace.vehicle_types || parkingSpace.vehicle_types.length === 0) && (
                    <p className="text-muted-foreground">All vehicle types accepted</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{parkingSpace.contact_phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{parkingSpace.contact_email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images and Map */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                {parkingSpace.image_urls && parkingSpace.image_urls.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {parkingSpace.image_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${parkingSpace.space_name} - Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted h-48 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No photos available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-foreground">Interactive Map</p>
                    <p className="text-sm">Location: {parkingSpace.location}</p>
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

export default ParkingDetails;
