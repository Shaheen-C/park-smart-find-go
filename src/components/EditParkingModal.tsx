
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VehicleAvailabilityEditor from "./VehicleAvailabilityEditor";

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
}

interface EditParkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
  onUpdate: () => void;
}

const EditParkingModal = ({ open, onOpenChange, parkingSpace, onUpdate }: EditParkingModalProps) => {
  const [vehicleCounts, setVehicleCounts] = useState<{ [key: string]: number }>(
    parkingSpace.vehicle_counts || {}
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAvailable = Object.values(vehicleCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalAvailable > parkingSpace.capacity) {
      toast({
        title: "Invalid value",
        description: `Total available spaces cannot exceed capacity of ${parkingSpace.capacity}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .update({ 
          vehicle_counts: vehicleCounts,
          available_spaces: totalAvailable
        })
        .eq("id", parkingSpace.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Available spaces updated successfully",
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating parking space:", error);
      toast({
        title: "Error",
        description: "Failed to update available spaces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Available Spaces</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="spaceName">Space Name</Label>
            <Input 
              id="spaceName" 
              value={parkingSpace.space_name} 
              disabled 
              className="bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Total Capacity</Label>
            <Input 
              id="capacity" 
              value={parkingSpace.capacity} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          {parkingSpace.vehicle_types && parkingSpace.vehicle_types.length > 0 ? (
            <VehicleAvailabilityEditor
              vehicleTypes={parkingSpace.vehicle_types}
              vehicleCounts={vehicleCounts}
              capacity={parkingSpace.capacity}
              onChange={setVehicleCounts}
            />
          ) : (
            <div>
              <Label htmlFor="availableSpaces">Available Spaces</Label>
              <Input
                id="availableSpaces"
                type="number"
                min="0"
                max={parkingSpace.capacity}
                value={parkingSpace.available_spaces || 0}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground mt-1">
                No vehicle types specified for this parking space
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParkingModal;
