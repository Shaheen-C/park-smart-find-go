
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
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
}

interface ParkingSpaceCardProps {
  space: ParkingSpace;
}

const ParkingSpaceCard = ({ space }: ParkingSpaceCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const formatAmenities = (amenities: string[]) => {
    return amenities?.slice(0, 3) || [];
  };

  const getAvailabilityStatus = () => {
    const available = space.available_spaces || 0;
    if (available === 0) {
      return { text: "Full", color: "text-red-500" };
    } else if (available <= space.capacity * 0.3) {
      return { text: "Limited", color: "text-orange-500" };
    } else {
      return { text: "Available", color: "text-green-500" };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  // Debug image URLs
  console.log("Parking space:", space.space_name);
  console.log("Image URLs:", space.image_urls);
  console.log("First image URL:", space.image_urls?.[0]);

  // Check if we have a valid image URL
  const hasValidImage = space.image_urls && 
    space.image_urls.length > 0 && 
    space.image_urls[0] && 
    space.image_urls[0].trim() !== '';

  const imageUrl = hasValidImage ? space.image_urls[0] : null;

  console.log("Has valid image:", hasValidImage);
  console.log("Using image URL:", imageUrl);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{space.space_name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {space.location}
            </CardDescription>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-green-500">
              {formatPrice(space.price_per_hour)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              <span>{space.available_spaces || 0}/{space.capacity}</span>
              <span className={`font-medium ${availabilityStatus.color}`}>
                {availabilityStatus.text}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Display image or placeholder */}
        <div className="mb-4">
          {hasValidImage ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt={space.space_name}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", imageUrl);
                }}
              />
              <div className="hidden w-full h-32 bg-muted rounded-lg items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-1 text-green-500" />
                  <p className="text-sm">Image Failed to Load</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-1 text-green-500" />
                <p className="text-sm">No Image Available</p>
                {space.image_urls && space.image_urls.length > 0 && (
                  <p className="text-xs mt-1 break-all px-2">Debug: {space.image_urls[0]}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {space.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {formatAmenities(space.amenities).map((amenity) => (
            <span key={amenity} className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">
              {amenity}
            </span>
          ))}
          {space.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{space.amenities.length - 3} more
            </span>
            )}
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            disabled={space.available_spaces === 0}
          >
            {space.available_spaces === 0 ? "Fully Booked" : "Book Now"}
          </Button>
          <Link to={`/parking/${space.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingSpaceCard;
