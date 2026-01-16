import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, Edit, UserX, KeyRound, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUsers, useCreateUser, useUpdateUser, useResetPassword, useUpdateUserStatus, type User } from "@/hooks/useUsersApi";

// Fallback mock data
const mockUsers: User[] = [
  { id: 1, name: "Abebe Kebede", email: "abebe.k@aau.edu.et", role: "Office User", status: "Active", campus: "Main Campus (6 Kilo)", avatar: "AK" },
  { id: 2, name: "Sara Hailu", email: "sara.h@aau.edu.et", role: "Office User", status: "Active", campus: "Technology Campus", avatar: "SH" },
  { id: 3, name: "Dawit Tesfaye", email: "dawit.t@aau.edu.et", role: "Office User", status: "Inactive", campus: "Science Campus", avatar: "DT" },
  { id: 4, name: "Meron Alemu", email: "meron.a@aau.edu.et", role: "Office User", status: "Active", campus: "Main Campus (6 Kilo)", avatar: "MA" },
  { id: 5, name: "Yonas Girma", email: "yonas.g@aau.edu.et", role: "Office User", status: "Active", campus: "Commerce Campus", avatar: "YG" },
  { id: 6, name: "Tigist Bekele", email: "tigist.b@aau.edu.et", role: "Office User", status: "Active", campus: "Medical Campus", avatar: "TB" },
  { id: 7, name: "Henok Tadesse", email: "henok.t@aau.edu.et", role: "Office User", status: "Active", campus: "Law Campus", avatar: "HT" },
];

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  password?: string;
}

const roles = [
  "Office User",
];

