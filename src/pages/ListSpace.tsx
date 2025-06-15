
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const ListSpace = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      spaceName: "",
      location: "",
      description: "",
      pricePerHour: "",
      capacity: "",
      amenities: [],
      contactPhone: "",
      contactEmail: "",
      vehicleTypes: [],
      additionalCharges: ""
    }
  });

  const steps = [
    { number: 1, title: "Basic Information", description: "Tell us about your parking space" },
    { number: 2, title: "Pricing & Capacity", description: "Set your rates and capacity" },
    { number: 3, title: "Amenities & Features", description: "What makes your space special?" },
    { number: 4, title: "Contact & Verification", description: "How can drivers reach you?" }
  ];

  const amenityOptions = [
    "CCTV Security",
    "24/7 Access",
    "Covered Parking",
    "Security Guard",
    "Toilet Facilities",
    "Car Wash Service",
    "Electric Vehicle Charging",
    "Disabled Access"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered");
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files.length);
      const newImages = Array.from(files);
      
      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const invalidFiles = newImages.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        console.log("Invalid file types found:", invalidFiles);
        toast({
          title: "Invalid file type",
          description: "Please upload only JPG or PNG images.",
          variant: "destructive"
        });
        return;
      }

      // Validate file sizes (10MB limit)
      const oversizedFiles = newImages.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        console.log("Oversized files found:", oversizedFiles);
        toast({
          title: "File too large",
          description: "Each image must be under 10MB.",
          variant: "destructive"
        });
        return;
      }

      console.log("Adding images to state:", newImages.length);
      setUploadedImages(prev => {
        const updated = [...prev, ...newImages];
        console.log("Total images after upload:", updated.length);
        return updated;
      });
      
      toast({
        title: "Images uploaded",
        description: `${newImages.length} image(s) added successfully.`
      });
    } else {
      console.log("No files selected");
    }
    
    // Reset the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    console.log("Removing image at index:", index);
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      console.log("Images after removal:", updated.length);
      return updated;
    });
    toast({
      title: "Image removed",
      description: "Image has been removed from your listing."
    });
  };

  const onSubmit = async (data: any) => {
    console.log("Form submission started");
    console.log("Form data:", data);
    console.log("Uploaded images:", uploadedImages.length);
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload images and form data to your backend
      console.log("Processing form submission...");
      
      toast({
        title: "Listing submitted successfully!",
        description: "Your parking space will be reviewed and published soon."
      });
      
      // Reset form and images
      form.reset();
      setUploadedImages([]);
      setCurrentStep(1);
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    console.log("Moving to next step from:", currentStep);
    
    // Basic validation before moving to next step
    if (currentStep === 1) {
      const { spaceName, location, description } = form.getValues();
      if (!spaceName || !location || !description) {
        toast({
          title: "Please fill all required fields",
          description: "Space name, location, and description are required.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      const { pricePerHour, capacity } = form.getValues();
      if (!pricePerHour || !capacity) {
        toast({
          title: "Please fill all required fields",
          description: "Price per hour and capacity are required.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 3 && uploadedImages.length < 3) {
      toast({
        title: "Minimum images required",
        description: "Please upload at least 3 photos of your parking space.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 4) {
      const { contactPhone, contactEmail } = form.getValues();
      if (!contactPhone || !contactEmail) {
        toast({
          title: "Please fill all required fields",
          description: "Contact phone and email are required.",
          variant: "destructive"
        });
        return;
      }
    }

    setCurrentStep(Math.min(steps.length, currentStep + 1));
  };

  const handleFileInputClick = () => {
    console.log("File input clicked");
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/ee3739b1-835b-43e5-bcd6-6e54bb7ee754.png" alt="Parkiko Logo" className="h-8 w-auto" />
              </Link>
              <span className="text-muted-foreground">• List Your Space</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <BackButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                  }
                `}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {step.number < steps.length && (
                  <div className={`
                    w-24 h-0.5 mx-4 
                    ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-foreground">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="spaceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Space Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Secure Residential Parking" {...field} />
                          </FormControl>
                          <FormDescription>
                            Give your parking space a descriptive name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter complete address with landmark" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide detailed address for easy navigation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <textarea 
                              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Describe your parking space, access instructions, and any special features..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pricePerHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Hour (₹) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormDescription>
                            Set competitive pricing for your area
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Capacity *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2" {...field} />
                          </FormControl>
                          <FormDescription>
                            How many vehicles can park simultaneously?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="vehicleTypes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Types Accepted</FormLabel>
                              <div className="space-y-2">
                                {["Cars", "SUVs", "Motorcycles", "Heavy Vehicles"].map((type) => (
                                  <label key={type} className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      className="rounded"
                                      onChange={(e) => {
                                        const currentTypes = field.value || [];
                                        if (e.target.checked) {
                                          field.onChange([...currentTypes, type]);
                                        } else {
                                          field.onChange(currentTypes.filter((t: string) => t !== type));
                                        }
                                      }}
                                    />
                                    <span className="text-sm">{type}</span>
                                  </label>
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="additionalCharges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Charges</FormLabel>
                              <FormControl>
                                <Input placeholder="Overnight parking: ₹200" {...field} />
                              </FormControl>
                              <FormDescription>
                                Optional extra charges
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Amenities with improved image upload */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Available Amenities</h3>
                      <FormField
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-3">
                            {amenityOptions.map((amenity) => (
                              <label key={amenity} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded"
                                  onChange={(e) => {
                                    const currentAmenities = field.value || [];
                                    if (e.target.checked) {
                                      field.onChange([...currentAmenities, amenity]);
                                    } else {
                                      field.onChange(currentAmenities.filter((a: string) => a !== amenity));
                                    }
                                  }}
                                />
                                <span className="text-sm">{amenity}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Upload Photos *</h3>
                      <div 
                        className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={handleFileInputClick}
                      >
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Click to upload photos of your parking space</p>
                        <p className="text-sm text-muted-foreground mt-2">JPG, PNG up to 10MB each. Minimum 3 photos required.</p>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button variant="outline" className="mt-4" type="button" onClick={handleFileInputClick}>
                          Choose Files
                        </Button>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Uploaded Images ({uploadedImages.length})</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => removeImage(index)}
                                  type="button"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {image.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Information */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormDescription>
                            Drivers will use this to contact you directly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            For booking confirmations and important updates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-primary mb-2">Monthly Subscription</h4>
                        <p className="text-primary/80 text-sm mb-3">
                          List your parking space for ₹299/month. Cancel anytime.
                        </p>
                        <ul className="text-primary/70 text-sm space-y-1">
                          <li>• Unlimited bookings</li>
                          <li>• 24/7 customer support</li>
                          <li>• Performance analytics</li>
                          <li>• Featured listing placement</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button 
                      type="button"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Listing"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListSpace;
