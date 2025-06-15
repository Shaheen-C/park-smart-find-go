import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Users, Car, MapPin, Clock, Eye, EyeOff, Trash2 } from "lucide-react";
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
import ReservationsList from "./ReservationsList";

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

interface ListingCardProps {
  listing: ParkingSpace;
  onEdit: (space: ParkingSpace) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

const ListingCard = ({ listing, onEdit, onToggleActive, onDelete, actionLoading }: ListingCardProps) => {
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

  return (
    <Card className={!listing.is_active ? "opacity-60" : ""}>
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
              onClick={() => onEdit(listing)}
              disabled={actionLoading === listing.id}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleActive(listing.id, listing.is_active)}
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
                    onClick={() => onDelete(listing.id)}
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
        <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
        
        <ReservationsList 
          parkingSpaceId={listing.id} 
          spaceName={listing.space_name}
        />
      </CardContent>
    </Card>
  );
};

export default ListingCard;
