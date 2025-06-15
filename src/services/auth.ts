
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName?: string;
  userType: 'driver' | 'owner';
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            business_name: data.businessName || null,
            user_type: data.userType
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred during registration");
      return { success: false, error };
    }
  },

  async signIn(data: SignInData) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please check your email and click the confirmation link");
        } else {
          toast.error(error.message);
        }
        return { success: false, error };
      }

      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred during sign in");
      return { success: false, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }
      toast.success("Signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred during sign out");
      return { success: false, error };
    }
  }
};