const campuses = [
  "Main Campus (6 Kilo)",
  "Technology Campus",
  "Science Campus",
  "Commerce Campus",
  "Medical Campus",
  "Law Campus",
];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [statusChangeUser, setStatusChangeUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const resetPasswordMutation = useResetPassword();
  const updateUserStatusMutation = useUpdateUserStatus();

  // Use API data if available, otherwise fallback to mock data
  const users = usersData || mockUsers;

  // Filter users based on search query and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const form = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "Office User",
      status: "Active",
      password: "",
    },
    mode: "onChange",
  });

  const validateForm = (data: UserFormData): boolean => {
    let isValid = true;

    if (!data.name.trim()) {
      form.setError("name", { type: "manual", message: "Full name is required" });
      isValid = false;
    } else if (data.name.trim().length < 2) {
      form.setError("name", { type: "manual", message: "Full name must be at least 2 characters" });
      isValid = false;
    }

    if (!data.email.trim()) {
      form.setError("email", { type: "manual", message: "Email address is required" });
      isValid = false;
    } else if (!emailRegex.test(data.email)) {
      form.setError("email", { type: "manual", message: "Please enter a valid email address" });
      isValid = false;
    }

    if (!data.role) {
      form.setError("role", { type: "manual", message: "Role is required" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: UserFormData) => {
    if (!validateForm(data)) {
      return;
    }

    try {
      await createUserMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleStatusChange = (user: User) => {
    setStatusChangeUser(user);
    setStatusChangeDialogOpen(true);
  };

  const confirmResetPassword = async () => {
    if (!resetPasswordUser) return;

    try {
      const result = await resetPasswordMutation.mutateAsync(resetPasswordUser.id);
      setTempPassword(result.temporaryPassword);
      toast({
        title: "Password Reset Successful",
        description: (
          <div className="space-y-2">
            <p>Temporary password for {resetPasswordUser.name}:</p>
            <code className="block bg-muted px-2 py-1 rounded text-sm font-mono">
              {result.temporaryPassword}
            </code>
            <p className="text-xs text-muted-foreground">Please save this password securely.</p>
          </div>
        ),
        duration: 10000,
      });
      setResetPasswordDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const confirmStatusChange = async () => {
    if (!statusChangeUser) return;

    const newStatus = statusChangeUser.status === "Active" ? "Inactive" : "Active";

    try {
      await updateUserStatusMutation.mutateAsync({
        userId: statusChangeUser.id,
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `User ${newStatus === "Active" ? "activated" : "deactivated"} successfully`,
      });
      setStatusChangeDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions"
        actions={
          <Button
            className="bg-aau-gradient hover:opacity-90"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {/* Stats Bar */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{users.length}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-sm font-medium">All registered</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
            <span className="text-lg font-bold text-success">{users.filter(u => u.status === "Active").length}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-sm font-medium">Currently active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-lg font-bold text-destructive">{users.filter(u => u.status === "Inactive").length}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Inactive</p>
            <p className="text-sm font-medium">Deactivated</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
            <span className="text-lg font-bold text-info">1</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Roles</p>
            <p className="text-sm font-medium">Office User</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground px-2"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <p>Showing {filteredUsers.length} of {users.length} users</p>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {user.avatar || getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.campus}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "outline"}
                      className={user.status === "Active" ? "" : "text-muted-foreground"}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleStatusChange(user)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No users found matching your search</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. All fields are required unless otherwise specified.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value.trim()) {
                            form.setError("name", {
                              type: "manual",
                              message: "Full name is required",
                            });
                          } else if (e.target.value.trim().length < 2) {
                            form.setError("name", {
                              type: "manual",
                              message: "Full name must be at least 2 characters",
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

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@aau.edu.et"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value.trim()) {
                            form.setError("email", {
                              type: "manual",
                              message: "Email address is required",
                            });
                          } else if (!emailRegex.test(e.target.value)) {
                            form.setError("email", {
                              type: "manual",
                              message: "Please enter a valid email address",
                            });
                          } else {
                            form.clearErrors("email");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (!value) {
                          form.setError("role", {
                            type: "manual",
                            message: "Role is required",
                          });
                        } else {
                          form.clearErrors("role");
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Active" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Active</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Inactive" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Inactive</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave empty for auto-generated password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional. If left empty, a password will be auto-generated.
                    </FormDescription>
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
                    setOpen(false);
                  }}
                  disabled={createUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aau-gradient hover:opacity-90"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {createUserMutation.isPending ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. All fields are required.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSubmit={async (data) => {
                try {
                  await updateUserMutation.mutateAsync({
                    userId: editingUser.id,
                    userData: data,
                  });
                  toast({
                    title: "Success",
                    description: "User updated successfully",
                  });
                  setEditDialogOpen(false);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to update user",
                    variant: "destructive",
                  });
                }
              }}
              onCancel={() => setEditDialogOpen(false)}
              isLoading={updateUserMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the password for <strong>{resetPasswordUser?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
              disabled={resetPasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-aau-gradient hover:opacity-90"
              onClick={confirmResetPassword}
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate/Deactivate Confirmation Dialog */}
      <Dialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {statusChangeUser?.status === "Active" ? "Deactivate" : "Activate"} User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusChangeUser?.status === "Active" ? "deactivate" : "activate"}{" "}
              <strong>{statusChangeUser?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatusChangeDialogOpen(false)}
              disabled={updateUserStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-aau-gradient hover:opacity-90"
              onClick={confirmStatusChange}
              disabled={updateUserStatusMutation.isPending}
            >
              {updateUserStatusMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateUserStatusMutation.isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit User Form Component
interface EditUserFormProps {
  user: User;
  onSubmit: (data: { name: string; role: string; campus: string; status: "Active" | "Inactive" }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function EditUserForm({ user, onSubmit, onCancel, isLoading }: EditUserFormProps) {
  const form = useForm({
    defaultValues: {
      name: user.name,
      role: user.role,
      campus: user.campus || "Main Campus (6 Kilo)",
      status: user.status,
    },
    mode: "onChange",
  });

  const validateForm = (data: any): boolean => {
    let isValid = true;

    if (!data.name.trim()) {
      form.setError("name", { type: "manual", message: "Full name is required" });
      isValid = false;
    } else if (data.name.trim().length < 2) {
      form.setError("name", { type: "manual", message: "Full name must be at least 2 characters" });
      isValid = false;
    }

    if (!data.role) {
      form.setError("role", { type: "manual", message: "Role is required" });
      isValid = false;
    }

    if (!data.campus) {
      form.setError("campus", { type: "manual", message: "Campus is required" });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (data: any) => {
    if (!validateForm(data)) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!e.target.value.trim()) {
                      form.setError("name", {
                        type: "manual",
                        message: "Full name is required",
                      });
                    } else if (e.target.value.trim().length < 2) {
                      form.setError("name", {
                        type: "manual",
                        message: "Full name must be at least 2 characters",
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

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (!value) {
                    form.setError("role", {
                      type: "manual",
                      message: "Role is required",
                    });
                  } else {
                    form.clearErrors("role");
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campus */}
        <FormField
          control={form.control}
          name="campus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campus *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (!value) {
                    form.setError("campus", {
                      type: "manual",
                      message: "Campus is required",
                    });
                  } else {
                    form.clearErrors("campus");
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Active" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Active</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Inactive" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Inactive</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-aau-gradient hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
