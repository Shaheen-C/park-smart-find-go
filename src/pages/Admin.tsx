
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  Star, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Search,
  Eye,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  totalParkingSpaces: number;
  totalReservations: number;
  totalReviews: number;
  averageRating: number;
  activeSpaces: number;
}

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  is_active: boolean;
  created_at: string;
  average_rating: number;
  total_reviews: number;
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  parking_spaces: {
    space_name: string;
  };
  profiles: {
    first_name: string;
    last_name: string;
  };
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalParkingSpaces: 0,
    totalReservations: 0,
    totalReviews: 0,
    averageRating: 0,
    activeSpaces: 0
  });
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
      return;
    }
    checkAdminAccess();
  }, [isSignedIn, user, navigate]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchAdminData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch statistics
      const [usersCount, spacesCount, reservationsCount, reviewsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('parking_spaces').select('id', { count: 'exact', head: true }),
        supabase.from('parking_reservations').select('id', { count: 'exact', head: true }),
        supabase.from('parking_reviews').select('id', { count: 'exact', head: true })
      ]);

      // Fetch active spaces and average rating
      const { data: spacesData } = await supabase
        .from('parking_spaces')
        .select('is_active, average_rating')
        .eq('is_active', true);

      const activeSpaces = spacesData?.length || 0;
      const avgRating = spacesData?.reduce((sum, space) => sum + (space.average_rating || 0), 0) / (spacesData?.length || 1);

      setStats({
        totalUsers: usersCount.count || 0,
        totalParkingSpaces: spacesCount.count || 0,
        totalReservations: reservationsCount.count || 0,
        totalReviews: reviewsCount.count || 0,
        averageRating: avgRating || 0,
        activeSpaces
      });

      // Fetch parking spaces with owner details
      const { data: spaces } = await supabase
        .from('parking_spaces')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      setParkingSpaces(spaces || []);

      // Fetch recent reviews
      const { data: reviewsData } = await supabase
        .from('parking_reviews')
        .select(`
          *,
          parking_spaces (
            space_name
          ),
          profiles (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error("Failed to load admin data");
    }
  };

  const toggleSpaceStatus = async (spaceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('parking_spaces')
        .update({ is_active: !currentStatus })
        .eq('id', spaceId);

      if (error) throw error;

      setParkingSpaces(spaces =>
        spaces.map(space =>
          space.id === spaceId ? { ...space, is_active: !currentStatus } : space
        )
      );

      toast.success(`Parking space ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating space status:', error);
      toast.error("Failed to update space status");
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('parking_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews => reviews.filter(review => review.id !== reviewId));
      toast.success("Review deleted successfully");
      
      // Refresh stats
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review");
    }
  };

  const filteredSpaces = parkingSpaces.filter(space =>
    space.space_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-8">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage parking spaces, reviews, and system analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users size={16} />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Parking Spaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParkingSpaces}</div>
              <p className="text-xs text-muted-foreground">{stats.activeSpaces} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar size={16} />
                Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star size={16} />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {stats.averageRating.toFixed(1)} ⭐
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="spaces" className="space-y-4">
          <TabsList>
            <TabsTrigger value="spaces">Parking Spaces</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="spaces">
            <Card>
              <CardHeader>
                <CardTitle>Manage Parking Spaces</CardTitle>
                <CardDescription>View and manage all parking spaces in the system</CardDescription>
                <div className="flex items-center gap-2">
                  <Search size={16} />
                  <Input
                    placeholder="Search spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSpaces.map((space) => (
                    <div key={space.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{space.space_name}</h3>
                          <p className="text-sm text-muted-foreground">{space.location}</p>
                          <p className="text-xs text-muted-foreground">
                            Owner: {space.profiles?.first_name} {space.profiles?.last_name} 
                            {space.profiles?.phone && ` • ${space.profiles.phone}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={space.is_active ? "default" : "secondary"}>
                            {space.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSpaceStatus(space.id, space.is_active)}
                          >
                            {space.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <div className="font-medium">₹{space.price_per_hour}/hr</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Capacity:</span>
                          <div className="font-medium">{space.capacity}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Available:</span>
                          <div className="font-medium">{space.available_spaces}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <div className="font-medium">
                            {space.average_rating ? `${space.average_rating.toFixed(1)} ⭐` : "No ratings"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reviews</CardTitle>
                <CardDescription>Monitor and moderate user reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {review.profiles.first_name} {review.profiles.last_name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {review.parking_spaces.space_name}
                          </p>
                          {review.review_text && (
                            <p className="text-sm">{review.review_text}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteReview(review.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
