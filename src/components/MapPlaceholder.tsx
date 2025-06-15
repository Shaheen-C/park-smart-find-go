
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const MapPlaceholder = () => {
  return (
    <div className="lg:sticky lg:top-8">
      <Card className="h-96">
        <CardContent className="p-0 h-full">
          <div className="bg-muted h-full rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p className="text-foreground">Interactive Map</p>
              <p className="text-sm">Parking locations will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPlaceholder;
