
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const FastagRecharge = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CreditCard className="h-12 w-12 text-gray-400" />
                  <Clock className="h-6 w-6 text-orange-500 absolute -top-1 -right-1 bg-white rounded-full" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-600">FASTag Recharge</CardTitle>
              <CardDescription>
                This feature is currently under development
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Coming Soon!
                </h3>
                <p className="text-orange-700 text-sm">
                  We're working hard to bring you a seamless FASTag recharge experience. 
                  This feature will be available soon with multiple payment options and instant processing.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong>Upcoming Features:</strong>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Quick recharge with saved vehicle numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Multiple payment methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Instant balance updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Transaction history</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FastagRecharge;
