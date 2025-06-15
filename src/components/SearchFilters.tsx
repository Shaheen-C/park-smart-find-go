
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, Calendar, Clock, MapPin } from "lucide-react";

interface SearchFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  onSearch: () => void;
}

const SearchFilters = ({
  location,
  setLocation,
  date,
  setDate,
  time,
  setTime,
  onSearch
}: SearchFiltersProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          Find Parking Spaces
        </CardTitle>
        <CardDescription>
          Search for available parking spaces in your desired location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onSearch}>
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
