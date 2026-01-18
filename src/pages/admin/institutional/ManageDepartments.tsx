import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Search, Plus, Edit, Trash2, Eye, Users, Building, Calendar, Mail, Phone, Download, Upload, Filter, BarChart3, Award, BookOpen, Target, TrendingUp
} from "lucide-react";

interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  email: string;
  phone: string;
  established: string;
  school: string;
  campus: string;
  programs: number;
  students: number;
  faculty: number;
  staff: number;
  status: "Active" | "Inactive" | "Under Review";
  budget: string;
  research: string;
  description: string;
  achievements: string[];
  labs: number;
  publications: number;
}

interface DepartmentFormData {
  name: string;
  code: string;
  head: string;
  email: string;
  phone: string;
  established: string;
  school: string;
  campus: string;
  budget: string;
  research: string;
  description: string;
  status: "Active" | "Inactive" | "Under Review";
}

const ManageDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Computer Science Department",
      code: "CS",
      head: "Dr. Solomon Mekonnen",
      email: "cs@aau.edu.et",
      phone: "+251-111-234-570",
      established: "2012",
      school: "College of Natural and Computational Sciences",
      campus: "Main Campus",
      programs: 4,
      students: 1200,
      faculty: 45,
      staff: 15,
      status: "Active",
      budget: "5M ETB",
      research: "High",
      description: "Leading department in computer science education and research.",
      achievements: ["AI Research Excellence", "Industry Partnerships", "Student Innovation Awards"],
      labs: 8,
      publications: 120
    },
    {
      id: 2,
      name: "Mathematics Department",
      code: "MATH",
      head: "Prof. Almaz Tesfaye",
      email: "math@aau.edu.et",
      phone: "+251-111-234-571",
      established: "2010",
      school: "College of Natural and Computational Sciences",
      campus: "Main Campus",
      programs: 3,
      students: 800,
      faculty: 35,
      staff: 10,
      status: "Active",
      budget: "3M ETB",
      research: "Medium",
      description: "Excellence in mathematical sciences and theoretical research.",
      achievements: ["Mathematical Excellence", "Research Publications", "Teaching Awards"],
      labs: 4,
      publications: 85
    },
    {
      id: 3,
      name: "Business Administration Department",
      code: "BA",
      head: "Dr. Selamawit Haile",
      email: "ba@aau.edu.et",
      phone: "+251-111-234-573",
      established: "2005",
      school: "College of Business and Economics",
      campus: "Business Campus",
      programs: 3,
      students: 1500,
      faculty: 50,
      staff: 20,
      status: "Active",
      budget: "4M ETB",
      research: "Medium",
      description: "Business education and management training.",
      achievements: ["Case Study Excellence", "Entrepreneurship Hub", "Industry Integration"],
      labs: 2,
      publications: 95
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      code: "",
      head: "",
      email: "",
      phone: "",
      established: "",
      school: "",
      campus: "",
      budget: "",
      research: "",
      description: "",
      status: "Active"
    }
  });

  const editForm = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      code: "",
      head: "",
      email: "",
      phone: "",
      established: "",
      school: "",
      campus: "",
      budget: "",
      research: "",
      description: "",
      status: "Active"
    }
  });

  const schools = [
    "College of Natural and Computational Sciences",
    "College of Social Sciences", 
    "College of Business and Economics",
    "College of Engineering",
    "College of Health Sciences"
  ];

  const campuses = ["Main Campus", "Business Campus", "Engineering Campus", "Medical Campus"];
  const statusOptions = ["all", "Active", "Inactive", "Under Review"];
  const researchLevels = ["Low", "Medium", "High", "Very High"];

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || department.status === statusFilter;
    const matchesSchool = schoolFilter === "all" || department.school === schoolFilter;
    const matchesCampus = campusFilter === "all" || department.campus === campusFilter;
    return matchesSearch && matchesStatus && matchesSchool && matchesCampus;
  });

  const handleAddDepartment = () => {
    const newDepartment: Department = {
      id: departments.length + 1,
      ...form.getValues(),
      programs: 0,
      students: 0,
      faculty: 0,
      staff: 0,
      achievements: [],
      labs: 0,
      publications: 0
    };
    setDepartments([...departments, newDepartment]);
    setShowAddDialog(false);
    form.reset();
  };

  const handleEditDepartment = () => {
    if (editingDepartment) {
      setDepartments(departments.map(department =>
        department.id === editingDepartment.id
          ? { ...department, ...editForm.getValues() }
          : department
      ));
      setShowEditDialog(false);
      editForm.reset();
    }
  };

  const handleDeleteDepartment = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      setDepartments(departments.filter(department => department.id !== id));
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    editForm.reset({
      name: department.name,
      code: department.code,
      head: department.head,
      email: department.email,
      phone: department.phone,
      established: department.established,
      school: department.school,
      campus: department.campus,
      budget: department.budget,
      research: department.research,
      description: department.description,
      status: department.status
    });
    setShowEditDialog(true);
  };

  const handleExportData = () => {
    const csvContent = [
      ["Name", "Code", "Head", "School", "Campus", "Students", "Faculty", "Programs", "Status", "Budget"],
      ...filteredDepartments.map(dept => [
        dept.name,
        dept.code,
        dept.head,
        dept.school,
        dept.campus,
        dept.students,
        dept.faculty,
        dept.programs,
        dept.status,
        dept.budget
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.Inactive}>
        {status}
      </Badge>
    );
  };

  const getResearchBadge = (research: string) => {
    const colors = {
      Low: "bg-gray-100 text-gray-800 border-gray-200",
      Medium: "bg-blue-100 text-blue-800 border-blue-200",
      High: "bg-green-100 text-green-800 border-green-200",
      "Very High": "bg-purple-100 text-purple-800 border-purple-200"
    };
    return (
      <Badge className={colors[research as keyof typeof colors] || colors.Medium}>
        {research}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Departments</h1>
          <p className="text-gray-600 mt-1">Oversee all academic departments and programs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalyticsDialog(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.students, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.faculty, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Programs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.programs, 0)}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Labs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.labs, 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.publications, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
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
                placeholder="Search departments by name, code, head, or school..."
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
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={campusFilter} onValueChange={setCampusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                {campuses.map((campus) => (
                  <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departments Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Department Head</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Research</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{department.name}</p>
                        <p className="text-sm text-gray-500">{department.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{department.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{department.head}</p>
                        <p className="text-sm text-gray-500">{department.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{department.school}</TableCell>
                    <TableCell>{department.campus}</TableCell>
                    <TableCell>{department.students.toLocaleString()}</TableCell>
                    <TableCell>{department.faculty}</TableCell>
                    <TableCell>{getResearchBadge(department.research)}</TableCell>
                    <TableCell>{getStatusBadge(department.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(department)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDepartment(department.id)}
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

      {/* Add Department Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department in the university system
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddDepartment)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department name" {...field} />
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
                      <FormLabel>Department Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="head"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Head</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department head name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="dept@aau.edu.et" {...field} />
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
                        <Input placeholder="e.g., 2012" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school} value={school}>{school}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campuses.map((campus) => (
                            <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5M ETB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="research"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select research level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {researchLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
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
                      <Textarea placeholder="Enter department description" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Department
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Department Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Name</Label>
                  <p className="font-semibold">{selectedDepartment.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Code</Label>
                  <p className="font-semibold">{selectedDepartment.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedDepartment.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Head</Label>
                  <p className="font-semibold">{selectedDepartment.head}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedDepartment.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedDepartment.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">School</Label>
                  <p className="font-semibold">{selectedDepartment.school}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus</Label>
                  <p className="font-semibold">{selectedDepartment.campus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Established</Label>
                  <p className="font-semibold">{selectedDepartment.established}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Budget</Label>
                  <p className="font-semibold">{selectedDepartment.budget}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Research Level</Label>
                  <div>{getResearchBadge(selectedDepartment.research)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Labs</Label>
                  <p className="font-semibold">{selectedDepartment.labs}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedDepartment.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedDepartment.programs}</p>
                  <p className="text-sm text-gray-600">Programs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedDepartment.students.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedDepartment.faculty}</p>
                  <p className="text-sm text-gray-600">Faculty</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedDepartment.publications}</p>
                  <p className="text-sm text-gray-600">Publications</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Achievements</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDepartment.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary">{achievement}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Department Analytics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
                  <p className="text-sm text-gray-600">Total Depts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {departments.reduce((sum, dept) => sum + dept.students, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {departments.reduce((sum, dept) => sum + dept.faculty, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Faculty</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {departments.reduce((sum, dept) => sum + dept.programs, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Programs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {departments.reduce((sum, dept) => sum + dept.labs, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Labs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {departments.reduce((sum, dept) => sum + dept.publications, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Publications</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Departments by School</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {schools.map((school) => {
                      const count = departments.filter(d => d.school === school).length;
                      return (
                        <div key={school} className="flex justify-between items-center">
                          <span className="text-sm truncate">{school}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {researchLevels.map((level) => {
                      const count = departments.filter(d => d.research === level).length;
                      return (
                        <div key={level} className="flex justify-between items-center">
                          <span className="text-sm">{level}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {statusOptions.slice(1).map((status) => {
                      const count = departments.filter(d => d.status === status).length;
                      return (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-sm">{status}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDepartments;
