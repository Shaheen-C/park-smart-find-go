
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface ReviewsSectionProps {
  parkingSpaceId: string;
  averageRating: number;
  totalReviews: number;
}

const ReviewsSection = ({ parkingSpaceId, averageRating, totalReviews }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { user, isSignedIn } = useAuth();

  useEffect(() => {
    fetchReviews();
    if (isSignedIn && user) {
      checkUserReview();
    }
  }, [parkingSpaceId, isSignedIn, user]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_reviews')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('parking_space_id', parkingSpaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('parking_reviews')
        .select('*')
        .eq('parking_space_id', parkingSpaceId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserReview(data);
      if (data) {
        setNewRating(data.rating);
        setNewReview(data.review_text || "");
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const submitReview = async () => {
    if (!user || newRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('parking_reviews')
          .update({
            rating: newRating,
            review_text: newReview.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const { error } = await supabase
          .from('parking_reviews')
          .insert({
            user_id: user.id,
            parking_space_id: parkingSpaceId,
            rating: newRating,
            review_text: newReview.trim() || null
          });

        if (error) throw error;
        toast.success("Review submitted successfully!");
      }

      setShowReviewForm(false);
      fetchReviews();
      checkUserReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 20 : 16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    );
  };

  const getDisplayName = (review: Review) => {
    if (review.profiles?.first_name || review.profiles?.last_name) {
      return `${review.profiles.first_name || ""} ${review.profiles.last_name || ""}`.trim();
    }
    return "Anonymous User";
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle size={20} />
          Reviews & Ratings
        </CardTitle>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isSignedIn ? (
          <div className="mb-4">
            {!showReviewForm ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                variant="outline"
                className="w-full"
              >
                {userReview ? "Edit Your Review" : "Write a Review"}
              </Button>
            ) : (
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  {renderStars(newRating, true, setNewRating)}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review (Optional)</label>
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience with this parking space..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={submitReview} disabled={loading || newRating === 0}>
                    {loading ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewRating(userReview?.rating || 0);
                      setNewReview(userReview?.review_text || "");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Please sign in to write a review
            </p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-medium text-sm">{getDisplayName(review)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-sm text-muted-foreground mt-2">{review.review_text}</p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
