
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { reservationData } = await req.json();
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(reservationData.total_amount * 100), // Convert to cents
      currency: "inr",
      customer: customerId,
      metadata: {
        user_id: user.id,
        parking_space_id: reservationData.parking_space_id,
        duration_hours: reservationData.duration_hours.toString(),
      },
    });

    // Create reservation with payment intent ID
    const { data: reservation, error } = await supabaseClient
      .from("parking_reservations")
      .insert({
        user_id: user.id,
        parking_space_id: reservationData.parking_space_id,
        estimated_arrival_time: reservationData.estimated_arrival_time,
        duration_hours: reservationData.duration_hours,
        total_amount: reservationData.total_amount,
        payment_method: reservationData.payment_method,
        contact_phone: reservationData.contact_phone,
        vehicle_type: reservationData.vehicle_type,
        vehicle_number: reservationData.vehicle_number,
        special_instructions: reservationData.special_instructions,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      reservationId: reservation.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
