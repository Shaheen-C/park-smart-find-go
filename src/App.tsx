
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import SignInModal from "@/components/SignInModal";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ListSpace from "./pages/ListSpace";
import ParkingDetails from "./pages/ParkingDetails";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ManageListings from "./pages/ManageListings";
import NearbyFacilitiesPage from "./pages/NearbyFacilities";
import FastagRecharge from "./pages/FastagRecharge";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SignInModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/list-space" element={<ListSpace />} />
              <Route path="/manage-listings" element={<ManageListings />} />
              <Route path="/nearby-facilities" element={<NearbyFacilitiesPage />} />
              <Route path="/fastag-recharge" element={<FastagRecharge />} />
              <Route path="/about" element={<About />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
