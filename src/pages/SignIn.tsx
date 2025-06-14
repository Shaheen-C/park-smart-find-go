
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, User, Building2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

const SignIn = () => {
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  const handleDriverSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Driver sign in:", { email: driverEmail, password: driverPassword });
    // Add authentication logic here
  };

  const handleOwnerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner sign in:", { email: ownerEmail, password: ownerPassword });
    // Add authentication logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
            </div>
            <BackButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your ParkSmart account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Choose your account type to continue</CardDescription>
            </CardHeader>
            <CardContent>
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

                {/* Driver Sign In */}
                <TabsContent value="driver">
                  <form onSubmit={handleDriverSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="driver-email" className="block text-sm font-medium mb-2">
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
                      <label htmlFor="driver-password" className="block text-sm font-medium mb-2">
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

                {/* Owner Sign In */}
                <TabsContent value="owner">
                  <form onSubmit={handleOwnerSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="owner-email" className="block text-sm font-medium mb-2">
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
                      <label htmlFor="owner-password" className="block text-sm font-medium mb-2">
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

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up here
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 block mt-2">
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
