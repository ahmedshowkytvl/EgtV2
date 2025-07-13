import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  GlobeIcon,
  Landmark,
  Plane,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Brain,
  BarChart3,
  TrendingUp,
  Users,
  Database,
  Filter,
  Download,
  Upload,
  Eye,
  Camera,
  ImageIcon,
  MoreHorizontal,
  CheckSquare,
  Square,
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields } from "@/lib/validateForm";
import {
  FormRequiredFieldsNote,
  FormValidationAlert,
} from "@/components/dashboard/FormValidationAlert";

// Interfaces matching our schema
interface Country {
  id: number;
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Airport {
  id: number;
  name: string;
  code: string;
  cityId: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Country validation schema
const countrySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z
    .string()
    .min(2, { message: "Code must be at least 2 characters" })
    .max(3),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      // Accept URLs starting with http/https or uploaded file paths starting with /uploads
      return val.startsWith("http") || val.startsWith("/uploads") || val.startsWith("/");
    }, { message: "Must be a valid URL or uploaded image path" }),
  active: z.boolean().default(true),
});

// City validation schema
const citySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  countryId: z.number({ message: "Country is required" }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      // Accept URLs starting with http/https or uploaded file paths starting with /uploads
      return val.startsWith("http") || val.startsWith("/uploads") || val.startsWith("/");
    }, { message: "Must be a valid URL or uploaded image path" }),
  active: z.boolean().default(true),
});

// Airport validation schema
const airportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z
    .string()
    .min(2, { message: "Code must be at least 2 characters" })
    .max(4),
  cityId: z.number({ message: "City is required" }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      // Accept URLs starting with http/https or uploaded file paths starting with /uploads
      return val.startsWith("http") || val.startsWith("/uploads") || val.startsWith("/");
    }, { message: "Must be a valid URL or uploaded image path" }),
  active: z.boolean().default(true),
});

type CountryFormValues = z.infer<typeof countrySchema>;
type CityFormValues = z.infer<typeof citySchema>;
type AirportFormValues = z.infer<typeof airportSchema>;

