import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Building } from "lucide-react";
import { toast } from "sonner";

interface FacilityFormData {
  name: string;
  type: string;
  description: string;
  availability: "Available" | "Unavailable" | "Maintenance";
  status: "Active" | "Inactive";
  capacity: string;
}

const facilityTypes = [
  "Conference Hall",
  "Conference Room", 
  "Laboratory",
  "Study Room",
  "Sports Facility",
  "Auditorium",
  "Classroom",
  "Workshop",
  "Library",
  "Other"
];

const mockFacilities = [
  {
    id: "F001",
    name: "Nelson Mandela Hall",
    type: "Conference Hall",
    description: "Large conference hall with seating for 200 people, equipped with audio-visual systems",
    availability: "Available" as const,
    status: "Active" as const,
    capacity: "200"
  },
  {
    id: "F002",
    name: "ICT Center Conference Room",
    type: "Conference Room",
    description: "Modern conference room with high-speed internet and presentation equipment",
    availability: "Available" as const,
    status: "Active" as const,
    capacity: "50"
  }
];

const FacilityForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FacilityFormData>({
    name: "",
    type: "",
    description: "",
    availability: "Available",
    status: "Active",
    capacity: ""
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      setTimeout(() => {
        const facility = mockFacilities.find(f => f.id === id);
        if (facility) {
          setFormData({
            name: facility.name,
            type: facility.type,
            description: facility.description,
            availability: facility.availability,
            status: facility.status,
            capacity: facility.capacity
          });
        }
        setLoading(false);
      }, 500);
    }
  }, [id, isEditing]);

  const handleInputChange = (field: keyof FacilityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Facility name is required");
      return false;
    }
    if (!formData.type) {
      toast.error("Facility type is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      toast.error("Capacity must be at least 1");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    setTimeout(() => {
      toast.success(`Facility ${isEditing ? "updated" : "created"} successfully`);
      navigate("/office/facilities/manage");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Facilities
        </Button>
        <PageHeader
          title={isEditing ? "Edit Facility" : "Create Facility"}
          description={isEditing ? "Update facility details" : "Add a new rental facility"}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <Label htmlFor="name">Facility Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter facility name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Facility Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter facility description including equipment and features"
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  placeholder="Maximum number of people"
                  min="1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: "Available" | "Unavailable" | "Maintenance") => handleInputChange("availability", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Inactive") => handleInputChange("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-aau-red mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Facility Information</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This facility will be available for rental through the public portal. 
                    Make sure all details are accurate before saving.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-aau-blue hover:bg-aau-blue/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Facility" : "Create Facility"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityForm;
