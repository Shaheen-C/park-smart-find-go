
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";

const SignInModal = () => {
  const { showSignInModal, setShowSignInModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await authService.signIn({
      email,
      password
    });

    setIsLoading(false);
    if (result.success) {
      setShowSignInModal(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to Continue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email-modal" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email-modal"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password-modal" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password-modal"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

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
