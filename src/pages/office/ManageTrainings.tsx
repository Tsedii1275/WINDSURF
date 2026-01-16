import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Calendar, Users, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: "Active" | "Inactive";
  enrolledCount: number;
  season: string;
  isSeasonal: boolean;
}

const mockTrainings: Training[] = [
  {
    id: "T001",
    title: "Python for Data Science",
    description: "Comprehensive training on Python programming for data analysis and machine learning",
    startDate: "2025-02-01",
    endDate: "2025-02-15",
    capacity: 30,
    status: "Active",
    enrolledCount: 25,
    season: "Winter",
    isSeasonal: true
  },
  {
    id: "T002",
    title: "Project Management",
    description: "Professional project management course covering PMP methodologies and best practices",
    startDate: "2025-02-10",
    endDate: "2025-02-20",
    capacity: 25,
    status: "Active",
    enrolledCount: 18,
    season: "Winter",
    isSeasonal: true
  },
  {
    id: "T003",
    title: "Strategic Leadership",
    description: "Advanced leadership development program for managers and executives",
    startDate: "2025-01-15",
    endDate: "2025-01-25",
    capacity: 20,
    status: "Inactive",
    enrolledCount: 15,
    season: "Winter",
    isSeasonal: true
  },
  {
    id: "T004",
    title: "Digital Marketing",
    description: "Modern digital marketing strategies including social media, SEO, and content marketing",
    startDate: "2025-03-01",
    endDate: "2025-03-10",
    capacity: 35,
    status: "Active",
    enrolledCount: 12,
    season: "Spring",
    isSeasonal: true
  },
  {
    id: "T005",
    title: "Web Development Fundamentals",
    description: "Introduction to modern web development with HTML, CSS, and JavaScript",
    startDate: "2025-04-15",
    endDate: "2025-04-30",
    capacity: 40,
    status: "Active",
    enrolledCount: 8,
    season: "Spring",
    isSeasonal: true
  },
  {
    id: "T006",
    title: "Business Analytics",
    description: "Data-driven decision making and business intelligence techniques",
    startDate: "2025-06-01",
    endDate: "2025-06-15",
    capacity: 28,
    status: "Active",
    enrolledCount: 0,
    season: "Summer",
    isSeasonal: true
  },
  {
    id: "T007",
    title: "Financial Management",
    description: "Corporate finance and investment management principles",
    startDate: "2025-09-01",
    endDate: "2025-09-20",
    capacity: 32,
    status: "Active",
    enrolledCount: 0,
    season: "Fall",
    isSeasonal: true
  },
  {
    id: "T008",
    title: "Continuous Learning Program",
    description: "Ongoing professional development with flexible scheduling",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    capacity: 50,
    status: "Active",
    enrolledCount: 22,
    season: "Year-round",
    isSeasonal: false
  }
];

