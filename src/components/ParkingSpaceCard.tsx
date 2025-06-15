
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Edit, Users } from "lucide-react";
import { Link } from "react-router-dom";

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

interface ParkingSpaceCardProps {
  space: ParkingSpace;
  showEditButton?: boolean;
  onEdit?: (space: ParkingSpace) => void;
  currentUserId?: string;
}

const ParkingSpaceCard = ({ space, showEditButton = false, onEdit, currentUserId }: ParkingSpaceCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
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

  const handleLocationClick = () => {
    // Create Google Maps URL for directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(space.location)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const availabilityStatus = getAvailabilityStatus();
  const isOwner = currentUserId && space.user_id === currentUserId;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{space.space_name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`px-2 py-1 text-xs ${availabilityStatus.color}`}>
              {availabilityStatus.text}
            </Badge>
            {(showEditButton || isOwner) && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(space);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription 
          className="flex items-center gap-2 text-green-600 hover:text-green-700 cursor-pointer transition-colors"
          onClick={handleLocationClick}
          title="Click to get directions"
        >
          <MapPin className="h-4 w-4" />
          {space.location}
        </CardDescription>
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
        
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link to={`/parking/${space.id}`}>
            <Car className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ParkingSpaceCard;
