
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditParkingModal from "@/components/EditParkingModal";
import BackButton from "@/components/BackButton";
import ListingCard from "@/components/ListingCard";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useListingActions } from "@/hooks/useListingActions";

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
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { actionLoading, deleteListing, toggleActive } = useListingActions();

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

  const handleEditClick = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteListing(id, listings, setListings);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActive(id, currentStatus, listings, setListings);
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
              <ListingCard
                key={listing.id}
                listing={listing}
                onEdit={handleEditClick}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
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
