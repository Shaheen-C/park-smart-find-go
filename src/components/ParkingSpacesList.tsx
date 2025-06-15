
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ParkingSpaceCard from "./ParkingSpaceCard";
import EditParkingModal from "./EditParkingModal";
import { useAuth } from "@/hooks/useAuth";

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
  const [editingSpace, setEditingSpace] = useState<ParkingSpace | null>(null);
  const { user } = useAuth();

  const handleEditSpace = (space: ParkingSpace) => {
    setEditingSpace(space);
  };

  const handleCloseEdit = () => {
    setEditingSpace(null);
  };

  const handleSaveEdit = async () => {
    await onRefresh();
    setEditingSpace(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Parking Spaces</CardTitle>
          <CardDescription>Loading parking spaces...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Parking Spaces</CardTitle>
              <CardDescription>
                {filteredSpaces.length} space{filteredSpaces.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSpaces.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {parkingSpaces.length === 0
                  ? "No parking spaces available at the moment."
                  : "No parking spaces match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSpaces.map((space) => (
                <ParkingSpaceCard
                  key={space.id}
                  space={space}
                  onEdit={handleEditSpace}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingSpace && (
        <EditParkingModal
          space={editingSpace}
          isOpen={!!editingSpace}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ParkingSpacesList;
