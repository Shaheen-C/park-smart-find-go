
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Truck, Bike, CreditCard, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";
import GlowingButton from "./GlowingButton";
import PulsingIcon from "./PulsingIcon";

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

interface EnhancedParkingSpaceCardProps {
  space: ParkingSpace;
  currentUserId?: string;
}

const EnhancedParkingSpaceCard = ({ space, currentUserId }: EnhancedParkingSpaceCardProps) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const getVehicleIcon = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();
    if (type.includes('car') || type.includes('sedan') || type.includes('suv')) {
      return Car;
    } else if (type.includes('truck') || type.includes('van')) {
      return Truck;
    } else if (type.includes('bike') || type.includes('motorcycle')) {
      return Bike;
    }
    return Car;
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
      <Card 
        className={`
          h-full flex flex-col transition-all duration-500 ease-in-out transform
          hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
          relative overflow-hidden
          before:absolute before:inset-0 before:bg-gradient-to-br 
          before:from-green-500/5 before:to-blue-500/5 before:opacity-0 
          hover:before:opacity-100 before:transition-opacity before:duration-300
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg animate-fade-in">{space.space_name}</CardTitle>
            <Badge className={`px-2 py-1 text-xs ${availabilityStatus.color}`}>
              {availabilityStatus.text}
            </Badge>
          </div>
          
          {space.image_urls && space.image_urls.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-lg">
              <img 
                src={space.image_urls[0]} 
                alt={space.space_name}
                className="w-full h-32 object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) => {
                  console.log('Image failed to load:', space.image_urls[0]);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-green-500">
              {formatPrice(space.price_per_hour)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span className="animate-fade-in">{space.available_spaces || 0}/{space.capacity}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-300 hover:text-green-500">
              <CreditCard size={12} />
              <span>Online</span>
            </div>
            {space.accepts_cash_on_arrival && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-300 hover:text-blue-500">
                <Banknote size={12} />
                <span>Cash</span>
              </div>
            )}
          </div>

          {hasVehicleTypes && hasVehicleCounts && (
            <div className="mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Available by Vehicle Type:</h4>
              <div className="grid grid-cols-2 gap-2">
                {space.vehicle_types.map((vehicleType, index) => {
                  const count = space.vehicle_counts?.[vehicleType] || 0;
                  const VehicleIcon = getVehicleIcon(vehicleType);
                  return (
                    <div 
                      key={vehicleType} 
                      className="flex items-center gap-1 text-xs transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <VehicleIcon size={12} />
                      <span className="truncate">{vehicleType}:</span>
                      <span className="font-medium text-green-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground text-sm mb-4 flex-1 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {space.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
            {space.amenities?.slice(0, 3).map((amenity, index) => (
              <Badge 
                key={amenity} 
                variant="secondary" 
                className="text-xs transition-all duration-300 hover:scale-110 hover:bg-green-100"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                {amenity}
              </Badge>
            ))}
            {space.amenities?.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs hover:scale-110"
                style={{ animationDelay: '900ms' }}
              >
                +{space.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '700ms' }}>
            <GlowingButton asChild variant="outline" className="flex-1">
              <Link to={`/parking/${space.id}`}>
                View Details
              </Link>
            </GlowingButton>
            {!isOwner && availabilityStatus.text !== "Full" && (
              <GlowingButton 
                onClick={() => setBookingModalOpen(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 hover:shadow-green-500/50"
              >
                <Car size={16} className="mr-2" />
                Book Now
              </GlowingButton>
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

export default EnhancedParkingSpaceCard;
