import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import { authService } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already signed in
  if (isSignedIn) {
    navigate('/');
    return null;
  }

  const handleDriverSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await authService.signIn({
      email: driverEmail,
      password: driverPassword
    });

    setIsLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  const handleOwnerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await authService.signIn({
      email: ownerEmail,
      password: ownerPassword
    });

    setIsLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png" alt="Parkiko Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <BackButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your Parkiko account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Choose your account type to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="driver" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="driver" className="flex items-center gap-2 data-[state=active]:bg-green-600">
                    <User className="h-4 w-4" />
                    Driver
                  </TabsTrigger>
                  <TabsTrigger value="owner" className="flex items-center gap-2 data-[state=active]:bg-green-600">
                    <Building2 className="h-4 w-4" />
                    Owner
                  </TabsTrigger>
                </TabsList>

                {/* Driver Sign In */}
                <TabsContent value="driver">
                  <form onSubmit={handleDriverSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="driver-email" className="block text-sm font-medium mb-2 text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="driver-email"
                        type="email"
                        placeholder="Enter your email"
                        value={driverEmail}
                        onChange={(e) => setDriverEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="driver-password" className="block text-sm font-medium mb-2 text-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="driver-password"
                          type={showDriverPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={driverPassword}
                          onChange={(e) => setDriverPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowDriverPassword(!showDriverPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showDriverPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In as Driver"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Owner Sign In */}
                <TabsContent value="owner">
                  <form onSubmit={handleOwnerSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="owner-email" className="block text-sm font-medium mb-2 text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="owner-email"
                        type="email"
                        placeholder="Enter your email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-password" className="block text-sm font-medium mb-2 text-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="owner-password"
                          type={showOwnerPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={ownerPassword}
                          onChange={(e) => setOwnerPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showOwnerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In as Owner"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-green-500 hover:text-green-400 font-medium">
                    Sign up here
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-sm text-green-500 hover:text-green-400 block mt-2">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
