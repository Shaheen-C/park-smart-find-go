
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Truck, Bike } from "lucide-react";

interface VehicleAvailabilityEditorProps {
  vehicleTypes: string[];
  vehicleCounts: { [key: string]: number };
  capacity: number;
  onChange: (vehicleCounts: { [key: string]: number }) => void;
}

const VehicleAvailabilityEditor = ({ 
  vehicleTypes, 
  vehicleCounts, 
  capacity, 
  onChange 
}: VehicleAvailabilityEditorProps) => {
  const [counts, setCounts] = useState<{ [key: string]: number }>(vehicleCounts || {});

  const getVehicleIcon = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();
    if (type.includes('car') || type.includes('sedan') || type.includes('suv')) {
      return <Car className="h-4 w-4" />;
    } else if (type.includes('truck') || type.includes('van')) {
      return <Truck className="h-4 w-4" />;
    } else if (type.includes('bike') || type.includes('motorcycle')) {
      return <Bike className="h-4 w-4" />;
    }
    return <Car className="h-4 w-4" />;
  };

  const handleCountChange = (vehicleType: string, value: number) => {
    const newCounts = { ...counts, [vehicleType]: Math.max(0, value) };
    setCounts(newCounts);
    onChange(newCounts);
  };

  const getTotalAvailable = () => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Available Spaces by Vehicle Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicleTypes.map((vehicleType) => (
          <div key={vehicleType} className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              {getVehicleIcon(vehicleType)}
              <Label htmlFor={`vehicle-${vehicleType}`} className="text-sm">
                {vehicleType}
              </Label>
            </div>
            <Input
              id={`vehicle-${vehicleType}`}
              type="number"
              min="0"
              value={counts[vehicleType] || 0}
              onChange={(e) => handleCountChange(vehicleType, parseInt(e.target.value) || 0)}
              className="w-20"
            />
          </div>
        ))}
        
        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Available:</span>
            <span className={`font-medium ${getTotalAvailable() > capacity ? 'text-red-500' : 'text-green-600'}`}>
              {getTotalAvailable()} / {capacity}
            </span>
          </div>
          {getTotalAvailable() > capacity && (
            <p className="text-xs text-red-500 mt-1">
              Total available spaces cannot exceed capacity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleAvailabilityEditor;