export default function CountryCityManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("countries");
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [airportSearchQuery, setAirportSearchQuery] = useState("");
  const [countryStatusFilter, setCountryStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [cityStatusFilter, setCityStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [airportStatusFilter, setAirportStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedCountryFilter, setSelectedCountryFilter] =
    useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateCountryDialogOpen, setIsCreateCountryDialogOpen] =
    useState(false);
  const [isCreateCityDialogOpen, setIsCreateCityDialogOpen] = useState(false);
  const [isCreateAirportDialogOpen, setIsCreateAirportDialogOpen] =
    useState(false);
  const [isEditCountryDialogOpen, setIsEditCountryDialogOpen] = useState(false);
  const [isEditCityDialogOpen, setIsEditCityDialogOpen] = useState(false);
  const [isEditAirportDialogOpen, setIsEditAirportDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [deleteCountryConfirmOpen, setDeleteCountryConfirmOpen] =
    useState(false);
  const [deleteCityConfirmOpen, setDeleteCityConfirmOpen] = useState(false);
  const [deleteAirportConfirmOpen, setDeleteAirportConfirmOpen] =
    useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isGeneratingAiData, setIsGeneratingAiData] = useState(false);
  const [aiCountryInput, setAiCountryInput] = useState("");
  
  // Image upload states
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle image upload with base64 conversion
  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadError(null);
      
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const fileType = file.type.split('/')[1];
          
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Data,
              type: fileType
            }),
          });

          if (!response.ok) {
            let errorMessage = 'Upload failed';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch {
              errorMessage = `Upload failed with status ${response.status}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          const imageUrl = result.url || result.imageUrl;
          
          if (!imageUrl) {
            throw new Error('No image URL returned from server');
          }
          
          setIsUploading(false);
          resolve(imageUrl);
        } catch (error) {
          setIsUploading(false);
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          setUploadError(errorMessage);
          reject(new Error(errorMessage));
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        const errorMessage = 'Failed to read file';
        setUploadError(errorMessage);
        reject(new Error(errorMessage));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // ImageField component for dual input (URL or upload)
  const ImageField = ({ 
    form, 
    name, 
    label, 
    description, 
    required = false,
    fieldId = 'default'
  }: { 
    form: any; 
    name: string; 
    label: string; 
    description: string; 
    required?: boolean;
    fieldId?: string;
  }) => {
    const currentValue = form.watch(name);
    const [localUploadMode, setLocalUploadMode] = useState<'url' | 'upload'>('url');
    
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            
            {/* Mode Toggle Buttons */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={localUploadMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocalUploadMode('url')}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Image URL
              </Button>
              <Button
                type="button"
                variant={localUploadMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocalUploadMode('upload')}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>

            {localUploadMode === 'url' ? (
              // URL Input Mode
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image.jpg"
                  disabled={isUploading}
                />
              </FormControl>
            ) : (
              // File Upload Mode
              <div className="space-y-3">
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleImageUpload(file);
                            field.onChange(uploadedUrl);
                          } catch (error) {
                            console.error('Upload error:', error);
                          }
                        }
                      }}
                      className="hidden"
                      id={`${fieldId}-${name}-upload`}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor={`${fieldId}-${name}-upload`}
                      className={`cursor-pointer flex flex-col items-center gap-2 ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        {isUploading ? 'Uploading...' : 'Click to upload image'}
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </span>
                    </label>
                  </div>
                </FormControl>
                
                {uploadError && (
                  <div className="text-red-600 text-sm">{uploadError}</div>
                )}
              </div>
            )}

            {/* Image Preview */}
            {currentValue && (
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
                <img
                  src={currentValue}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // AI-powered country and cities generation
  const generateCountryAndCities = useMutation({
    mutationFn: async (countryName: string) => {
      // Show initial progress toast
      toast({
        title: "🤖 AI Generation Started",
        description: `Generating comprehensive data for ${countryName} using Google Gemini...`,
      });

      const response = await fetch("/api/admin/ai-generate-country-cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate country and cities data",
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Show detailed success information
      toast({
        title: "🎉 AI Generation Complete!",
        description: `Successfully created ${data.country.name} (${data.country.code}) with ${data.cities.length} major cities including detailed tourism descriptions`,
      });

      // Show a follow-up toast with city details
      setTimeout(() => {
        const cityNames = data.cities
          .slice(0, 3)
          .map((city: any) => city.name)
          .join(", ");
        const additionalCount = data.cities.length - 3;
        toast({
          title: "📍 Cities Added",
          description: `Added cities: ${cityNames}${additionalCount > 0 ? ` and ${additionalCount} more` : ""} - all with tourism-focused descriptions`,
        });
      }, 2000);

      queryClient.invalidateQueries({ queryKey: ["/api/admin/countries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setIsAiDialogOpen(false);
      setAiCountryInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "AI Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAiGeneration = () => {
    if (!aiCountryInput.trim()) {
      toast({
        title: "Country Name Required",
        description: "Please enter a country name to generate cities",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAiData(true);
    generateCountryAndCities.mutate(aiCountryInput.trim());
  };

  // Query countries
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["/api/admin/countries"],
  });

  // Query cities
  const { data: cities = [], isLoading: isLoadingCities } = useQuery<City[]>({
    queryKey: ["/api/admin/cities"],
  });

  // Query airports
  const { data: airports = [], isLoading: isLoadingAirports } = useQuery<
    Airport[]
  >({
    queryKey: ["/api/admin/airports"],
  });

  // Advanced filtering logic with professional search capabilities
  const filteredCountries = useMemo(() => {
    if (!countries) return [];

    return countries.filter((country: Country) => {
      const matchesSearch =
        country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.description
          ?.toLowerCase()
          .includes(countrySearchQuery.toLowerCase()) ||
        false;

      const matchesStatus =
        countryStatusFilter === "all" ||
        (countryStatusFilter === "active" && country.active) ||
        (countryStatusFilter === "inactive" && !country.active);

      return matchesSearch && matchesStatus;
    });
  }, [countries, countrySearchQuery, countryStatusFilter]);

  const filteredCities = useMemo(() => {
    if (!cities) return [];

    return cities.filter((city: City) => {
      const matchesSearch =
        city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
        city.description
          ?.toLowerCase()
          .includes(citySearchQuery.toLowerCase()) ||
        false;

      const matchesStatus =
        cityStatusFilter === "all" ||
        (cityStatusFilter === "active" && city.active) ||
        (cityStatusFilter === "inactive" && !city.active);

      const matchesCountry =
        selectedCountryFilter === "all" ||
        city.countryId.toString() === selectedCountryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [cities, citySearchQuery, cityStatusFilter, selectedCountryFilter]);

  const filteredAirports = useMemo(() => {
    if (!airports) return [];

    return airports.filter((airport: Airport) => {
      const matchesSearch =
        airport.name.toLowerCase().includes(airportSearchQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(airportSearchQuery.toLowerCase()) ||
        airport.description
          ?.toLowerCase()
          .includes(airportSearchQuery.toLowerCase()) ||
        false;

      const matchesStatus =
        airportStatusFilter === "all" ||
        (airportStatusFilter === "active" && airport.active) ||
        (airportStatusFilter === "inactive" && !airport.active);

      return matchesSearch && matchesStatus;
    });
  }, [airports, airportSearchQuery, airportStatusFilter]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalCountries = countries.length;
    const activeCountries = countries.filter((c) => c.active).length;
    const totalCities = cities.length;
    const activeCities = cities.filter((c) => c.active).length;
    const totalAirports = airports.length;
    const activeAirports = airports.filter((a) => a.active).length;

    return {
      countries: {
        total: totalCountries,
        active: activeCountries,
        inactive: totalCountries - activeCountries,
      },
      cities: {
        total: totalCities,
        active: activeCities,
        inactive: totalCities - activeCities,
      },
      airports: {
        total: totalAirports,
        active: activeAirports,
        inactive: totalAirports - activeAirports,
      },
      coverage:
        Math.round((activeCities / Math.max(activeCountries, 1)) * 100) / 100,
    };
  }, [countries, cities, airports]);

  // Bulk operations
  const handleSelectAll = (items: any[], currentTab: string) => {
    const itemIds = items.map((item) => item.id);
    if (
      selectedItems.size === itemIds.length &&
      itemIds.every((id) => selectedItems.has(id))
    ) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(itemIds));
    }
  };

  const handleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedItems.size === 0) return;

    try {
      const itemIds = Array.from(selectedItems);

      for (const id of itemIds) {
        if (bulkAction === "activate" || bulkAction === "deactivate") {
          const isActive = bulkAction === "activate";

          if (activeTab === "countries") {
            await fetch(`/api/admin/countries/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: isActive }),
            });
          } else if (activeTab === "cities") {
            await fetch(`/api/admin/cities/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: isActive }),
            });
          } else if (activeTab === "airports") {
            await fetch(`/api/admin/airports/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: isActive }),
            });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/countries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airports"] });

      toast({
        title: "Bulk Action Complete",
        description: `Successfully ${bulkAction}d ${selectedItems.size} items`,
      });

      setSelectedItems(new Set());
      setBulkAction(null);
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Some items could not be updated",
        variant: "destructive",
      });
    }
  };

  // Country form
  const countryForm = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  // City form
  const cityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      countryId: 0,
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  // Airport form
  const airportForm = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      name: "",
      code: "",
      cityId: 0,
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  // Create Country Mutation
  const createCountryMutation = useMutation({
    mutationFn: async (country: CountryFormValues) => {
      const response = await fetch("/api/admin/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(country),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create country");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/countries"] });
      setIsCreateCountryDialogOpen(false);
      countryForm.reset();
      toast({
        title: "Success",
        description: "Country created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create City Mutation
  const createCityMutation = useMutation({
    mutationFn: async (city: CityFormValues) => {
      const response = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create city");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setIsCreateCityDialogOpen(false);
      cityForm.reset();
      toast({
        title: "Success",
        description: "City created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update Country Mutation
  const updateCountryMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CountryFormValues;
    }) => {
      const response = await fetch(`/api/admin/countries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update country");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/countries"] });
      setIsEditCountryDialogOpen(false);
      setSelectedCountry(null);
      toast({
        title: "Success",
        description: "Country updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update City Mutation
  const updateCityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CityFormValues }) => {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update city");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setIsEditCityDialogOpen(false);
      setSelectedCity(null);
      toast({
        title: "Success",
        description: "City updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete Country Mutation
  const deleteCountryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/countries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete country");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/countries"] });
      setDeleteCountryConfirmOpen(false);
      setSelectedCountry(null);
      toast({
        title: "Success",
        description: "Country deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete City Mutation
  const deleteCityMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete city");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setDeleteCityConfirmOpen(false);
      setSelectedCity(null);
      toast({
        title: "Success",
        description: "City deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create Airport Mutation
  const createAirportMutation = useMutation({
    mutationFn: async (airport: AirportFormValues) => {
      const response = await fetch("/api/admin/airports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airport),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create airport");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airports"] });
      setIsCreateAirportDialogOpen(false);
      airportForm.reset();
      toast({
        title: "Success",
        description: "Airport created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update Airport Mutation
  const updateAirportMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AirportFormValues;
    }) => {
      const response = await fetch(`/api/admin/airports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update airport");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airports"] });
      setIsEditAirportDialogOpen(false);
      setSelectedAirport(null);
      toast({
        title: "Success",
        description: "Airport updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete Airport Mutation
  const deleteAirportMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/airports/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete airport");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airports"] });
      setDeleteAirportConfirmOpen(false);
      setSelectedAirport(null);
      toast({
        title: "Success",
        description: "Airport deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onCreateCountrySubmit = (values: CountryFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "code"],
      {
        name: "Country Name",
        code: "Country Code",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
      {
        condition: values.code.length < 2 || values.code.length > 3,
        errorMessage: {
          title: "Invalid Country Code",
          description:
            "Country code should be 2-3 characters (e.g., US, EG, UAE)",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    createCountryMutation.mutate(values);
  };

  const onCreateCitySubmit = (values: CityFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "countryId"],
      {
        name: "City Name",
        countryId: "Country",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for country selection and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this city",
        },
        variant: "destructive",
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    createCityMutation.mutate(values);
  };

  const onCreateAirportSubmit = (values: AirportFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "code", "cityId"],
      {
        name: "Airport Name",
        code: "Airport Code",
        cityId: "City",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for city selection, code format, and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this airport",
        },
        variant: "destructive",
      },
      {
        condition: values.code.length < 2 || values.code.length > 4,
        errorMessage: {
          title: "Invalid Airport Code",
          description:
            "Airport code should be 2-4 characters (e.g., CAI, JFK, DXB)",
        },
        variant: "destructive",
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    createAirportMutation.mutate(values);
  };

  const onUpdateCountrySubmit = (values: CountryFormValues) => {
    if (!selectedCountry) {
      toast({
        title: "Update Error",
        description: "No country selected for update",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "code"],
      {
        name: "Country Name",
        code: "Country Code",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
      {
        condition: values.code.length < 2 || values.code.length > 3,
        errorMessage: {
          title: "Invalid Country Code",
          description:
            "Country code should be 2-3 characters (e.g., US, EG, UAE)",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    updateCountryMutation.mutate({ id: selectedCountry.id, data: values });
  };

  const onUpdateCitySubmit = (values: CityFormValues) => {
    if (!selectedCity) {
      toast({
        title: "Update Error",
        description: "No city selected for update",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "countryId"],
      {
        name: "City Name",
        countryId: "Country",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for country selection and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this city",
        },
        variant: "destructive",
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    updateCityMutation.mutate({ id: selectedCity.id, data: values });
  };

  const onUpdateAirportSubmit = (values: AirportFormValues) => {
    if (!selectedAirport) {
      toast({
        title: "Update Error",
        description: "No airport selected for update",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ["name", "code", "cityId"],
      {
        name: "Airport Name",
        code: "Airport Code",
        cityId: "City",
      },
    );

    if (!requiredFieldsValid) return;

    // Additional validation for city selection, code format, and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this airport",
        },
        variant: "destructive",
      },
      {
        condition: values.code.length < 2 || values.code.length > 4,
        errorMessage: {
          title: "Invalid Airport Code",
          description:
            "Airport code should be 2-4 characters (e.g., CAI, JFK, DXB)",
        },
        variant: "destructive",
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith("http") && !values.imageUrl.startsWith("/uploads/"),
        errorMessage: {
          title: "Invalid Image URL",
          description:
            "Please provide a valid URL starting with http:// or https://",
        },
        variant: "destructive",
      },
    ]);

    if (!customValidationsValid) return;

    // All validations passed, proceed with submission
    updateAirportMutation.mutate({ id: selectedAirport.id, data: values });
  };

  // Open edit dialog and prefill form
  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    countryForm.reset({
      name: country.name,
      code: country.code,
      description: country.description || "",
      imageUrl: country.imageUrl || "",
      active: country.active,
    });
    setIsEditCountryDialogOpen(true);
  };

  const handleEditCity = (city: City) => {
    setSelectedCity(city);
    cityForm.reset({
      name: city.name,
      countryId: city.countryId,
      description: city.description || "",
      imageUrl: city.imageUrl || "",
      active: city.active,
    });
    setIsEditCityDialogOpen(true);
  };

  const handleEditAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    airportForm.reset({
      name: airport.name,
      code: airport.code,
      cityId: airport.cityId,
      description: airport.description || "",
      imageUrl: airport.imageUrl || "",
      active: airport.active,
    });
    setIsEditAirportDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteCountry = (country: Country) => {
    setSelectedCountry(country);
    setDeleteCountryConfirmOpen(true);
  };

  const handleDeleteCity = (city: City) => {
    setSelectedCity(city);
    setDeleteCityConfirmOpen(true);
  };

  const handleDeleteAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setDeleteAirportConfirmOpen(true);
  };

  const confirmDeleteCountry = () => {
    if (selectedCountry) {
      deleteCountryMutation.mutate(selectedCountry.id);
    }
  };

  const confirmDeleteCity = () => {
    if (selectedCity) {
      deleteCityMutation.mutate(selectedCity.id);
    }
  };

  const confirmDeleteAirport = () => {
    if (selectedAirport) {
      deleteAirportMutation.mutate(selectedAirport.id);
    }
  };

  // Reset forms when dialogs close
  const handleCreateCountryDialogClose = (open: boolean) => {
    setIsCreateCountryDialogOpen(open);
    if (!open) {
      countryForm.reset();
    }
  };

  // Handle opening the create country dialog and ensure form is cleared
  const handleOpenCreateCountryDialog = () => {
    countryForm.reset({
      name: "",
      code: "",
      description: "",
      imageUrl: "",
      active: true,
    });
    setIsCreateCountryDialogOpen(true);
  };

  const handleCreateCityDialogClose = (open: boolean) => {
    setIsCreateCityDialogOpen(open);
    if (!open) {
      cityForm.reset();
    }
  };

  const handleEditCountryDialogClose = (open: boolean) => {
    setIsEditCountryDialogOpen(open);
    if (!open) {
      setSelectedCountry(null);
    }
  };

  const handleEditCityDialogClose = (open: boolean) => {
    setIsEditCityDialogOpen(open);
    if (!open) {
      setSelectedCity(null);
    }
  };

  const handleCreateAirportDialogClose = (open: boolean) => {
    setIsCreateAirportDialogOpen(open);
    if (!open) {
      airportForm.reset();
    }
  };

  const handleEditAirportDialogClose = (open: boolean) => {
    setIsEditAirportDialogOpen(open);
    if (!open) {
      setSelectedAirport(null);
    }
  };

  return (
    <DashboardLayout location="/admin/countries-cities">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Travel Locations Management</h1>
            <p className="text-gray-600 mt-1">
              Manage countries, cities, and airports with advanced tools
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant="outline"
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              onClick={() => setIsAiDialogOpen(true)}
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Countries</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {analytics.countries.total}
                      </p>
                      <p className="text-xs text-green-600">
                        {analytics.countries.active} active
                      </p>
                    </div>
                    <GlobeIcon className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cities</p>
                      <p className="text-2xl font-bold text-green-600">
                        {analytics.cities.total}
                      </p>
                      <p className="text-xs text-green-600">
                        {analytics.cities.active} active
                      </p>
                    </div>
                    <Landmark className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Airports</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {analytics.airports.total}
                      </p>
                      <p className="text-xs text-green-600">
                        {analytics.airports.active} active
                      </p>
                    </div>
                    <Plane className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Coverage</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {analytics.coverage}
                      </p>
                      <p className="text-xs text-gray-600">cities/country</p>
                    </div>
                    <Database className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              onClick={() => setActiveTab("countries")}
              variant={activeTab === "countries" ? "default" : "outline"}
            >
              <GlobeIcon className="w-4 h-4 mr-2" />
              Countries
            </Button>
            <Button
              onClick={() => setActiveTab("cities")}
              variant={activeTab === "cities" ? "default" : "outline"}
            >
              <Landmark className="w-4 h-4 mr-2" />
              Cities
            </Button>
            <Button
              onClick={() => setActiveTab("airports")}
              variant={activeTab === "airports" ? "default" : "outline"}
            >
              <Plane className="w-4 h-4 mr-2" />
              Airports
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border">
              <span className="text-sm text-blue-700">
                {selectedItems.size} selected
              </span>
              <Select
                value={bulkAction || ""}
                onValueChange={(value) => setBulkAction(value as any)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">Activate</SelectItem>
                  <SelectItem value="deactivate">Deactivate</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={executeBulkAction}
                disabled={!bulkAction}
                className="h-8"
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedItems(new Set())}
                className="h-8"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {activeTab === "countries" && (
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Countries ({filteredCountries.length})</CardTitle>
                  <CardDescription>
                    Manage countries available in the system
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleSelectAll(filteredCountries, "countries")
                    }
                  >
                    {selectedItems.size === filteredCountries.length &&
                    filteredCountries.length > 0 ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    Select All
                  </Button>
                </div>
              </div>

              {/* Advanced Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search countries by name, code, or description..."
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select
                  value={countryStatusFilter}
                  onValueChange={(value) =>
                    setCountryStatusFilter(value as any)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog
                open={isCreateCountryDialogOpen}
                onOpenChange={handleCreateCountryDialogClose}
              >
                <DialogTrigger asChild>
                  <Button variant="default" onClick={handleOpenCreateCountryDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Country
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Country</DialogTitle>
                    <DialogDescription>
                      Create a new country that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createCountryMutation.isError && (
                    <FormValidationAlert
                      status="error"
                      title="Failed to Create Country"
                      message={
                        createCountryMutation.error?.message ||
                        "An error occurred while creating the country."
                      }
                      className="mt-3"
                    />
                  )}
                  <Form {...countryForm}>
                    <form
                      onSubmit={countryForm.handleSubmit(onCreateCountrySubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={countryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Egypt" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={countryForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. EG" {...field} />
                              </FormControl>
                              <FormDescription>
                                2-3 letter ISO code
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={countryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the country"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <ImageField
                        form={countryForm}
                        name="imageUrl"
                        label="Country Image"
                        description="URL to an image representing the country or upload a photo"
                      />
                      <FormField
                        control={countryForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When a country is inactive, it will not be
                                visible to users on the site.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateCountryDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createCountryMutation.isPending}
                        >
                          {createCountryMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Country"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    className="pl-8"
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Code</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingCountries ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading countries...
                    </div>
                  ) : filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div
                        key={country.id}
                        className="grid grid-cols-5 p-3 hover:bg-neutral-50"
                      >
                        <div className="font-medium">{country.name}</div>
                        <div>{country.code}</div>
                        <div className="truncate">
                          {country.description || "—"}
                        </div>
                        <div className="text-center">
                          {country.active ? (
                            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                              <Check className="mr-1 h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                              <X className="mr-1 h-3 w-3" /> Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCountry(country)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCountry(country)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No countries found. Try adjusting your search or add a new
                      country.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "cities" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cities</CardTitle>
                <CardDescription>
                  Manage cities available in the system
                </CardDescription>
              </div>
              <Dialog
                open={isCreateCityDialogOpen}
                onOpenChange={handleCreateCityDialogClose}
              >
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add City
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>
                      Create a new city that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createCityMutation.isError && (
                    <FormValidationAlert
                      status="error"
                      title="Failed to Create City"
                      message={
                        createCityMutation.error?.message ||
                        "An error occurred while creating the city."
                      }
                      className="mt-3"
                    />
                  )}
                  <Form {...cityForm}>
                    <form
                      onSubmit={cityForm.handleSubmit(onCreateCitySubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={cityForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Cairo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cityForm.control}
                          name="countryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem
                                      key={country.id}
                                      value={country.id.toString()}
                                    >
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={cityForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the city"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <ImageField
                        form={cityForm}
                        name="imageUrl"
                        label="City Image"
                        description="URL to an image representing the city or upload a photo"
                        fieldId="create-city"
                      />
                      <FormField
                        control={cityForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When a city is inactive, it will not be visible
                                to users on the site.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateCityDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createCityMutation.isPending}
                        >
                          {createCityMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create City"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities..."
                    className="pl-8"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Country</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingCities ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading cities...
                    </div>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.map((city) => {
                      const country = countries.find(
                        (c) => c.id === city.countryId,
                      );
                      return (
                        <div
                          key={city.id}
                          className="grid grid-cols-5 p-3 hover:bg-neutral-50"
                        >
                          <div className="font-medium">{city.name}</div>
                          <div>{country?.name || "—"}</div>
                          <div className="truncate">
                            {city.description || "—"}
                          </div>
                          <div className="text-center">
                            {city.active ? (
                              <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                                <Check className="mr-1 h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                                <X className="mr-1 h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCity(city)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCity(city)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No cities found. Try adjusting your search or add a new
                      city.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Country Dialog */}
        <Dialog
          open={isEditCountryDialogOpen}
          onOpenChange={handleEditCountryDialogClose}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Country</DialogTitle>
              <DialogDescription>Update country information.</DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateCountryMutation.isError && (
              <FormValidationAlert
                status="error"
                title="Failed to Update Country"
                message={
                  updateCountryMutation.error?.message ||
                  "An error occurred while updating the country."
                }
                className="mt-3"
              />
            )}
            <Form {...countryForm}>
              <form
                onSubmit={countryForm.handleSubmit(onUpdateCountrySubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={countryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Egypt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={countryForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. EG" {...field} />
                        </FormControl>
                        <FormDescription>2-3 letter ISO code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={countryForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the country"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ImageField
                  form={countryForm}
                  name="imageUrl"
                  label="Country Image"
                  description="URL to an image representing the country or upload a photo"
                />
                <FormField
                  control={countryForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When a country is inactive, it will not be visible to
                          users on the site.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditCountryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCountryMutation.isPending}
                  >
                    {updateCountryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Country"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit City Dialog */}
        <Dialog
          open={isEditCityDialogOpen}
          onOpenChange={handleEditCityDialogClose}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
              <DialogDescription>Update city information.</DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateCityMutation.isError && (
              <FormValidationAlert
                status="error"
                title="Failed to Update City"
                message={
                  updateCityMutation.error?.message ||
                  "An error occurred while updating the city."
                }
                className="mt-3"
              />
            )}
            <Form {...cityForm}>
              <form
                onSubmit={cityForm.handleSubmit(onUpdateCitySubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cityForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cairo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cityForm.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.id}
                                value={country.id.toString()}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={cityForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the city"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ImageField
                  form={cityForm}
                  name="imageUrl"
                  label="City Image"
                  description="URL to an image representing the city or upload a photo"
                  fieldId="edit-city"
                />
                <FormField
                  control={cityForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When a city is inactive, it will not be visible to
                          users on the site.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditCityDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateCityMutation.isPending}>
                    {updateCityMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update City"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Country Confirmation Dialog */}
        <Dialog
          open={deleteCountryConfirmOpen}
          onOpenChange={setDeleteCountryConfirmOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCountry?.name}? This
                action cannot be undone.
                <br />
                <br />
                <span className="font-semibold text-red-600">
                  Warning:
                </span>{" "}
                Deleting a country will fail if there are cities associated with
                it. You must delete or reassign those cities first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteCountryConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteCountry}
                disabled={deleteCountryMutation.isPending}
              >
                {deleteCountryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Country"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete City Confirmation Dialog */}
        <Dialog
          open={deleteCityConfirmOpen}
          onOpenChange={setDeleteCityConfirmOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCity?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteCityConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteCity}
                disabled={deleteCityMutation.isPending}
              >
                {deleteCityMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete City"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Airports Tab */}
        {activeTab === "airports" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Airports</CardTitle>
                <CardDescription>
                  Manage airports available in the system
                </CardDescription>
              </div>
              <Dialog
                open={isCreateAirportDialogOpen}
                onOpenChange={handleCreateAirportDialogClose}
              >
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Airport
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Airport</DialogTitle>
                    <DialogDescription>
                      Create a new airport that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createAirportMutation.isError && (
                    <FormValidationAlert
                      status="error"
                      title="Failed to Create Airport"
                      message={
                        createAirportMutation.error?.message ||
                        "An error occurred while creating the airport."
                      }
                      className="mt-3"
                    />
                  )}
                  <Form {...airportForm}>
                    <form
                      onSubmit={airportForm.handleSubmit(onCreateAirportSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={airportForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Airport Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Cairo International Airport"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={airportForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Airport Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. CAI" {...field} />
                              </FormControl>
                              <FormDescription>
                                3-4 letter IATA/ICAO code
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={airportForm.control}
                        name="cityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              defaultValue={
                                field.value ? String(field.value) : undefined
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem
                                    key={city.id}
                                    value={String(city.id)}
                                  >
                                    {city.name} (
                                    {countries.find(
                                      (c) => c.id === city.countryId,
                                    )?.name || "Unknown Country"}
                                    )
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={airportForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the airport"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <ImageField
                        form={airportForm}
                        name="imageUrl"
                        label="Airport Image"
                        description="URL to an image representing the airport or upload a photo"
                        fieldId="create-airport"
                      />
                      <FormField
                        control={airportForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When an airport is inactive, it will not be
                                visible to users on the site.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateAirportDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createAirportMutation.isPending}
                        >
                          {createAirportMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Airport"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search airports..."
                    className="pl-8"
                    value={airportSearchQuery}
                    onChange={(e) => setAirportSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Code</div>
                  <div>City</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingAirports ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading airports...
                    </div>
                  ) : filteredAirports.length > 0 ? (
                    filteredAirports.map((airport) => {
                      const city = cities.find((c) => c.id === airport.cityId);
                      const country = countries.find(
                        (c) => c.id === city?.countryId,
                      );
                      return (
                        <div
                          key={airport.id}
                          className="grid grid-cols-6 p-3 hover:bg-neutral-50"
                        >
                          <div className="font-medium">{airport.name}</div>
                          <div>{airport.code}</div>
                          <div>
                            {city?.name || "—"} ({country?.name || "—"})
                          </div>
                          <div className="truncate">
                            {airport.description || "—"}
                          </div>
                          <div className="text-center">
                            {airport.active ? (
                              <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                                <Check className="mr-1 h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                                <X className="mr-1 h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAirport(airport)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAirport(airport)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No airports found. Try adjusting your search or add a new
                      airport.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Airport Dialog */}
        <Dialog
          open={isEditAirportDialogOpen}
          onOpenChange={handleEditAirportDialogClose}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Airport</DialogTitle>
              <DialogDescription>Update the airport details.</DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateAirportMutation.isError && (
              <FormValidationAlert
                status="error"
                title="Failed to Update Airport"
                message={
                  updateAirportMutation.error?.message ||
                  "An error occurred while updating the airport."
                }
                className="mt-3"
              />
            )}
            <Form {...airportForm}>
              <form
                onSubmit={airportForm.handleSubmit(onUpdateAirportSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={airportForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airport Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cairo International Airport"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={airportForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airport Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CAI" {...field} />
                        </FormControl>
                        <FormDescription>
                          3-4 letter IATA/ICAO code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={airportForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={
                          field.value ? String(field.value) : undefined
                        }
                        value={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={String(city.id)}>
                              {city.name} (
                              {countries.find((c) => c.id === city.countryId)
                                ?.name || "Unknown Country"}
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={airportForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the airport"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ImageField
                  form={airportForm}
                  name="imageUrl"
                  label="Airport Image"
                  description="URL to an image representing the airport or upload a photo"
                  fieldId="edit-airport"
                />
                <FormField
                  control={airportForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When an airport is inactive, it will not be visible to
                          users on the site.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditAirportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateAirportMutation.isPending}
                  >
                    {updateAirportMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Airport"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Airport Confirmation Dialog */}
        <AlertDialog
          open={deleteAirportConfirmOpen}
          onOpenChange={setDeleteAirportConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                airport
                {selectedAirport && (
                  <strong> {selectedAirport.name}</strong>
                )}{" "}
                from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAirport}
                disabled={deleteAirportMutation.isPending}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteAirportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AI Generation Dialog */}
        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI Country & Cities Generator
              </DialogTitle>
              <DialogDescription>
                Enter a country name and AI will automatically generate the
                country entry with its major cities for your travel platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="ai-country" className="text-sm font-medium">
                  Country Name
                </label>
                <Input
                  id="ai-country"
                  placeholder="e.g., Japan, France, Morocco..."
                  value={aiCountryInput}
                  onChange={(e) => setAiCountryInput(e.target.value)}
                  disabled={isGeneratingAiData}
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  AI will generate the country with its ISO code, description,
                  and automatically add 10-15 major cities with proper details.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAiDialogOpen(false)}
                disabled={isGeneratingAiData}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAiGeneration}
                disabled={isGeneratingAiData || !aiCountryInput.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGeneratingAiData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
