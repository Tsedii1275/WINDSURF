import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MapPin, Users, Pencil, Loader2, GraduationCap, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";

interface Campus {
  id: number;
  name: string;
  location: string;
  admin: string;
  schools: number;
  users: number;
  status: boolean;
  established: string;
  description: string;
}

interface CampusFormData {
  name: string;
  location: string;
  admin: string;
  established: string;
  description: string;
}

export default function ManageCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([
    {
      id: 1,
      name: "Main Campus",
      location: "Addis Ababa, Ethiopia",
      admin: "Dr. Alemayehu Mengistu",
      schools: 8,
      users: 15000,
      status: true,
      established: "1950",
      description: "The main campus of Addis Ababa University, housing administrative offices and multiple schools."
    },
    {
      id: 2,
      name: "Engineering Campus",
      location: "Addis Ababa, Ethiopia",
      admin: "Prof. Solomon Tesfaye",
      schools: 3,
      users: 5000,
      status: true,
      established: "1975",
      description: "Dedicated campus for engineering and technology programs."
    },
    {
      id: 3,
      name: "Medical Campus",
      location: "Addis Ababa, Ethiopia",
      admin: "Dr. Almaz Kassa",
      schools: 2,
      users: 3000,
      status: true,
      established: "1965",
      description: "Medical and health sciences campus with modern facilities."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [addCampusDialogOpen, setAddCampusDialogOpen] = useState(false);
  const [editCampusDialogOpen, setEditCampusDialogOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [viewSchoolsDialogOpen, setViewSchoolsDialogOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [statusChangeCampus, setStatusChangeCampus] = useState<Campus | null>(null);

  const { toast } = useToast();

  const form = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      location: "",
      admin: "",
      established: "",
      description: "",
    },
    mode: "onChange",
  });

  const editForm = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      location: "",
      admin: "",
      established: "",
      description: "",
    },
    mode: "onChange",
  });

  const filteredCampuses = campuses.filter(campus =>
    campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = (data: CampusFormData): boolean => {
    let isValid = true;

    if (!data.name.trim()) {
      form.setError("name", { type: "manual", message: "Campus name is required" });
      isValid = false;
    } else if (data.name.trim().length < 3) {
      form.setError("name", { type: "manual", message: "Campus name must be at least 3 characters" });
      isValid = false;
    }

    if (!data.location.trim()) {
      form.setError("location", { type: "manual", message: "Location is required" });
      isValid = false;
    } else if (data.location.trim().length < 5) {
      form.setError("location", { type: "manual", message: "Location must be at least 5 characters" });
      isValid = false;
    }

    if (!data.admin.trim()) {
      form.setError("admin", { type: "manual", message: "Campus admin is required" });
      isValid = false;
    } else if (data.admin.trim().length < 3) {
      form.setError("admin", { type: "manual", message: "Admin name must be at least 3 characters" });
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
      users: 0,
      status: true
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
      location: campus.location,
      admin: campus.admin,
      established: campus.established,
      description: campus.description,
    });
    setEditCampusDialogOpen(true);
  };

  const handleViewSchools = (campus: Campus) => {
    setSelectedCampus(campus);
    setViewSchoolsDialogOpen(true);
  };

  const handleStatusToggle = (campus: Campus) => {
    setStatusChangeCampus(campus);
    setStatusChangeDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeCampus) return;

    const newStatus = !statusChangeCampus.status;

    setCampuses(campuses.map(campus =>
      campus.id === statusChangeCampus.id
        ? { ...campus, status: newStatus }
        : campus
    ));

    toast({
      title: "Success",
      description: `Campus ${newStatus ? "activated" : "deactivated"} successfully`,
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
    if (window.confirm("Are you sure you want to delete this campus?")) {
      setCampuses(campuses.filter(campus => campus.id !== id));
      toast({
        title: "Success",
        description: "Campus deleted successfully",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Campuses</h1>
          <p className="text-gray-600 mt-1">Oversee all university campuses and facilities</p>
        </div>
        <Button onClick={() => setAddCampusDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Campus
        </Button>
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
                <p className="text-2xl font-bold text-gray-900">{campuses.filter(c => c.status).length}</p>
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

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campuses by name, location, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                  <TableHead>Location</TableHead>
                  <TableHead>Campus Admin</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead>Users</TableHead>
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
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {campus.location}
                      </div>
                    </TableCell>
                    <TableCell>{campus.admin}</TableCell>
                    <TableCell>{campus.schools}</TableCell>
                    <TableCell>{campus.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={campus.status}
                          onCheckedChange={() => handleStatusToggle(campus)}
                        />
                        <Badge className={campus.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {campus.status ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewSchools(campus)}
                        >
                          <GraduationCap className="h-4 w-4" />
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
                          <Pencil className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Campus</DialogTitle>
            <DialogDescription>
              Create a new campus. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the campus" {...field} />
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

      {/* Edit Campus Dialog */}
      <Dialog open={editCampusDialogOpen} onOpenChange={setEditCampusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Campus</DialogTitle>
            <DialogDescription>
              Update campus information. All fields are required.
            </DialogDescription>
          </DialogHeader>

          {editingCampus && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateCampus)} className="space-y-4">
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

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the campus" {...field} />
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusChangeCampus?.status ? "Deactivate" : "Activate"} Campus
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {statusChangeCampus?.status ? "deactivate" : "activate"}{" "}
              <strong>{statusChangeCampus?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={confirmStatusChange}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
