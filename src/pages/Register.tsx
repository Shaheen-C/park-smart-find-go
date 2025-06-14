
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, User, Building2, Eye, EyeOff, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

const Register = () => {
  // Driver form state
  const [driverForm, setDriverForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  // Owner form state
  const [ownerForm, setOwnerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [showDriverConfirmPassword, setShowDriverConfirmPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [showOwnerConfirmPassword, setShowOwnerConfirmPassword] = useState(false);

  const handleDriverRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverForm.password !== driverForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Driver registration:", driverForm);
    // Add registration logic here
  };

  const handleOwnerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerForm.password !== ownerForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Owner registration:", ownerForm);
    // Add registration logic here
  };

  const updateDriverForm = (field: string, value: string | boolean) => {
    setDriverForm(prev => ({ ...prev, [field]: value }));
  };

  const updateOwnerForm = (field: string, value: string | boolean) => {
    setOwnerForm(prev => ({ ...prev, [field]: value }));
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join ParkSmart</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
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

                {/* Driver Registration */}
                <TabsContent value="driver">
                  <form onSubmit={handleDriverRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="driver-firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <Input
                          id="driver-firstName"
                          type="text"
                          placeholder="First name"
                          value={driverForm.firstName}
                          onChange={(e) => updateDriverForm("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="driver-lastName" className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <Input
                          id="driver-lastName"
                          type="text"
                          placeholder="Last name"
                          value={driverForm.lastName}
                          onChange={(e) => updateDriverForm("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="driver-email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="driver-email"
                        type="email"
                        placeholder="Enter your email"
                        value={driverForm.email}
                        onChange={(e) => updateDriverForm("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="driver-phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="driver-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={driverForm.phone}
                          onChange={(e) => updateDriverForm("phone", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="driver-password" className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="driver-password"
                          type={showDriverPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={driverForm.password}
                          onChange={(e) => updateDriverForm("password", e.target.value)}
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
                    <div>
                      <label htmlFor="driver-confirmPassword" className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="driver-confirmPassword"
                          type={showDriverConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={driverForm.confirmPassword}
                          onChange={(e) => updateDriverForm("confirmPassword", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowDriverConfirmPassword(!showDriverConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showDriverConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="driver-terms"
                        checked={driverForm.agreeToTerms}
                        onCheckedChange={(checked) => updateDriverForm("agreeToTerms", !!checked)}
                      />
                      <label htmlFor="driver-terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!driverForm.agreeToTerms}
                    >
                      Create Driver Account
                    </Button>
                  </form>
                </TabsContent>

                {/* Owner Registration */}
                <TabsContent value="owner">
                  <form onSubmit={handleOwnerRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="owner-firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <Input
                          id="owner-firstName"
                          type="text"
                          placeholder="First name"
                          value={ownerForm.firstName}
                          onChange={(e) => updateOwnerForm("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="owner-lastName" className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <Input
                          id="owner-lastName"
                          type="text"
                          placeholder="Last name"
                          value={ownerForm.lastName}
                          onChange={(e) => updateOwnerForm("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="owner-businessName" className="block text-sm font-medium mb-2">
                        Business Name (Optional)
                      </label>
                      <Input
                        id="owner-businessName"
                        type="text"
                        placeholder="Your business name"
                        value={ownerForm.businessName}
                        onChange={(e) => updateOwnerForm("businessName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="owner-email"
                        type="email"
                        placeholder="Enter your email"
                        value={ownerForm.email}
                        onChange={(e) => updateOwnerForm("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="owner-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={ownerForm.phone}
                          onChange={(e) => updateOwnerForm("phone", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="owner-password" className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="owner-password"
                          type={showOwnerPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={ownerForm.password}
                          onChange={(e) => updateOwnerForm("password", e.target.value)}
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
                    <div>
                      <label htmlFor="owner-confirmPassword" className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="owner-confirmPassword"
                          type={showOwnerConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={ownerForm.confirmPassword}
                          onChange={(e) => updateOwnerForm("confirmPassword", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOwnerConfirmPassword(!showOwnerConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showOwnerConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="owner-terms"
                        checked={ownerForm.agreeToTerms}
                        onCheckedChange={(checked) => updateOwnerForm("agreeToTerms", !!checked)}
                      />
                      <label htmlFor="owner-terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!ownerForm.agreeToTerms}
                    >
                      Create Owner Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
