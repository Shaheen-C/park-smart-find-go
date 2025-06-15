
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, Truck, Bike, CreditCard, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";

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
  vehicle_types?: string[];
  vehicle_counts?: { [key: string]: number };
  accepts_cash_on_arrival?: boolean;
}

interface ParkingSpaceCardProps {
  space: ParkingSpace;
  currentUserId?: string;
}

const ParkingSpaceCard = ({ space, currentUserId }: ParkingSpaceCardProps) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const getVehicleIcon = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();
    if (type.includes('car') || type.includes('sedan') || type.includes('suv')) {
      return <Car className="h-3 w-3" />;
    } else if (type.includes('truck') || type.includes('van')) {
      return <Truck className="h-3 w-3" />;
    } else if (type.includes('bike') || type.includes('motorcycle')) {
      return <Bike className="h-3 w-3" />;
    }
    return <Car className="h-3 w-3" />;
  };

  const getAvailabilityStatus = () => {
    const available = space.available_spaces || 0;
    if (available === 0) {
      return { text: "Full", color: "text-red-500 bg-red-50" };
    } else if (available <= space.capacity * 0.3) {
      return { text: "Limited", color: "text-orange-500 bg-orange-50" };
    } else {
      return { text: "Available", color: "text-green-500 bg-green-50" };
    }
  };

  const availabilityStatus = getAvailabilityStatus();
  const hasVehicleTypes = space.vehicle_types && space.vehicle_types.length > 0;
  const hasVehicleCounts = space.vehicle_counts && Object.keys(space.vehicle_counts).length > 0;
  const isOwner = currentUserId === space.user_id;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{space.space_name}</CardTitle>
            <Badge className={`px-2 py-1 text-xs ${availabilityStatus.color}`}>
              {availabilityStatus.text}
            </Badge>
          </div>
          
          {/* Display first image if available */}
          {space.image_urls && space.image_urls.length > 0 && (
            <div className="mt-3">
              <img 
                src={space.image_urls[0]} 
                alt={space.space_name}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  console.log('Image failed to load:', space.image_urls[0]);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-green-500">
              {formatPrice(space.price_per_hour)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{space.available_spaces || 0}/{space.capacity}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              <span>Online</span>
            </div>
            {space.accepts_cash_on_arrival && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Banknote className="h-3 w-3" />
                <span>Cash</span>
              </div>
            )}
          </div>

          {/* Vehicle-specific availability */}
          {hasVehicleTypes && hasVehicleCounts && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Available by Vehicle Type:</h4>
              <div className="grid grid-cols-2 gap-2">
                {space.vehicle_types.map((vehicleType) => {
                  const count = space.vehicle_counts?.[vehicleType] || 0;
                  return (
                    <div key={vehicleType} className="flex items-center gap-1 text-xs">
                      {getVehicleIcon(vehicleType)}
                      <span className="truncate">{vehicleType}:</span>
                      <span className="font-medium text-green-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground text-sm mb-4 flex-1">
            {space.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {space.amenities?.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {space.amenities?.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{space.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/parking/${space.id}`}>
                View Details
              </Link>
            </Button>
            {!isOwner && availabilityStatus.text !== "Full" && (
              <Button 
                onClick={() => setBookingModalOpen(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Car className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        parkingSpace={space}
      />
    </>
  );
};

export default ParkingSpaceCard;
