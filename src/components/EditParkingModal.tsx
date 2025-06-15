
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  description: string;
}

interface EditParkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
  onUpdate: () => void;
}

const EditParkingModal = ({ open, onOpenChange, parkingSpace, onUpdate }: EditParkingModalProps) => {
  const [availableSpaces, setAvailableSpaces] = useState(parkingSpace.available_spaces);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (availableSpaces < 0 || availableSpaces > parkingSpace.capacity) {
      toast({
        title: "Invalid value",
        description: `Available spaces must be between 0 and ${parkingSpace.capacity}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("parking_spaces")
        .update({ available_spaces: availableSpaces })
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
      <DialogContent>
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
          <div>
            <Label htmlFor="availableSpaces">Available Spaces</Label>
            <Input
              id="availableSpaces"
              type="number"
              min="0"
              max={parkingSpace.capacity}
              value={availableSpaces}
              onChange={(e) => setAvailableSpaces(parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter number between 0 and {parkingSpace.capacity}
            </p>
          </div>
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
