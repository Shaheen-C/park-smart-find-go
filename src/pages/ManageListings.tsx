
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, Car, MapPin, Clock, Eye, EyeOff, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditParkingModal from "@/components/EditParkingModal";
import ThemeToggle from "@/components/ThemeToggle";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  description: string;
  vehicle_types: string[];
  vehicle_counts: { [key: string]: number };
  amenities: string[];
  contact_phone: string;
  contact_email: string;
  created_at: string;
  image_urls: string[];
  additional_charges?: string;
  is_active: boolean;
}

const ManageListings = () => {
  const [listings, setListings] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
    if (!user) {
      console.log("No user found, cannot fetch listings");
      return;
    }

    try {
      console.log("Fetching listings for user:", user.id);
      const { data, error } = await supabase
        .from("parking_spaces")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
      
      console.log("Fetched listings:", data);
      setListings((data || []).map(item => ({
        ...item,
        vehicle_counts: typeof item.vehicle_counts === 'object' && item.vehicle_counts !== null 
          ? item.vehicle_counts as { [key: string]: number }
          : {}
      })));
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
    if (!user) {
      console.log("No user found for delete operation");
      toast({
        title: "Error",
        description: "You must be logged in to delete listings",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting delete operation for space:", id, "user:", user.id);
      
      // First, let's check if the space exists and belongs to the user
      const { data: existingSpace, error: fetchError } = await supabase
        .from("parking_spaces")
        .select("id, user_id, space_name")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching space before delete:", fetchError);
        throw new Error("Could not find parking space");
      }

      if (!existingSpace) {
        throw new Error("Parking space not found");
      }

      if (existingSpace.user_id !== user.id) {
        throw new Error("You don't have permission to delete this parking space");
      }

      console.log("Space found and verified, proceeding with delete:", existingSpace);

      const { error: deleteError } = await supabase
        .from("parking_spaces")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting listing:", deleteError);
        throw deleteError;
      }

      console.log("Delete successful, updating local state");
      setListings(listings.filter(listing => listing.id !== id));
      toast({
        title: "Success",
        description: "Parking space deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete parking space";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    if (!user) {
      console.log("No user found for toggle operation");
      toast({
        title: "Error",
        description: "You must be logged in to modify listings",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting toggle operation for space:", id, "from", currentStatus, "to", !currentStatus, "user:", user.id);
      
      // First, let's check if the space exists and belongs to the user
      const { data: existingSpace, error: fetchError } = await supabase
        .from("parking_spaces")
        .select("id, user_id, space_name, is_active")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching space before toggle:", fetchError);
        throw new Error("Could not find parking space");
      }

      if (!existingSpace) {
        throw new Error("Parking space not found");
      }

      if (existingSpace.user_id !== user.id) {
        throw new Error("You don't have permission to modify this parking space");
      }

      console.log("Space found and verified, current status:", existingSpace.is_active, "proceeding with toggle");

      const newStatus = !currentStatus;
      const { error: updateError } = await supabase
        .from("parking_spaces")
        .update({ is_active: newStatus })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating listing:", updateError);
        throw updateError;
      }

      console.log("Toggle successful, updating local state");
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, is_active: newStatus } : listing
      ));
      
      toast({
        title: "Success",
        description: `Parking space ${newStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error in toggle operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update parking space status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
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
          {user && (
            <div className="mt-2 text-sm text-muted-foreground">
              Logged in as: {user.email} (ID: {user.id})
            </div>
          )}
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
                      <div className="bg-gray-800 dark:bg-gray-700 rounded-lg px-3 py-2 mt-2 w-fit">
                        <CardDescription className="flex items-center gap-1 text-white font-medium">
                          <MapPin className="h-4 w-4" />
                          {listing.location}
                        </CardDescription>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Space ID: {listing.id}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(listing)}
                        disabled={actionLoading === listing.id}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(listing.id, listing.is_active)}
                        disabled={actionLoading === listing.id}
                      >
                        {actionLoading === listing.id ? (
                          "Processing..."
                        ) : listing.is_active ? (
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={actionLoading === listing.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              parking space listing "{listing.space_name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteListing(listing.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
