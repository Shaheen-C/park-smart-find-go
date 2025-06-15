
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const fastagSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  rechargeAmount: z.string().min(1, "Recharge amount is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
});

type FastagFormData = z.infer<typeof fastagSchema>;

const FastagRecharge = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FastagFormData>({
    resolver: zodResolver(fastagSchema),
    defaultValues: {
      vehicleNumber: "",
      rechargeAmount: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: FastagFormData) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    toast({
      title: "Recharge Successful!",
      description: `₹${data.rechargeAmount} has been added to your FASTag account.`,
    });
  };

  const resetForm = () => {
    setIsSuccess(false);
    form.reset();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-600">Recharge Successful!</CardTitle>
                <CardDescription>
                  Your FASTag has been recharged successfully. You should receive a confirmation SMS shortly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={resetForm} className="w-full">
                  Recharge Again
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">Back to Home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
              <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">FASTag Recharge</CardTitle>
              <CardDescription>
                Quickly recharge your FASTag account for seamless toll payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., KL01AB1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rechargeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recharge Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[100, 200, 500].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("rechargeAmount", amount.toString())}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Recharge Now"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FastagRecharge;
