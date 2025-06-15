
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, MapPin, Car, Clock, Eye, EyeOff, Edit } from "lucide-react";
import BackButton from "@/components/BackButton";
import EditParkingModal from "@/components/EditParkingModal";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  description: string;
  is_active: boolean;
  created_at: string;
  vehicle_types: string[];
  vehicle_counts: { [key: string]: number };
}

const ManageListings = () => {
  const [listings, setListings] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
      return;
    }
    fetchListings();
  }, [isSignedIn, navigate]);

  const fetchListings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("parking_spaces")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setListings(listings.filter(listing => listing.id !== id));
      toast({
        title: "Success",
        description: "Parking space deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete parking space",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, is_active: !currentStatus } : listing
      ));
      
      toast({
        title: "Success",
        description: `Parking space ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "Failed to update parking space status",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setEditModalOpen(true);
  };

  const getVehicleAvailabilityDisplay = (listing: ParkingSpace) => {
    if (!listing.vehicle_types || !listing.vehicle_counts) {
      return (
        <div className="text-sm">
          <span className="font-medium">Available: {listing.available_spaces || 0}</span>
        </div>
      );
    }

    return (
      <div className="text-sm space-y-1">
        <div className="font-medium">Vehicle Availability:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {listing.vehicle_types.map((vehicleType) => {
            const count = listing.vehicle_counts[vehicleType] || 0;
            return (
              <div key={vehicleType} className="flex justify-between">
                <span className="truncate">{vehicleType}:</span>
                <span className="font-medium">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="pt-1 border-t">
          <span className="font-medium">Total: {listing.available_spaces || 0}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <BackButton />
          <div className="text-center py-8">Loading your listings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Your Listings</h1>
          <p className="text-muted-foreground">View and manage your parking spaces</p>
        </div>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't listed any parking spaces yet.</p>
              <Button onClick={() => navigate("/list-space")}>
                List Your First Space
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className={!listing.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {listing.space_name}
                        {listing.is_active ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inactive</span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {listing.location}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(listing)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(listing.id, listing.is_active)}
                      >
                        {listing.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
                            deleteListing(listing.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Capacity: {listing.capacity}</span>
                    </div>
                    <div>
                      {getVehicleAvailabilityDisplay(listing)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">₹{listing.price_per_hour}/hour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Listed: {new Date(listing.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedSpace && (
          <EditParkingModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            parkingSpace={selectedSpace}
            onUpdate={fetchListings}
          />
        )}
      </div>
    </div>
  );
};

export default ManageListings;
