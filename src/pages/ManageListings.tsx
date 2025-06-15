
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Trash2, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  amenities: string[];
  created_at: string;
  capacity: number;
  description: string;
  is_active: boolean;
}

const ManageListings = () => {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserParkingSpaces();
    }
  }, [user]);

  const loadUserParkingSpaces = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user parking spaces:", error);
        toast({
          title: "Error",
          description: "Failed to load your parking listings.",
          variant: "destructive"
        });
      } else {
        setParkingSpaces(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteParkingSpace = async (id: string, spaceName: string) => {
    try {
      const { error } = await supabase
        .from('parking_spaces')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error("Error deleting parking space:", error);
        toast({
          title: "Error",
          description: "Failed to delete parking listing.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `"${spaceName}" has been deleted successfully.`
        });
        loadUserParkingSpaces(); // Reload the list
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting.",
        variant: "destructive"
      });
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean, spaceName: string) => {
    try {
      const { error } = await supabase
        .from('parking_spaces')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error("Error updating parking space status:", error);
        toast({
          title: "Error",
          description: "Failed to update listing status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `"${spaceName}" has been ${!currentStatus ? 'activated' : 'deactivated'}.`
        });
        loadUserParkingSpaces(); // Reload the list
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Please log in to manage your listings.</p>
            <Link to="/login" className="block mt-4">
              <Button className="w-full">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="backdrop-blur-xl bg-black/20 dark:bg-black/20 light:bg-white/20 shadow-lg border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png" alt="Parkiko Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <BackButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Your Listings</h1>
          <p className="text-muted-foreground">View, edit, and manage your parking space listings</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading your listings...</p>
          </div>
        ) : parkingSpaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't listed any parking spaces yet.</p>
            <Link to="/list-space">
              <Button>List Your First Space</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parkingSpaces.map((space) => (
              <Card key={space.id} className={!space.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {space.space_name}
                        {!space.is_active && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {space.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-500">
                        {formatPrice(space.price_per_hour)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Capacity: {space.capacity}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {space.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {space.amenities?.slice(0, 3).map((amenity) => (
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
                  <div className="text-xs text-muted-foreground mb-4">
                    Listed on: {formatDate(space.created_at)}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/parking/${space.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleActiveStatus(space.id, space.is_active, space.space_name)}
                    >
                      {space.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Parking Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{space.space_name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteParkingSpace(space.id, space.space_name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageListings;
