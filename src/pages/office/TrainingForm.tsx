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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TrainingFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: string;
  status: "Active" | "Inactive";
}

const mockTrainings = [
  {
    id: "T001",
    title: "Python for Data Science",
    description: "Comprehensive training on Python programming for data analysis and machine learning",
    startDate: "2025-02-01",
    endDate: "2025-02-15",
    capacity: "30",
    status: "Active" as const
  },
  {
    id: "T002",
    title: "Project Management",
    description: "Professional project management course covering PMP methodologies and best practices",
    startDate: "2025-02-10",
    endDate: "2025-02-20",
    capacity: "25",
    status: "Active" as const
  }
];

const TrainingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TrainingFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    capacity: "",
    status: "Active"
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      setTimeout(() => {
        const training = mockTrainings.find(t => t.id === id);
        if (training) {
          setFormData({
            title: training.title,
            description: training.description,
            startDate: training.startDate,
            endDate: training.endDate,
            capacity: training.capacity,
            status: training.status
          });
        }
        setLoading(false);
      }, 500);
    }
  }, [id, isEditing]);

  const handleInputChange = (field: keyof TrainingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error("Training title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return false;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date must be after start date");
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
      toast.success(`Training ${isEditing ? "updated" : "created"} successfully`);
      navigate("/office/trainings/manage");
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
          Back to Trainings
        </Button>
        <PageHeader
          title={isEditing ? "Edit Training" : "Create Training"}
          description={isEditing ? "Update training program details" : "Add a new training program"}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <Label htmlFor="title">Training Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter training title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter training description"
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  min={formData.startDate}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  placeholder="Maximum number of participants"
                  min="1"
                  className="mt-1"
                />
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
                    {isEditing ? "Update Training" : "Create Training"}
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

export default TrainingForm;
