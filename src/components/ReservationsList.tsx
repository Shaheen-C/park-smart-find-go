
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  estimated_arrival_time: string;
  duration_hours: number;
  total_amount: number;
  reservation_status: string;
  contact_phone: string;
  vehicle_type: string;
  vehicle_number: string | null;
  special_instructions: string | null;
  created_at: string;
}

interface ReservationsListProps {
  parkingSpaceId: string;
  spaceName: string;
}

const ReservationsList = ({ parkingSpaceId, spaceName }: ReservationsListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReservations, setShowReservations] = useState(false);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("parking_reservations")
        .select("*")
        .eq("parking_space_id", parkingSpaceId)
        .order("estimated_arrival_time", { ascending: true });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showReservations) {
      fetchReservations();
    }
  }, [showReservations, parkingSpaceId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeReservations = reservations.filter(r => r.reservation_status !== "cancelled");

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReservations(!showReservations)}
        disabled={loading}
      >
        {showReservations ? "Hide" : "View"} Reservations ({activeReservations.length})
      </Button>

      {showReservations && (
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="text-center py-4">Loading reservations...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No reservations found for this parking space.
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Reservations for {spaceName}:</h4>
              {reservations.map((reservation) => (
                <Card key={reservation.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Reservation #{reservation.id.slice(0, 8)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.reservation_status)}`}>
                        {reservation.reservation_status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(reservation.estimated_arrival_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(reservation.estimated_arrival_time).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.vehicle_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.contact_phone}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span>Duration: {reservation.duration_hours} hours</span>
                        <span className="font-medium">₹{reservation.total_amount}</span>
                      </div>
                      {reservation.vehicle_number && (
                        <div className="mt-1">Vehicle: {reservation.vehicle_number}</div>
                      )}
                      {reservation.special_instructions && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          Instructions: {reservation.special_instructions}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;
