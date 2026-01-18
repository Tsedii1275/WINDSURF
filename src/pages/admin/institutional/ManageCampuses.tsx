import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MapPin, Users, Pencil, Loader2, GraduationCap, Search, Download, Upload, Eye, Trash2, Calendar, Mail, Phone, FileText, Settings, CheckSquare, Square, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Campus {
  id: number;
  name: string;
  code: string;
  location: string;
  admin: string;
  email: string;
  phone: string;
  schools: number;
  departments: number;
  users: number;
  status: "Active" | "Inactive" | "Maintenance";
  established: string;
  area: string;
  type: string;
  description: string;
}

interface CampusFormData {
  name: string;
  code: string;
  location: string;
  admin: string;
  email: string;
  phone: string;
  established: string;
  area: string;
  type: string;
  description: string;
}

export default function ManageCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([
    {
      id: 1,
      name: "Main Campus",
      code: "MC",
      location: "Addis Ababa, Ethiopia",
      admin: "Dr. Alemayehu Mengistu",
      email: "main.campus@aau.edu.et",
      phone: "+251-111-234-567",
      schools: 8,
      departments: 25,
      users: 15000,
      status: "Active",
      established: "1950",
      area: "250 hectares",
      type: "Main Campus",
      description: "The main campus of Addis Ababa University, housing administrative offices and multiple schools."
    },
    {
      id: 2,
      name: "Engineering Campus",
      code: "EC",
      location: "Addis Ababa, Ethiopia",
      admin: "Prof. Solomon Tesfaye",
      email: "engineering.campus@aau.edu.et",
      phone: "+251-111-234-568",
      schools: 3,
      departments: 12,
      users: 5000,
      status: "Active",
      established: "1975",
      area: "150 hectares",
      type: "Specialized Campus",
      description: "Dedicated campus for engineering and technology programs with modern laboratories."
    },
    {
      id: 3,
      name: "Medical Campus",
      code: "MED",
      location: "Addis Ababa, Ethiopia",
      admin: "Dr. Almaz Kassa",
      email: "medical.campus@aau.edu.et",
      phone: "+251-111-234-569",
      schools: 2,
      departments: 8,
      users: 3000,
      status: "Active",
      established: "1965",
      area: "100 hectares",
      type: "Specialized Campus",
      description: "Medical and health sciences campus with modern teaching hospitals and research facilities."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCampuses, setSelectedCampuses] = useState<number[]>([]);
  const [addCampusDialogOpen, setAddCampusDialogOpen] = useState(false);
  const [editCampusDialogOpen, setEditCampusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"activate" | "deactivate" | "delete">("activate");
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [statusChangeCampus, setStatusChangeCampus] = useState<Campus | null>(null);

  const { toast } = useToast();

  const form = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      code: "",
      location: "",
      admin: "",
      email: "",
      phone: "",
      established: "",
      area: "",
      type: "",
      description: "",
    },
    mode: "onChange",
  });

  const editForm = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      code: "",
      location: "",
      admin: "",
      email: "",
      phone: "",
      established: "",
      area: "",
      type: "",
      description: "",
    },
    mode: "onChange",
  });

  const campusTypes = ["Main Campus", "Specialized Campus", "Satellite Campus", "Research Campus"];
  const statusOptions = ["all", "Active", "Inactive", "Maintenance"];

  const filteredCampuses = campuses.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.admin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campus.status === statusFilter;
    const matchesType = typeFilter === "all" || campus.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const validateForm = (data: CampusFormData): boolean => {
    let isValid = true;

    if (!data.name.trim()) {
      form.setError("name", { type: "manual", message: "Campus name is required" });
      isValid = false;
    }

    if (!data.code.trim()) {
      form.setError("code", { type: "manual", message: "Campus code is required" });
      isValid = false;
    }

    if (!data.location.trim()) {
      form.setError("location", { type: "manual", message: "Location is required" });
      isValid = false;
    }

    if (!data.admin.trim()) {
      form.setError("admin", { type: "manual", message: "Campus admin is required" });
      isValid = false;
    }

    if (!data.email.trim()) {
      form.setError("email", { type: "manual", message: "Email is required" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: CampusFormData) => {
    if (!validateForm(data)) {
      return;
    }

    const newCampus: Campus = {
      id: campuses.length + 1,
      ...data,
      schools: 0,
      departments: 0,
      users: 0,
      status: "Active"
    };

    setCampuses([...campuses, newCampus]);
    toast({
      title: "Success",
      description: "Campus added successfully",
    });
    form.reset();
    setAddCampusDialogOpen(false);
  };

  const handleEditCampus = (campus: Campus) => {
    setEditingCampus(campus);
    editForm.reset({
      name: campus.name,
      code: campus.code,
      location: campus.location,
      admin: campus.admin,
      email: campus.email,
      phone: campus.phone,
      established: campus.established,
      area: campus.area,
      type: campus.type,
      description: campus.description,
    });
    setEditCampusDialogOpen(true);
  };

  const handleViewDetails = (campus: Campus) => {
    setSelectedCampus(campus);
    setDetailsDialogOpen(true);
  };

  const handleStatusToggle = (campus: Campus) => {
    setStatusChangeCampus(campus);
    setStatusChangeDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeCampus) return;

    setCampuses(campuses.map(campus =>
      campus.id === statusChangeCampus.id
        ? { ...campus, status: campus.status === "Active" ? "Inactive" : "Active" }
        : campus
    ));

    toast({
      title: "Success",
      description: `Campus status updated successfully`,
    });
    setStatusChangeDialogOpen(false);
  };

  const handleUpdateCampus = async (data: CampusFormData) => {
    if (!editingCampus) return;

    setCampuses(campuses.map(campus =>
      campus.id === editingCampus.id
        ? { ...campus, ...data }
        : campus
    ));

    toast({
      title: "Success",
      description: `Campus "${data.name}" updated successfully`,
    });
    setEditCampusDialogOpen(false);
  };

  const handleDeleteCampus = (id: number) => {
    if (window.confirm("Are you sure you want to delete this campus? This action cannot be undone.")) {
      setCampuses(campuses.filter(campus => campus.id !== id));
      toast({
        title: "Success",
        description: "Campus deleted successfully",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampuses(filteredCampuses.map(campus => campus.id));
    } else {
      setSelectedCampuses([]);
    }
  };

  const handleSelectCampus = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCampuses([...selectedCampuses, id]);
    } else {
      setSelectedCampuses(selectedCampuses.filter(campusId => campusId !== id));
    }
  };

  const handleBulkAction = () => {
    if (selectedCampuses.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one campus to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    if (bulkAction === "delete") {
      if (window.confirm(`Are you sure you want to delete ${selectedCampuses.length} campus(es)? This action cannot be undone.`)) {
        setCampuses(campuses.filter(campus => !selectedCampuses.includes(campus.id)));
        toast({
          title: "Success",
          description: `${selectedCampuses.length} campus(es) deleted successfully`,
        });
        setSelectedCampuses([]);
        setBulkActionDialogOpen(false);
      }
    } else {
      const newStatus = bulkAction === "activate" ? "Active" : "Inactive";
      setCampuses(campuses.map(campus => 
        selectedCampuses.includes(campus.id) 
          ? { ...campus, status: newStatus as "Active" | "Inactive" }
          : campus
      ));
      toast({
        title: "Success",
        description: `${selectedCampuses.length} campus(es) ${bulkAction}d successfully`,
      });
      setSelectedCampuses([]);
      setBulkActionDialogOpen(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          // Simple CSV parsing for demonstration
          const newCampuses: Campus[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 6) {
              newCampuses.push({
                id: campuses.length + i,
                name: values[0]?.trim() || `Imported Campus ${i}`,
                code: values[1]?.trim() || `IMP${i}`,
                location: values[2]?.trim() || "Location",
                admin: values[3]?.trim() || "Admin",
                email: values[4]?.trim() || "email@aau.edu.et",
                phone: values[5]?.trim() || "+251-xxx-xxx-xxx",
                schools: 0,
                departments: 0,
                users: 0,
                status: "Active",
                established: "2024",
                area: "0 hectares",
                type: "Imported Campus",
                description: "Imported campus"
              });
            }
          }
          
          setCampuses([...campuses, ...newCampuses]);
          toast({
            title: "Import Successful",
            description: `${newCampuses.length} campuses imported successfully`,
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportData = () => {
    const csvContent = [
      ["Name", "Code", "Location", "Admin", "Email", "Phone", "Schools", "Departments", "Users", "Status", "Established", "Type"],
      ...filteredCampuses.map(campus => [
        campus.name,
        campus.code,
        campus.location,
        campus.admin,
        campus.email,
        campus.phone,
        campus.schools,
        campus.departments,
        campus.users,
        campus.status,
        campus.established,
        campus.type
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campuses.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Campus data exported successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      Maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.Inactive}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Campuses</h1>
          <p className="text-gray-600 mt-1">Oversee all university campuses and facilities</p>
        </div>
        <div className="flex gap-2">
          {selectedCampuses.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Bulk Actions ({selectedCampuses.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { setBulkAction("activate"); setBulkActionDialogOpen(true); }}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setBulkAction("deactivate"); setBulkActionDialogOpen(true); }}>
                  <Square className="h-4 w-4 mr-2" />
                  Deactivate Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setBulkAction("delete"); setBulkActionDialogOpen(true); }} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setAddCampusDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Campus
          </Button>
        </div>
      </div>

      {/* Campus Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campuses</p>
                <p className="text-2xl font-bold text-gray-900">{campuses.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{campuses.filter(c => c.status === "Active").length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{campuses.reduce((sum, c) => sum + c.schools, 0)}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{campuses.reduce((sum, c) => sum + c.users, 0).toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search campuses by name, code, location, or admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {campusTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campus Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campuses Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campus Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Campus Admin</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampuses.map((campus) => (
                  <TableRow key={campus.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{campus.name}</p>
                        <p className="text-sm text-gray-500">{campus.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campus.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {campus.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{campus.admin}</p>
                        <p className="text-sm text-gray-500">{campus.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{campus.schools}</TableCell>
                    <TableCell>{campus.users.toLocaleString()}</TableCell>
                    <TableCell>{campus.type}</TableCell>
                    <TableCell>{getStatusBadge(campus.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(campus)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCampus(campus)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCampus(campus.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Campus Dialog */}
      <Dialog open={addCampusDialogOpen} onOpenChange={setAddCampusDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Campus</DialogTitle>
            <DialogDescription>
              Create a new campus. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Engineering Campus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., EC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Addis Ababa, Ethiopia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="admin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Admin *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dr. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="campus@aau.edu.et" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+251-xxx-xxx-xxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="established"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Established Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1950" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 250 hectares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campus type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campusTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of campus" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setAddCampusDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Campus
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Campus Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Campus Details</DialogTitle>
          </DialogHeader>
          {selectedCampus && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus Name</Label>
                  <p className="font-semibold">{selectedCampus.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus Code</Label>
                  <p className="font-semibold">{selectedCampus.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <p className="font-semibold">{selectedCampus.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus Type</Label>
                  <p className="font-semibold">{selectedCampus.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus Admin</Label>
                  <p className="font-semibold">{selectedCampus.admin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedCampus.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedCampus.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Established</Label>
                  <p className="font-semibold">{selectedCampus.established}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus Area</Label>
                  <p className="font-semibold">{selectedCampus.area}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedCampus.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedCampus.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedCampus.schools}</p>
                  <p className="text-sm text-gray-600">Schools</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedCampus.departments}</p>
                  <p className="text-sm text-gray-600">Departments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedCampus.users.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedCampus.area}</p>
                  <p className="text-sm text-gray-600">Area</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Campus Dialog */}
      <Dialog open={editCampusDialogOpen} onOpenChange={setEditCampusDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campus</DialogTitle>
            <DialogDescription>
              Update campus information. All fields are required.
            </DialogDescription>
          </DialogHeader>

          {editingCampus && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateCampus)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Engineering Campus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., EC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Addis Ababa, Ethiopia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="admin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Admin *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="campus@aau.edu.et" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+251-xxx-xxx-xxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="established"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1950" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Area</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 250 hectares" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campusTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of campus" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditCampusDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Update Campus
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "delete" ? "Delete Selected Campuses" : `${bulkAction === "activate" ? "Activate" : "Deactivate"} Selected Campuses`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selectedCampuses.length} selected campus(es)?
              {bulkAction === "delete" && " This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={bulkAction === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
              onClick={handleBulkAction}
            >
              {bulkAction === "delete" ? "Delete" : bulkAction === "activate" ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