const ManageTrainings = () => {
  const [trainings, setTrainings] = useState(mockTrainings);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredTrainings = () => {
  let filtered = trainings.filter(training =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeTab === "available") {
    filtered = filtered.filter(t => {
      const percentage = (t.enrolledCount / t.capacity) * 100;
      return percentage < 70;
    });
  } else if (activeTab === "limited") {
    filtered = filtered.filter(t => {
      const percentage = (t.enrolledCount / t.capacity) * 100;
      return percentage >= 70 && percentage < 90;
    });
  } else if (activeTab === "full") {
    filtered = filtered.filter(t => {
      const percentage = (t.enrolledCount / t.capacity) * 100;
      return percentage >= 90;
    });
  }

  return filtered;
};

  const handleView = (id: string) => {
    const training = trainings.find(t => t.id === id);
    if (training) {
      setSelectedTraining(training);
      setShowDetailsDialog(true);
    }
  };

  const handleEdit = (id: string) => {
    const training = trainings.find(t => t.id === id);
    if (training) {
      setEditingTraining(training);
      setShowDialog(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setTrainings(trainings.filter(t => t.id !== id));
      setDeletingId(null);
      toast.success("Training deleted successfully");
    }, 1000);
  };

  const handleCreate = () => {
    setEditingTraining(null);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingTraining(null);
  };

  const handleDetailsDialogClose = () => {
    setShowDetailsDialog(false);
    setSelectedTraining(null);
  };

  const handleSave = (formData: any) => {
    if (editingTraining) {
      // Update existing training
      setTrainings(trainings.map(t => 
        t.id === editingTraining.id 
          ? { ...t, ...formData }
          : t
      ));
      toast.success("Training updated successfully");
    } else {
      // Create new training
      const newTraining: Training = {
        ...formData,
        id: `T${String(trainings.length + 1).padStart(3, '0')}`,
        enrolledCount: 0
      };
      setTrainings([...trainings, newTraining]);
      toast.success("Training created successfully");
    }
    handleDialogClose();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "success",
      Inactive: "secondary"
    } as const;
    
    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {status}
      </Badge>
    );
  };

  const getAvailabilityBadge = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    let variant: "success" | "warning" | "destructive" = "success";
    let status = "Available";
    
    if (percentage >= 90) {
      variant = "destructive";
      status = "Full";
    } else if (percentage >= 70) {
      variant = "warning";
      status = "Limited";
    }
    
    return (
      <Badge
        variant={variant}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Manage Trainings"
          description="Create, edit, and manage available training programs"
        />
        <Button onClick={handleCreate} className="bg-aau-blue hover:bg-aau-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Training
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search training titles or descriptions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-sm h-auto overflow-x-auto">
              <TabsTrigger value="all" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                All Trainings
              </TabsTrigger>
              <TabsTrigger value="available" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Available
              </TabsTrigger>
              <TabsTrigger value="limited" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Limited
              </TabsTrigger>
              <TabsTrigger value="full" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Full
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TrainingTable 
                trainings={getFilteredTrainings()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="available">
              <TrainingTable 
                trainings={getFilteredTrainings()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="limited">
              <TrainingTable 
                trainings={getFilteredTrainings()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="full">
              <TrainingTable 
                trainings={getFilteredTrainings()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Training Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTraining ? "Edit Training" : "Create Training"}
            </DialogTitle>
          </DialogHeader>
          <TrainingFormDialog 
            training={editingTraining}
            onSave={handleSave}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Training Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Training Details</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Training ID: {selectedTraining.id}</h3>
                  <p className="text-sm text-gray-600">Created: {selectedTraining.startDate}</p>
                </div>
                {getStatusBadge(selectedTraining.status)}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Training Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Title</label>
                      <p className="font-semibold">{selectedTraining.title}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-700">{selectedTraining.description}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Season</label>
                      <p className="font-semibold">{selectedTraining.season}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Type</label>
                      <p className="font-semibold">{selectedTraining.isSeasonal ? "Seasonal Training" : "Continuous/Year-round"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity & Schedule
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Capacity</label>
                      <p className="font-semibold">{selectedTraining.enrolledCount}/{selectedTraining.capacity} enrolled</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Start Date</label>
                      <p className="font-semibold">{selectedTraining.startDate}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">End Date</label>
                      <p className="font-semibold">{selectedTraining.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Availability Status</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  {getAvailabilityBadge(selectedTraining.enrolledCount, selectedTraining.capacity)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Training Table Component
interface TrainingTableProps {
  trainings: Training[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const TrainingTable = ({ trainings, onView, onEdit, onDelete, deletingId }: TrainingTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "success",
      Inactive: "secondary"
    } as const;
    
    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {status}
      </Badge>
    );
  };

  const getAvailabilityBadge = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    let variant: "success" | "warning" | "destructive" = "success";
    let status = "Available";
    
    if (percentage >= 90) {
      variant = "destructive";
      status = "Full";
    } else if (percentage >= 70) {
      variant = "warning";
      status = "Limited";
    }
    
    return (
      <Badge
        variant={variant}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 font-bold">Training Title</th>
            <th className="px-6 py-4 font-bold">Season</th>
            <th className="px-6 py-4 font-bold">Schedule</th>
            <th className="px-6 py-4 font-bold">Capacity</th>
            <th className="px-6 py-4 font-bold">Availability</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training) => (
            <tr key={training.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{training.title}</span>
                  <span className="text-[10px] text-gray-500">{training.description}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-600">{training.season}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <div className="text-xs">
                    <div className="font-medium">{training.startDate}</div>
                    <div className="text-gray-500">to {training.endDate}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{training.enrolledCount}/{training.capacity}</span>
                </div>
              </td>
              <td className="px-6 py-4">{getAvailabilityBadge(training.enrolledCount, training.capacity)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="View Details"
                    onClick={() => onView(training.id)}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="Edit"
                    onClick={() => onEdit(training.id)}
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${training.title}"? This action cannot be undone.`)) {
                        onDelete(training.id);
                      }
                    }}
                  >
                    {deletingId === training.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Training Form Dialog Component
interface TrainingFormDialogProps {
  training: Training | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TrainingFormDialog = ({ training, onSave, onCancel }: TrainingFormDialogProps) => {
  const [formData, setFormData] = useState({
    title: training?.title || "",
    description: training?.description || "",
    startDate: training?.startDate || "",
    endDate: training?.endDate || "",
    capacity: training?.capacity?.toString() || "",
    availability: training?.enrolledCount >= training?.capacity ? "Full" : 
                   training?.enrolledCount >= training?.capacity * 0.7 ? "Limited" : "Available",
    season: training?.season || "Winter",
    isSeasonal: training?.isSeasonal ?? true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Training title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }

    onSave({
      ...formData,
      capacity: parseInt(formData.capacity)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="text-sm font-medium">Training Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter training title"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter training description"
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            min={formData.startDate}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Capacity *</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            placeholder="Maximum number of participants"
            min="1"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Availability</label>
          <select
            value={formData.availability}
            onChange={(e) => handleInputChange("availability", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          >
            <option value="Available">Available</option>
            <option value="Limited">Limited</option>
            <option value="Full">Full</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Season</label>
          <select
            value={formData.season}
            onChange={(e) => handleInputChange("season", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          >
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Year-round">Year-round</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Training Type</label>
          <select
            value={formData.isSeasonal ? "seasonal" : "continuous"}
            onChange={(e) => handleInputChange("isSeasonal", e.target.value === "seasonal")}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
          >
            <option value="seasonal">Seasonal Training</option>
            <option value="continuous">Continuous/Year-round</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-aau-red mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-800">Training Information</h4>
            <p className="text-sm text-gray-600 mt-1">
              This training will be available for enrollment through the public portal. 
              Make sure all details are accurate before saving.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-aau-blue text-white rounded-md hover:bg-aau-blue/90"
        >
          {training ? "Update Training" : "Create Training"}
        </button>
      </div>
    </form>
  );
};

export default ManageTrainings;
