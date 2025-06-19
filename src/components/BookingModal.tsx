
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Banknote, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ParkingSpace {
  id: string;
  space_name: string;
  price_per_hour: number;
  accepts_cash_on_arrival?: boolean;
  vehicle_types?: string[];
  additional_charges?: string;
  available_spaces?: number;
  capacity?: number;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
}

const BookingModal = ({ open, onOpenChange, parkingSpace }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    arrivalDate: "",
    arrivalTime: "",
    duration: "",
    vehicleType: "",
    vehicleNumber: "",
    contactPhone: "",
    specialInstructions: ""
  });
  const [loading, setLoading] = useState(false);
  const [currentAvailableSpaces, setCurrentAvailableSpaces] = useState(parkingSpace.available_spaces || 0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch current available spaces when modal opens
  useEffect(() => {
    if (open && parkingSpace.id) {
      fetchCurrentAvailability();
    }
  }, [open, parkingSpace.id]);

  const fetchCurrentAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('available_spaces')
        .eq('id', parkingSpace.id)
        .single();

      if (error) throw error;
      setCurrentAvailableSpaces(data?.available_spaces || 0);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const parseAdditionalCharges = () => {
    if (!parkingSpace.additional_charges) return 0;
    
    // Try to extract numeric value from additional charges string
    const matches = parkingSpace.additional_charges.match(/₹?(\d+(?:\.\d+)?)/);
    if (matches) {
      return parseFloat(matches[1]);
    }
    return 0;
  };

  const calculateTotal = () => {
    const hours = parseInt(formData.duration) || 0;
    const baseAmount = hours * parkingSpace.price_per_hour;
    const additionalAmount = parseAdditionalCharges();
    return baseAmount + additionalAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a reservation",
        variant: "destructive"
      });
      return;
    }

    if (!formData.arrivalDate || !formData.arrivalTime || !formData.duration || !formData.vehicleType || !formData.contactPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if spaces are available
    if (currentAvailableSpaces <= 0) {
      toast({
        title: "No spaces available",
        description: "This parking space is currently full. Please try another location.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const estimatedArrival = new Date(`${formData.arrivalDate}T${formData.arrivalTime}`);
      
      const reservationData = {
        parking_space_id: parkingSpace.id,
        estimated_arrival_time: estimatedArrival.toISOString(),
        duration_hours: parseInt(formData.duration),
        total_amount: calculateTotal(),
        payment_method: "cash_on_arrival",
        contact_phone: formData.contactPhone,
        vehicle_type: formData.vehicleType,
        vehicle_number: formData.vehicleNumber || null,
        special_instructions: formData.specialInstructions || null
      };

      // Create reservation with cash payment
      const { error } = await supabase
        .from("parking_reservations")
        .insert({
          user_id: user.id,
          ...reservationData,
          payment_status: 'pending',
          reservation_status: 'confirmed'
        });

      if (error) throw error;

      toast({
        title: "Reservation created!",
        description: `Your parking spot is reserved for ${formData.arrivalDate} at ${formData.arrivalTime}. Pay cash on arrival.`,
      });
      
      // Update local available spaces count
      setCurrentAvailableSpaces(prev => Math.max(0, prev - 1));
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      arrivalDate: "",
      arrivalTime: "",
      duration: "",
      vehicleType: "",
      vehicleNumber: "",
      contactPhone: "",
      specialInstructions: ""
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const baseAmount = (parseInt(formData.duration) || 0) * parkingSpace.price_per_hour;
  const additionalAmount = parseAdditionalCharges();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reserve Parking Space</DialogTitle>
        </DialogHeader>

        {/* Availability Warning */}
        {currentAvailableSpaces <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-900">No spaces available</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This parking space is currently full. Please try another location.
            </p>
          </div>
        )}

        {/* Availability Info */}
        {currentAvailableSpaces > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-900">Available Spaces</span>
              <span className="text-sm font-bold text-green-600">
                {currentAvailableSpaces} of {parkingSpace.capacity || 'N/A'}
              </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="space-name">Parking Space</Label>
            <Input 
              id="space-name" 
              value={parkingSpace.space_name} 
              disabled 
              className="bg-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="arrival-date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Arrival Date
              </Label>
              <Input
                id="arrival-date"
                type="date"
                min={today}
                value={formData.arrivalDate}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                required
                disabled={currentAvailableSpaces <= 0}
              />
            </div>
            <div>
              <Label htmlFor="arrival-time">
                <Clock className="h-4 w-4 inline mr-1" />
                Arrival Time
              </Label>
              <Input
                id="arrival-time"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                required
                disabled={currentAvailableSpaces <= 0}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (hours)</Label>
            <Select 
              value={formData.duration} 
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
              disabled={currentAvailableSpaces <= 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((hours) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    {hours} hour{hours > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicle-type">Vehicle Type</Label>
            <Select 
              value={formData.vehicleType} 
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
              disabled={currentAvailableSpaces <= 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {parkingSpace.vehicle_types && parkingSpace.vehicle_types.length > 0 ? (
                  parkingSpace.vehicle_types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle-number">Vehicle Number (Optional)</Label>
              <Input
                id="vehicle-number"
                placeholder="e.g., AB 12 CD 3456"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                disabled={currentAvailableSpaces <= 0}
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                disabled={currentAvailableSpaces <= 0}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Payment Method: Cash on Arrival</span>
            </div>
            <p className="text-sm text-blue-700">
              You will pay cash when you arrive at the parking location.
            </p>
          </div>

          <div>
            <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="special-instructions"
              placeholder="Any special requirements or instructions..."
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              rows={3}
              disabled={currentAvailableSpaces <= 0}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Base Amount ({formData.duration} hour{parseInt(formData.duration) > 1 ? 's' : ''}):</span>
                <span>₹{baseAmount}</span>
              </div>
              {additionalAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Reservation Charge:</span>
                  <span>₹{additionalAmount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
            {parkingSpace.additional_charges && (
              <p className="text-xs text-muted-foreground mt-2">
                Reservation charge: {parkingSpace.additional_charges}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || currentAvailableSpaces <= 0} 
              className="flex-1"
            >
              {loading ? "Creating Reservation..." : currentAvailableSpaces <= 0 ? "No Spaces Available" : "Reserve Now"}
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

export default BookingModal;
