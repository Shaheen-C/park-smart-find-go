
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Car, Phone, X } from "lucide-react";
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

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => void;
  onDelete?: (id: string) => void;
  actionLoading: string | null;
}

const ReservationCard = ({ reservation, onCancel, onDelete, actionLoading }: ReservationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const arrivalDate = new Date(reservation.estimated_arrival_time);
  const isUpcoming = arrivalDate > new Date();
  const canCancel = (reservation.reservation_status === 'confirmed' || reservation.reservation_status === 'pending') && isUpcoming;
  const canDelete = reservation.reservation_status === 'cancelled';

  // Debug logging
  console.log('Reservation debug:', {
    id: reservation.id,
    status: reservation.reservation_status,
    arrivalDate: arrivalDate.toISOString(),
    isUpcoming,
    canCancel,
    canDelete
  });

  return (
    <Card className={reservation.reservation_status === 'cancelled' ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="break-words">{reservation.parking_spaces.space_name}</span>
              <span className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(reservation.reservation_status)}`}>
                {reservation.reservation_status.charAt(0).toUpperCase() + reservation.reservation_status.slice(1)}
              </span>
            </CardTitle>
            <div className="bg-gray-800 dark:bg-gray-700 rounded-lg px-3 py-2 mt-2 w-fit">
              <CardDescription className="flex items-center gap-1 text-white font-medium">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{reservation.parking_spaces.location}</span>
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground mt-1 break-all">
              Reservation ID: {reservation.id}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Always show cancel button for confirmed/pending reservations (remove upcoming restriction for testing) */}
            {(reservation.reservation_status === 'confirmed' || reservation.reservation_status === 'pending') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={actionLoading === reservation.id}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="mx-4 max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this reservation for "{reservation.parking_spaces.space_name}"? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Keep Reservation</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel(reservation.id)}
                      className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                      Cancel Reservation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canDelete && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading === reservation.id}
                    className="border-red-200 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="mx-4 max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Cancelled Reservation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this cancelled reservation for "{reservation.parking_spaces.space_name}"? 
                      This action cannot be undone and will remove it from your history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Keep</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(reservation.id)}
                      className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">
                {arrivalDate.toLocaleDateString()} at {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{reservation.duration_hours} hour{reservation.duration_hours > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm break-words">
                {reservation.vehicle_type} {reservation.vehicle_number && `(${reservation.vehicle_number})`}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm break-all">{reservation.contact_phone}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Total: ₹{reservation.total_amount}</span>
              <span className="text-muted-foreground ml-2">({reservation.payment_method.replace('_', ' ')})</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Booked: {new Date(reservation.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {reservation.special_instructions && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-sm break-words">
              <span className="font-medium">Special Instructions:</span> {reservation.special_instructions}
            </p>
          </div>
        )}

        {reservation.cancelled_at && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <span className="font-medium">Cancelled on:</span> {new Date(reservation.cancelled_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Debug info - remove this after testing */}
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Debug: Status={reservation.reservation_status}, Upcoming={isUpcoming ? 'Yes' : 'No'}, CanCancel={canCancel ? 'Yes' : 'No'}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
