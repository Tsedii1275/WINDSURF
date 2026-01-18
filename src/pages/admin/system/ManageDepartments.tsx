import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Building,
  Calendar,
  Mail,
  Phone,
  BookOpen
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
  programs: number;
  students: number;
  faculty: number;
  status: "Active" | "Inactive";
  description: string;
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
      programs: 4,
      students: 1200,
      faculty: 45,
      status: "Active",
      description: "Leading department in computer science education and research."
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
      programs: 3,
      students: 800,
      faculty: 35,
      status: "Active",
      description: "Excellence in mathematical sciences and theoretical research."
    },
    {
      id: 3,
      name: "Sociology Department",
      code: "SOC",
      head: "Dr. Kaleb Bekele",
      email: "sociology@aau.edu.et",
      phone: "+251-111-234-572",
      established: "2008",
      school: "College of Social Sciences",
      programs: 2,
      students: 600,
      faculty: 25,
      status: "Active",
      description: "Social sciences research and community engagement."
    },
    {
      id: 4,
      name: "Business Administration Department",
      code: "BA",
      head: "Dr. Selamawit Haile",
      email: "ba@aau.edu.et",
      phone: "+251-111-234-573",
      established: "2005",
      school: "College of Business and Economics",
      programs: 3,
      students: 1500,
      faculty: 50,
      status: "Active",
      description: "Business education and management training."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    head: "",
    email: "",
    phone: "",
    established: "",
    school: "",
    description: "",
    status: "Active" as "Active" | "Inactive"
  });

  const schools = [
    "College of Natural and Computational Sciences",
    "College of Social Sciences", 
    "College of Business and Economics",
    "College of Engineering",
    "College of Health Sciences"
  ];

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    const newDepartment: Department = {
      id: departments.length + 1,
      ...formData,
      programs: 0,
      students: 0,
      faculty: 0
    };
    setDepartments([...departments, newDepartment]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditDepartment = () => {
    if (selectedDepartment) {
      setDepartments(departments.map(department =>
        department.id === selectedDepartment.id
          ? { ...department, ...formData }
          : department
      ));
      setShowEditDialog(false);
      resetForm();
    }
  };

  const handleDeleteDepartment = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter(department => department.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      head: "",
      email: "",
      phone: "",
      established: "",
      school: "",
      description: "",
      status: "Active"
    });
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      head: department.head,
      email: department.email,
      phone: department.phone,
      established: department.established,
      school: department.school,
      description: department.description,
      status: department.status
    });
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={`${
        status === "Active" 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-gray-100 text-gray-800 border-gray-200"
      }`}>
        {status}
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
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Academic Programs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.programs, 0)}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
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
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Department Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Department Head</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">School</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Students</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Faculty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((department) => (
                  <tr key={department.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{department.name}</p>
                        <p className="text-sm text-gray-500">{department.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{department.code}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{department.head}</p>
                        <p className="text-sm text-gray-500">{department.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{department.school}</td>
                    <td className="py-3 px-4">{department.students.toLocaleString()}</td>
                    <td className="py-3 px-4">{department.faculty}</td>
                    <td className="py-3 px-4">{getStatusBadge(department.status)}</td>
                    <td className="py-3 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label htmlFor="code">Department Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="e.g., CS"
              />
            </div>
            <div>
              <Label htmlFor="head">Department Head</Label>
              <Input
                id="head"
                value={formData.head}
                onChange={(e) => setFormData({...formData, head: e.target.value})}
                placeholder="Enter department head name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="dept@aau.edu.et"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+251-xxx-xxx-xxx"
              />
            </div>
            <div>
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                value={formData.established}
                onChange={(e) => setFormData({...formData, established: e.target.value})}
                placeholder="e.g., 2012"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="school">School</Label>
              <Select value={formData.school} onValueChange={(value) => setFormData({...formData, school: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter department description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-code">Department Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-head">Department Head</Label>
              <Input
                id="edit-head"
                value={formData.head}
                onChange={(e) => setFormData({...formData, head: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-established">Established Year</Label>
              <Input
                id="edit-established"
                value={formData.established}
                onChange={(e) => setFormData({...formData, established: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-school">School</Label>
              <Select value={formData.school} onValueChange={(value) => setFormData({...formData, school: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>
              Update Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Department Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Name</Label>
                  <p className="font-semibold">{selectedDepartment.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Code</Label>
                  <p className="font-semibold">{selectedDepartment.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Head</Label>
                  <p className="font-semibold">{selectedDepartment.head}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">School</Label>
                  <p className="font-semibold">{selectedDepartment.school}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedDepartment.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedDepartment.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Established</Label>
                  <p className="font-semibold">{selectedDepartment.established}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedDepartment.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedDepartment.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDepartments;
