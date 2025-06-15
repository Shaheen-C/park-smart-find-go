
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import ReservationCard from "@/components/ReservationCard";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useReservationActions } from "@/hooks/useReservationActions";

interface Reservation {
  id: string;
  parking_space_id: string;
  estimated_arrival_time: string;
  duration_hours: number;
  total_amount: number;
  payment_method: string;
  reservation_status: string;
  contact_phone: string;
  vehicle_type: string;
  vehicle_number: string | null;
  special_instructions: string | null;
  created_at: string;
  cancelled_at: string | null;
  parking_spaces: {
    space_name: string;
    location: string;
  };
}

const MyReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { actionLoading, cancelReservation } = useReservationActions();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
      return;
    }
    fetchReservations();
  }, [isSignedIn, navigate]);

  const fetchReservations = async () => {
    if (!user) {
      console.log("No user found, cannot fetch reservations");
      return;
    }

    try {
      console.log("Fetching reservations for user:", user.id);
      const { data, error } = await supabase
        .from("parking_reservations")
        .select(`
          *,
          parking_spaces!inner(
            space_name,
            location
          )
        `)
        .eq("user_id", user.id)
        .order("estimated_arrival_time", { ascending: false });

      if (error) {
        console.error("Error fetching reservations:", error);
        throw error;
      }
      
      console.log("Fetched reservations:", data);
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load your reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id: string) => {
    cancelReservation(id, reservations, setReservations);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <BackButton />
          <div className="text-center py-8">Loading your reservations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Reservations</h1>
          <p className="text-muted-foreground">View and manage your parking reservations</p>
          {user && (
            <div className="mt-2 text-sm text-muted-foreground">
              Logged in as: {user.email} (ID: {user.id})
            </div>
          )}
        </div>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't made any reservations yet.</p>
              <Button onClick={() => navigate("/search")}>
                Find Parking Spaces
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancel}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
