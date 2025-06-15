
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Use the Supabase project's publishable key or fallback to test key
const stripePromise = loadStripe("pk_test_51QVgZLPyR3w4RmFww7i8P4Hqt9Q5Zl2KUF5VhBZLm7XFGo8j2vE3D1C2B4A6H9I0");

interface PaymentFormProps {
  clientSecret: string;
  reservationId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent = ({ clientSecret, reservationId, amount, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        toast({
          title: "Payment failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await supabase.functions.invoke('confirm-payment', {
          body: { paymentIntentId: paymentIntent.id }
        });
        
        toast({
          title: "Payment successful!",
          description: "Your parking space has been reserved.",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          You will be charged ₹{amount}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={!stripe || loading} className="flex-1">
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;
