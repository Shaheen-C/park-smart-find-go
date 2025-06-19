import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, Truck, Bike, CreditCard, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";
import EnhancedParkingSpaceCard from "./EnhancedParkingSpaceCard";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  amenities: string[];
  created_at: string;
  capacity: number;
  available_spaces: number;
  description: string;
  contact_phone: string;
  contact_email: string;
  image_urls: string[];
  user_id?: string;
  vehicle_types?: string[];
  vehicle_counts?: { [key: string]: number };
  accepts_cash_on_arrival?: boolean;
}

interface ParkingSpaceCardProps {
  space: ParkingSpace;
  currentUserId?: string;
}

const ParkingSpaceCard = ({ space, currentUserId }: ParkingSpaceCardProps) => {
  // Use the enhanced version with animations
  return <EnhancedParkingSpaceCard space={space} currentUserId={currentUserId} />;
};

export default ParkingSpaceCard;
