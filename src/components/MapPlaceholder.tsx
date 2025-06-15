
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MapPlaceholderProps {
  location?: string;
  onClick?: () => void;
}

const MapPlaceholder = ({ location, onClick }: MapPlaceholderProps) => {
  // Generate Google Maps static image URL
  const getStaticMapUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=YOUR_API_KEY`;
  };

  // Fallback to show a placeholder when no location or when we don't have an API key
  const showPlaceholder = !location;

  return (
    <div className="lg:sticky lg:top-8">
      <Card className="h-96 bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="p-0 h-full">
          {showPlaceholder ? (
            <div className="bg-muted dark:bg-muted h-full rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground dark:text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p className="text-foreground dark:text-foreground">Interactive Map</p>
                <p className="text-sm">Parking locations will be displayed here</p>
              </div>
            </div>
          ) : (
            <div 
              className="relative h-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onClick}
              title="Click to get directions"
            >
              {/* For now, we'll show a styled placeholder with location info since we don't have a Google Maps API key */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 h-full flex items-center justify-center border border-green-200 dark:border-gray-600">
                <div className="text-center p-4">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Map Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{location}</p>
                  <div className="inline-flex items-center px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                    <MapPin className="h-4 w-4 mr-2" />
                    Click for Directions
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPlaceholder;
