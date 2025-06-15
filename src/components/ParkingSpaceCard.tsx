
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin } from "lucide-react";
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
  currentUserId?: string;
}

const ParkingSpaceCard = ({ space, currentUserId }: ParkingSpaceCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const getAvailabilityStatus = () => {
    const available = space.available_spaces || 0;
    if (available === 0) {
      return { text: "Full", color: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400" };
    } else if (available <= space.capacity * 0.3) {
      return { text: "Limited", color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" };
    } else {
      return { text: "Available", color: "text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400" };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <Card className="h-full flex flex-col bg-card dark:bg-card border-border dark:border-border">
      <CardHeader className="bg-card dark:bg-card">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-card-foreground dark:text-card-foreground">{space.space_name}</CardTitle>
          <Badge className={`px-2 py-1 text-xs ${availabilityStatus.color}`}>
            {availabilityStatus.text}
          </Badge>
        </div>
        
        {/* Location with dark theme styling */}
        <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-muted dark:bg-muted border border-border dark:border-border">
          <MapPin className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
          <span className="text-sm text-muted-foreground dark:text-muted-foreground">{space.location}</span>
        </div>
        
        {/* Display first image if available */}
        {space.image_urls && space.image_urls.length > 0 && (
          <div className="mt-3">
            <img 
              src={space.image_urls[0]} 
              alt={space.space_name}
              className="w-full h-32 object-cover rounded-lg border border-border dark:border-border"
              onError={(e) => {
                console.log('Image failed to load:', space.image_urls[0]);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col bg-card dark:bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-green-500 dark:text-green-400">
            {formatPrice(space.price_per_hour)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{space.available_spaces || 0}/{space.capacity}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-4 flex-1">
          {space.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {space.amenities?.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground">
              {amenity}
            </Badge>
          ))}
          {space.amenities?.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground">
              +{space.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white dark:text-white">
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
