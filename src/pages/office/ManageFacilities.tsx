import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Building, Loader2, Eye, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Facility {
  id: string;
  name: string;
  type: string;
  description: string;
  availability: "Available" | "Unavailable" | "Maintenance";
  status: "Active" | "Inactive";
  capacity: number;
}

const mockFacilities: Facility[] = [
  {
    id: "F001",
    name: "Nelson Mandela Hall",
    type: "Conference Hall",
    description: "Large conference hall with seating for 200 people, equipped with audio-visual systems",
    availability: "Available",
    status: "Active",
    capacity: 200
  },
  {
    id: "F002",
    name: "ICT Center Conference Room",
    type: "Conference Room",
    description: "Modern conference room with high-speed internet and presentation equipment",
    availability: "Available",
    status: "Active",
    capacity: 50
  },
  {
    id: "F003",
    name: "Main Laboratory A",
    type: "Laboratory",
    description: "Computer laboratory with 30 workstations and specialized software",
    availability: "Unavailable",
    status: "Active",
    capacity: 30
  },
  {
    id: "F004",
    name: "Library Study Room 1",
    type: "Study Room",
    description: "Quiet study room suitable for small group meetings and workshops",
    availability: "Maintenance",
    status: "Inactive",
    capacity: 15
  },
  {
    id: "F005",
    name: "Sports Complex Gym",
    type: "Sports Facility",
    description: "Fully equipped gymnasium with modern exercise equipment and changing rooms",
    availability: "Available",
    status: "Active",
    capacity: 100
  }
];

const ManageFacilities = () => {
  const [facilities, setFacilities] = useState(mockFacilities);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredFacilities = () => {
  let filtered = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeTab === "available") {
    filtered = filtered.filter(f => f.availability === "Available");
  } else if (activeTab === "unavailable") {
    filtered = filtered.filter(f => f.availability === "Unavailable");
  } else if (activeTab === "maintenance") {
    filtered = filtered.filter(f => f.availability === "Maintenance");
  }

  return filtered;
};

  const handleView = (id: string) => {
    const facility = facilities.find(f => f.id === id);
    if (facility) {
      setSelectedFacility(facility);
      setShowDetailsDialog(true);
    }
  };

  const handleEdit = (id: string) => {
    const facility = facilities.find(f => f.id === id);
    if (facility) {
      setEditingFacility(facility);
      setShowDialog(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setFacilities(facilities.filter(f => f.id !== id));
      setDeletingId(null);
      toast.success("Facility deleted successfully");
    }, 1000);
  };

  const handleCreate = () => {
    setEditingFacility(null);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingFacility(null);
  };

  const handleDetailsDialogClose = () => {
    setShowDetailsDialog(false);
    setSelectedFacility(null);
  };

  const handleSave = (formData: any) => {
    if (editingFacility) {
      // Update existing facility
      setFacilities(facilities.map(f => 
        f.id === editingFacility.id 
          ? { ...f, ...formData }
          : f
      ));
      toast.success("Facility updated successfully");
    } else {
      // Create new facility
      const newFacility: Facility = {
        ...formData,
        id: `F${String(facilities.length + 1).padStart(3, '0')}`
      };
      setFacilities([...facilities, newFacility]);
      toast.success("Facility created successfully");
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

  const getAvailabilityBadge = (availability: string) => {
    const variants = {
      Available: "success",
      Unavailable: "destructive",
      Maintenance: "warning"
    } as const;
    
    return (
      <Badge
        variant={variants[availability as keyof typeof variants]}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {availability}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Manage Facilities"
          description="Create, edit, and manage available rental facilities"
        />
        <Button onClick={handleCreate} className="bg-aau-blue hover:bg-aau-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Facility
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facility names, types, or descriptions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-sm h-auto overflow-x-auto">
              <TabsTrigger value="all" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                All Facilities
              </TabsTrigger>
              <TabsTrigger value="available" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Available
              </TabsTrigger>
              <TabsTrigger value="unavailable" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Unavailable
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Maintenance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <FacilityTable 
                facilities={getFilteredFacilities()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="available">
              <FacilityTable 
                facilities={getFilteredFacilities()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="unavailable">
              <FacilityTable 
                facilities={getFilteredFacilities()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
            <TabsContent value="maintenance">
              <FacilityTable 
                facilities={getFilteredFacilities()} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Facility Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? "Edit Facility" : "Create Facility"}
            </DialogTitle>
          </DialogHeader>
          <FacilityFormDialog 
            facility={editingFacility}
            onSave={handleSave}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Facility Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Facility Details</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Facility ID: {selectedFacility.id}</h3>
                  <p className="text-sm text-gray-600">Type: {selectedFacility.type}</p>
                </div>
                {getAvailabilityBadge(selectedFacility.availability)}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Facility Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Name</label>
                      <p className="font-semibold">{selectedFacility.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Type</label>
                      <p className="font-semibold">{selectedFacility.type}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Capacity</label>
                      <p className="font-semibold">{selectedFacility.capacity} people</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Availability Details
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Current Status</label>
                      <div className="mt-1">{getAvailabilityBadge(selectedFacility.availability)}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Max Capacity</label>
                      <p className="font-semibold">{selectedFacility.capacity} people</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Description</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedFacility.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Facility Table Component
interface FacilityTableProps {
  facilities: Facility[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const FacilityTable = ({ facilities, onView, onEdit, onDelete, deletingId }: FacilityTableProps) => {
  const getAvailabilityBadge = (availability: string) => {
    const variants = {
      Available: "success",
      Unavailable: "destructive",
      Maintenance: "warning"
    } as const;
    
    return (
      <Badge
        variant={variants[availability as keyof typeof variants]}
        className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      >
        {availability}
      </Badge>
    );
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 font-bold">Facility Name</th>
            <th className="px-6 py-4 font-bold">Type</th>
            <th className="px-6 py-4 font-bold">Capacity</th>
            <th className="px-6 py-4 font-bold">Availability</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{facility.name}</span>
                  <span className="text-[10px] text-gray-500">{facility.description}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-600">{facility.type}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{facility.capacity} people</span>
                </div>
              </td>
              <td className="px-6 py-4">{getAvailabilityBadge(facility.availability)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="View Details"
                    onClick={() => onView(facility.id)}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="Edit"
                    onClick={() => onEdit(facility.id)}
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${facility.name}"? This action cannot be undone.`)) {
                        onDelete(facility.id);
                      }
                    }}
                  >
                    {deletingId === facility.id ? (
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

// Facility Form Dialog Component
interface FacilityFormDialogProps {
  facility: Facility | null;
  onSave: (data: any) => void;
  onCancel: () => void;
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

const FacilityFormDialog = ({ facility, onSave, onCancel }: FacilityFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: facility?.name || "",
    type: facility?.type || "",
    description: facility?.description || "",
    availability: facility?.availability || "Available" as "Available" | "Unavailable" | "Maintenance",
    capacity: facility?.capacity?.toString() || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Facility name is required");
      return;
    }
    if (!formData.type) {
      toast.error("Facility type is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
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
            <label className="text-sm font-medium">Facility Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter facility name"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Facility Type *</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
            >
              <option value="">Select facility type</option>
              {facilityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter facility description including equipment and features"
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aau-blue"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Capacity *</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            placeholder="Maximum number of people"
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
            <option value="Unavailable">Unavailable</option>
            <option value="Maintenance">Maintenance</option>
          </select>
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
          {facility ? "Update Facility" : "Create Facility"}
        </button>
      </div>
    </form>
  );
};

export default ManageFacilities;
