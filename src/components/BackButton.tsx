
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there's a previous page in the history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no previous page, go to home
      navigate('/');
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleBack}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackButton;
