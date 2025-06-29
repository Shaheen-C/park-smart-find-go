
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ListSpace from "./pages/ListSpace";
import ParkingDetails from "./pages/ParkingDetails";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";
import ManageListings from "./pages/ManageListings";
import FastagRecharge from "./pages/FastagRecharge";
import NearbyFacilities from "./pages/NearbyFacilities";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/list-space" element={<ListSpace />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/manage-listings" element={<ManageListings />} />
              <Route path="/fastag-recharge" element={<FastagRecharge />} />
              <Route path="/nearby-facilities" element={<NearbyFacilities />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
