
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import ThemeToggle from "@/components/ThemeToggle";

const ListSpace = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm({
    defaultValues: {
      spaceName: "",
      location: "",
      description: "",
      pricePerHour: "",
      capacity: "",
      amenities: [],
      contactPhone: "",
      contactEmail: ""
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

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img src="/lovable-uploads/acd0e8ca-8b97-42ed-beab-ce9c633d5f4e.png" alt="Parkiko Logo" className="h-6 w-auto" />
              </Link>
              <span className="text-gray-500">• List Your Space</span>
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
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
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
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
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
                          <FormLabel>Parking Space Name</FormLabel>
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
                          <FormLabel>Full Address</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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

                {/* Step 2: Pricing & Capacity */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pricePerHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Hour (₹)</FormLabel>
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
                          <FormLabel>Vehicle Capacity</FormLabel>
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
                        <label className="block text-sm font-medium mb-2">Vehicle Types Accepted</label>
                        <div className="space-y-2">
                          {["Cars", "SUVs", "Motorcycles", "Heavy Vehicles"].map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Charges</label>
                        <Input placeholder="Overnight parking: ₹200" />
                        <p className="text-xs text-gray-500 mt-1">Optional extra charges</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Amenities */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Available Amenities</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {amenityOptions.map((amenity) => (
                          <label key={amenity} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Upload Photos</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload photos of your parking space</p>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 10MB each. Minimum 3 photos required.</p>
                        <Button variant="outline" className="mt-4">Choose Files</Button>
                      </div>
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
                          <FormLabel>Contact Phone Number</FormLabel>
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
                          <FormLabel>Email Address</FormLabel>
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

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Monthly Subscription</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          List your parking space for ₹299/month. Cancel anytime.
                        </p>
                        <ul className="text-blue-700 text-sm space-y-1">
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
                      onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">
                      Submit Listing
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
