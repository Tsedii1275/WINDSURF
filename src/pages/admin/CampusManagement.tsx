import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MapPin, Users, Pencil, Loader2, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Input } from "@/components/ui/input";
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
import {
  useCampuses,
  useCreateCampus,
  useUpdateCampus,
  useUpdateCampusStatus,
  useCampusSchools,
  type Campus
} from "@/hooks/useCampusesApi";

interface CampusFormData {
  name: string;
  location: string;
  admin: string;
}

export default function CampusManagement() {
  const [addCampusDialogOpen, setAddCampusDialogOpen] = useState(false);
  const [editCampusDialogOpen, setEditCampusDialogOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [viewSchoolsDialogOpen, setViewSchoolsDialogOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [statusChangeCampus, setStatusChangeCampus] = useState<Campus | null>(null);

  const { toast } = useToast();
  const { data: campuses = [], isLoading } = useCampuses();
  const createCampusMutation = useCreateCampus();
  const updateCampusMutation = useUpdateCampus();
  const updateStatusMutation = useUpdateCampusStatus();
  const { data: schools = [], isLoading: isLoadingSchools } = useCampusSchools(selectedCampus?.id || null);

  const form = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      location: "",
      admin: "",
    },
    mode: "onChange",
  });

  const editForm = useForm<CampusFormData>({
    defaultValues: {
      name: "",
      location: "",
      admin: "",
    },
    mode: "onChange",
  });

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

    try {
      await createCampusMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Campus added successfully",
      });
      form.reset();
      setAddCampusDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add campus. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCampus = (campus: Campus) => {
    setEditingCampus(campus);
    editForm.reset({
      name: campus.name,
      location: campus.location,
      admin: campus.admin,
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

    try {
      await updateStatusMutation.mutateAsync({
        campusId: statusChangeCampus.id,
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Campus ${newStatus ? "activated" : "deactivated"} successfully`,
      });
      setStatusChangeDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update campus status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Campus Management"
        description="Manage university campuses, schools, and departments"
        actions={
          <Button
            className="bg-aau-gradient hover:opacity-90"
            onClick={() => setAddCampusDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Campus
          </Button>
        }
      />

      {/* Campus Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campuses</p>
                <p className="text-2xl font-bold text-foreground">{campuses.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">{campuses.filter(c => c.status).length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-success animate-pulse-soft" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Schools</p>
                <p className="text-2xl font-bold text-foreground">{campuses.reduce((sum, c) => sum + c.schools, 0)}</p>
              </div>
              <Building2 className="h-8 w-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-info">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{campuses.reduce((sum, c) => sum + c.users, 0).toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {campuses.map((campus) => (
          <Card
            key={campus.id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground mb-2 truncate">
                      {campus.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{campus.location}</span>
                    </div>
                  </div>
                  <Switch
                    checked={campus.status}
                    onCheckedChange={() => handleStatusToggle(campus)}
                    className="flex-shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${campus.status ? 'bg-success' : 'bg-muted-foreground'}`} />
                  <span className="text-sm text-muted-foreground">
                    {campus.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-border">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">{campus.schools}</p>
                  <p className="text-sm text-muted-foreground">Schools</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">{campus.users}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </div>

              {/* Admin */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Campus Admin</p>
                <p className="text-sm font-medium text-foreground truncate">{campus.admin}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSchools(campus)}
                  className="flex-1"
                >
                  View Schools
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleEditCampus(campus)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              {/* Campus Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campus Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Engineering Campus"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value.trim()) {
                            form.setError("name", {
                              type: "manual",
                              message: "Campus name is required",
                            });
                          } else if (e.target.value.trim().length < 3) {
                            form.setError("name", {
                              type: "manual",
                              message: "Campus name must be at least 3 characters",
                            });
                          } else {
                            form.clearErrors("name");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Addis Ababa, Ethiopia"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value.trim()) {
                            form.setError("location", {
                              type: "manual",
                              message: "Location is required",
                            });
                          } else if (e.target.value.trim().length < 5) {
                            form.setError("location", {
                              type: "manual",
                              message: "Location must be at least 5 characters",
                            });
                          } else {
                            form.clearErrors("location");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campus Admin */}
              <FormField
                control={form.control}
                name="admin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campus Admin *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dr. John Doe"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value.trim()) {
                            form.setError("admin", {
                              type: "manual",
                              message: "Campus admin is required",
                            });
                          } else if (e.target.value.trim().length < 3) {
                            form.setError("admin", {
                              type: "manual",
                              message: "Admin name must be at least 3 characters",
                            });
                          } else {
                            form.clearErrors("admin");
                          }
                        }}
                      />
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
                  disabled={createCampusMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aau-gradient hover:opacity-90"
                  disabled={createCampusMutation.isPending}
                >
                  {createCampusMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {createCampusMutation.isPending ? "Adding..." : "Add Campus"}
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
              <form onSubmit={editForm.handleSubmit(async (data) => {
                if (!editingCampus) return;

                try {
                  await updateCampusMutation.mutateAsync({
                    campusId: editingCampus.id,
                    campusData: data,
                  });
                  toast({
                    title: "Success",
                    description: `Campus "${data.name}" updated successfully`,
                  });
                  setEditCampusDialogOpen(false);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to update campus",
                    variant: "destructive",
                  });
                }
              })} className="space-y-4">
                {/* Campus Name */}
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

                {/* Location */}
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

                {/* Campus Admin */}
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

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditCampusDialogOpen(false)}
                    disabled={updateCampusMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-aau-gradient hover:opacity-90"
                    disabled={updateCampusMutation.isPending}
                  >
                    {updateCampusMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {updateCampusMutation.isPending ? "Updating..." : "Update Campus"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Schools Dialog */}
      <Dialog open={viewSchoolsDialogOpen} onOpenChange={setViewSchoolsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Schools at {selectedCampus?.name}
            </DialogTitle>
            <DialogDescription>
              View all schools and departments in this campus
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoadingSchools ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : schools.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No schools found for this campus</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Dean</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                    <TableHead className="text-right">Programs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.dean}</TableCell>
                      <TableCell className="text-right">{school.students.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{school.programs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewSchoolsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
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
            <AlertDialogCancel disabled={updateStatusMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-aau-gradient hover:opacity-90"
              onClick={confirmStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateStatusMutation.isPending ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
