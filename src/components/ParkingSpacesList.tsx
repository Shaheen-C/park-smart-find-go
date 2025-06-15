
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ParkingSpaceCard from "./ParkingSpaceCard";

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
}

interface ParkingSpacesListProps {
  loading: boolean;
  filteredSpaces: ParkingSpace[];
  parkingSpaces: ParkingSpace[];
  onRefresh: () => void;
}

const ParkingSpacesList = ({ 
  loading, 
  filteredSpaces, 
  parkingSpaces, 
  onRefresh 
}: ParkingSpacesListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {loading ? "Loading..." : `Available Parking Spaces (${filteredSpaces.length})`}
        </h2>
        {!loading && parkingSpaces.length > 0 && (
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading parking spaces...</p>
        </div>
      ) : filteredSpaces.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {parkingSpaces.length === 0 
              ? "No parking spaces listed yet. Be the first to list your space!" 
              : "No parking spaces found matching your search criteria."
            }
          </p>
          <Link to="/list-space">
            <Button className="mt-4">List Your Space</Button>
          </Link>
        </div>
      ) : (
        filteredSpaces.map((space) => (
          <ParkingSpaceCard key={space.id} space={space} />
        ))
      )}
    </div>
  );
};

export default ParkingSpacesList;
