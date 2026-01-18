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
  Search, Plus, Edit, Trash2, Eye, GraduationCap, Users, Building, Calendar, Mail, Phone, Download, Upload, Filter, BarChart3, Award, BookOpen
} from "lucide-react";

interface School {
  id: number;
  name: string;
  code: string;
  dean: string;
  email: string;
  phone: string;
  established: string;
  campus: string;
  departments: number;
  programs: number;
  students: number;
  faculty: number;
  staff: number;
  ranking: string;
  website: string;
  description: string;
  achievements: string[];
}

interface SchoolFormData {
  name: string;
  code: string;
  dean: string;
  email: string;
  phone: string;
  established: string;
  campus: string;
  ranking: string;
  website: string;
  description: string;
}

const ManageSchools = () => {
  const [schools, setSchools] = useState<School[]>([
    {
      id: 1,
      name: "College of Natural and Computational Sciences",
      code: "CNCS",
      dean: "Dr. Alemayehu Mengistu",
      email: "cncs@aau.edu.et",
      phone: "+251-111-234-567",
      established: "2010",
      campus: "Main Campus",
      departments: 8,
      programs: 15,
      students: 3500,
      faculty: 120,
      staff: 45,
      status: "Active",
      accreditation: "Fully Accredited",
      ranking: "Top 3 in Ethiopia",
      website: "cncs.aau.edu.et",
      description: "Leading institution in natural sciences, mathematics, and computing education.",
      achievements: ["Excellence in Research", "International Partnerships", "Innovation Hub"]
    },
    {
      id: 2,
      name: "College of Social Sciences",
      code: "CSS",
      dean: "Prof. Tigist Kassa",
      email: "css@aau.edu.et",
      phone: "+251-111-234-568",
      established: "2008",
      campus: "Main Campus",
      departments: 6,
      programs: 12,
      students: 2800,
      faculty: 95,
      staff: 35,
      status: "Active",
      accreditation: "Fully Accredited",
      ranking: "Top 5 in Ethiopia",
      website: "css.aau.edu.et",
      description: "Excellence in social sciences, humanities, and behavioral studies.",
      achievements: ["Community Engagement", "Policy Research", "Cultural Studies"]
    },
    {
      id: 3,
      name: "College of Business and Economics",
      code: "CBE",
      dean: "Dr. Haile Gebre",
      email: "cbe@aau.edu.et",
      phone: "+251-111-234-569",
      established: "2005",
      campus: "Business Campus",
      departments: 5,
      programs: 10,
      students: 3200,
      faculty: 85,
      staff: 30,
      status: "Active",
      accreditation: "Fully Accredited",
      ranking: "Top 2 in Ethiopia",
      website: "cbe.aau.edu.et",
      description: "Premier business education and economic research institution.",
      achievements: ["Entrepreneurship Hub", "Industry Partnerships", "Case Study Excellence"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const form = useForm<SchoolFormData>({
    defaultValues: {
      name: "",
      code: "",
      dean: "",
      email: "",
      phone: "",
      established: "",
      campus: "",
      accreditation: "",
      ranking: "",
      website: "",
      description: "",
      status: "Active"
    }
  });

  const editForm = useForm<SchoolFormData>({
    defaultValues: {
      name: "",
      code: "",
      dean: "",
      email: "",
      phone: "",
      established: "",
      campus: "",
      accreditation: "",
      ranking: "",
      website: "",
      description: "",
      status: "Active"
    }
  });

  const campuses = ["Main Campus", "Business Campus", "Engineering Campus", "Medical Campus"];
  const statusOptions = ["all", "Active", "Inactive", "Under Review"];
  const accreditationOptions = ["Fully Accredited", "Provisionally Accredited", "Under Review", "Not Accredited"];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.dean.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.campus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || school.status === statusFilter;
    const matchesCampus = campusFilter === "all" || school.campus === campusFilter;
    return matchesSearch && matchesStatus && matchesCampus;
  });

  const handleAddSchool = () => {
    const newSchool: School = {
      id: schools.length + 1,
      ...form.getValues(),
      departments: 0,
      programs: 0,
      students: 0,
      faculty: 0,
      staff: 0,
      achievements: []
    };
    setSchools([...schools, newSchool]);
    setShowAddDialog(false);
    form.reset();
  };

  const handleEditSchool = () => {
    if (editingSchool) {
      setSchools(schools.map(school =>
        school.id === editingSchool.id
          ? { ...school, ...editForm.getValues() }
          : school
      ));
      setShowEditDialog(false);
      editForm.reset();
    }
  };

  const handleDeleteSchool = (id: number) => {
    if (window.confirm("Are you sure you want to delete this school? This action cannot be undone.")) {
      setSchools(schools.filter(school => school.id !== id));
    }
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    editForm.reset({
      name: school.name,
      code: school.code,
      dean: school.dean,
      email: school.email,
      phone: school.phone,
      established: school.established,
      campus: school.campus,
      accreditation: school.accreditation,
      ranking: school.ranking,
      website: school.website,
      description: school.description,
      status: school.status
    });
    setShowEditDialog(true);
  };

  const handleExportData = () => {
    const csvContent = [
      ["Name", "Code", "Dean", "Campus", "Students", "Faculty", "Programs", "Status", "Accreditation"],
      ...filteredSchools.map(school => [
        school.name,
        school.code,
        school.dean,
        school.campus,
        school.students,
        school.faculty,
        school.programs,
        school.status,
        school.accreditation
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schools.csv";
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

  const getAccreditationBadge = (accreditation: string) => {
    const colors = {
      "Fully Accredited": "bg-green-100 text-green-800 border-green-200",
      "Provisionally Accredited": "bg-blue-100 text-blue-800 border-blue-200",
      "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Not Accredited": "bg-red-100 text-red-800 border-red-200"
    };
    return (
      <Badge className={colors[accreditation as keyof typeof colors] || colors["Under Review"]}>
        {accreditation}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Schools</h1>
          <p className="text-gray-600 mt-1">Oversee all schools and academic units</p>
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
            Add School
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.reduce((sum, school) => sum + school.students, 0).toLocaleString()}
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
                  {schools.reduce((sum, school) => sum + school.faculty, 0).toLocaleString()}
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
                  {schools.reduce((sum, school) => sum + school.programs, 0)}
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
                <p className="text-sm font-medium text-gray-600">Active Schools</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.filter(s => s.status === "Active").length}
                </p>
              </div>
              <Award className="h-8 w-8 text-red-600" />
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
                placeholder="Search schools by name, code, dean, or campus..."
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

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Schools Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Dean</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Accreditation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{school.name}</p>
                        <p className="text-sm text-gray-500">{school.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{school.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{school.dean}</p>
                        <p className="text-sm text-gray-500">{school.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{school.campus}</TableCell>
                    <TableCell>{school.students.toLocaleString()}</TableCell>
                    <TableCell>{school.faculty}</TableCell>
                    <TableCell>{school.programs}</TableCell>
                    <TableCell>{getAccreditationBadge(school.accreditation)}</TableCell>
                    <TableCell>{getStatusBadge(school.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedSchool(school);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(school)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSchool(school.id)}
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

      {/* Add School Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>
              Create a new school in the university system
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSchool)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
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
                      <FormLabel>School Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CNCS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dean"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dean Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter dean name" {...field} />
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
                        <Input type="email" placeholder="school@aau.edu.et" {...field} />
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
                        <Input placeholder="e.g., 2010" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accreditation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accreditation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accreditation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accreditationOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ranking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ranking</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Top 3 in Ethiopia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="school.aau.edu.et" {...field} />
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
                      <Textarea placeholder="Enter school description" {...field} rows={3} />
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
                  Add School
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* School Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">School Name</Label>
                  <p className="font-semibold">{selectedSchool.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">School Code</Label>
                  <p className="font-semibold">{selectedSchool.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedSchool.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Dean</Label>
                  <p className="font-semibold">{selectedSchool.dean}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedSchool.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedSchool.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus</Label>
                  <p className="font-semibold">{selectedSchool.campus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Established</Label>
                  <p className="font-semibold">{selectedSchool.established}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Website</Label>
                  <p className="font-semibold">{selectedSchool.website}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Accreditation</Label>
                  <div>{getAccreditationBadge(selectedSchool.accreditation)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Ranking</Label>
                  <p className="font-semibold">{selectedSchool.ranking}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedSchool.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedSchool.departments}</p>
                  <p className="text-sm text-gray-600">Departments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedSchool.students.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedSchool.faculty}</p>
                  <p className="text-sm text-gray-600">Faculty</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedSchool.programs}</p>
                  <p className="text-sm text-gray-600">Programs</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Achievements</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSchool.achievements.map((achievement, index) => (
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>School Analytics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{schools.length}</p>
                  <p className="text-sm text-gray-600">Total Schools</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {schools.reduce((sum, school) => sum + school.students, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {schools.reduce((sum, school) => sum + school.faculty, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Faculty</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {schools.reduce((sum, school) => sum + school.programs, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Programs</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schools by Campus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {campuses.map((campus) => {
                      const count = schools.filter(s => s.campus === campus).length;
                      return (
                        <div key={campus} className="flex justify-between items-center">
                          <span className="text-sm">{campus}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accreditation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {accreditationOptions.map((status) => {
                      const count = schools.filter(s => s.accreditation === status).length;
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

export default ManageSchools;
