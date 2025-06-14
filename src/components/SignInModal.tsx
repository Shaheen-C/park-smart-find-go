
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SignInModal = () => {
  const { showSignInModal, setShowSignInModal, signIn } = useAuth();
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  const handleDriverSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Driver sign in:", { email: driverEmail, password: driverPassword });
    signIn(); // This will close the modal and mark user as signed in
  };

  const handleOwnerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner sign in:", { email: ownerEmail, password: ownerPassword });
    signIn(); // This will close the modal and mark user as signed in
  };

  return (
    <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to Continue</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="driver" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Driver
            </TabsTrigger>
            <TabsTrigger value="owner" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Owner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="driver">
            <form onSubmit={handleDriverSignIn} className="space-y-4">
              <div>
                <label htmlFor="driver-email-modal" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="driver-email-modal"
                  type="email"
                  placeholder="Enter your email"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="driver-password-modal" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="driver-password-modal"
                    type={showDriverPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={driverPassword}
                    onChange={(e) => setDriverPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDriverPassword(!showDriverPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showDriverPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign In as Driver
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="owner">
            <form onSubmit={handleOwnerSignIn} className="space-y-4">
              <div>
                <label htmlFor="owner-email-modal" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="owner-email-modal"
                  type="email"
                  placeholder="Enter your email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="owner-password-modal" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="owner-password-modal"
                    type={showOwnerPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showOwnerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign In as Owner
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => setShowSignInModal(false)}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
