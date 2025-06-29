
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Car, Users, CreditCard, Banknote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BookingModal from "@/components/BookingModal";
import ReviewsSection from "@/components/ReviewsSection";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  precise_location?: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  description: string;
  amenities: string[];
  vehicle_types: string[];
  vehicle_counts: { [key: string]: number };
  contact_phone: string;
  contact_email: string;
  image_urls: string[];
  user_id: string;
  accepts_cash_on_arrival: boolean;
  average_rating: number;
  total_reviews: number;
}

const ParkingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState<ParkingSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchParkingSpace();
    }
  }, [id]);

  const fetchParkingSpace = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching parking space:', error);
        return;
      }

      setSpace(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/search" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft size={20} />
            Back to Search
          </Link>
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-4">Parking Space Not Found</h1>
            <p className="text-muted-foreground">This parking space may not exist or is no longer available.</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === space.user_id;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/search" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          Back to Search
        </Link>

        <div className="grid gap-6">
          {/* Main Details Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{space.space_name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin size={16} />
                    {space.location}
                    {space.precise_location && (
                      <span className="text-xs text-muted-foreground ml-2">
                        • {space.precise_location}
                      </span>
                    )}
                  </CardDescription>
                  
                  {/* Rating display */}
                  {space.total_reviews > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= Math.round(space.average_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {space.average_rating.toFixed(1)} ({space.total_reviews} review{space.total_reviews !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹{space.price_per_hour}/hour</div>
                  <Badge variant={space.available_spaces > 0 ? "default" : "destructive"} className="mt-2">
                    {space.available_spaces > 0 ? `${space.available_spaces} Available` : "Full"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Images */}
              {space.image_urls && space.image_urls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {space.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${space.space_name} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{space.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Capacity & Vehicle Types */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Car size={18} />
                    Vehicle Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="font-medium">{space.capacity} vehicles</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-medium text-green-600">{space.available_spaces}</span>
                    </div>
                    {space.vehicle_types && space.vehicle_types.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Vehicle Types & Availability:</span>
                        <div className="mt-1 space-y-1">
                          {space.vehicle_types.map((type) => (
                            <div key={type} className="flex justify-between text-sm">
                              <span>{type}:</span>
                              <span className="font-medium">{space.vehicle_counts[type] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact & Payment */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Contact & Payment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{space.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{space.contact_email}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm font-medium">Payment Methods:</span>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CreditCard size={12} />
                          Online Payment
                        </Badge>
                        {space.accepts_cash_on_arrival && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Banknote size={12} />
                            Cash on Arrival
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {space.amenities && space.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {space.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              {!isOwner && space.available_spaces > 0 && (
                <Button
                  onClick={() => setBookingModalOpen(true)}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Book This Space
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewsSection 
            parkingSpaceId={space.id}
            averageRating={space.average_rating || 0}
            totalReviews={space.total_reviews || 0}
          />
        </div>

        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          parkingSpace={space}
        />
      </div>
    </div>
  );
};

export default ParkingDetails;
