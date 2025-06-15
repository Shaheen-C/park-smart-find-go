
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";
import { Clock } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Coming Soon</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 px-4">
          This feature is currently under development
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            We're Working Hard!
          </h3>
          <p className="text-orange-700 text-sm">
            This page will be available soon with amazing new features. 
            Thank you for your patience.
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <a href="/" className="text-green-500 hover:text-green-400 underline text-lg">
            Return to Home
          </a>
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
