
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ParkingDetails from "./pages/ParkingDetails";
import ListSpace from "./pages/ListSpace";
import ManageListings from "./pages/ManageListings";
import MyReservations from "./pages/MyReservations";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import NearbyFacilities from "./pages/NearbyFacilities";
import FastagRecharge from "./pages/FastagRecharge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/list-space" element={<ListSpace />} />
              <Route path="/manage-listings" element={<ManageListings />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/nearby-facilities" element={<NearbyFacilities />} />
              <Route path="/fastag-recharge" element={<FastagRecharge />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
