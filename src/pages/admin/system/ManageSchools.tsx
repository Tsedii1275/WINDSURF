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
  GraduationCap, 
  Users, 
  Building,
  Calendar,
  Mail,
  Phone
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
  students: number;
  faculty: number;
  status: "Active" | "Inactive";
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
      students: 3500,
      faculty: 120,
      status: "Active",
      description: "Leading institution in natural sciences, mathematics, and computing education."
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
      students: 2800,
      faculty: 95,
      status: "Active",
      description: "Excellence in social sciences, humanities, and behavioral studies."
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
      students: 3200,
      faculty: 85,
      status: "Active",
      description: "Premier business education and economic research institution."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    dean: "",
    email: "",
    phone: "",
    established: "",
    campus: "",
    description: "",
    status: "Active" as "Active" | "Inactive"
  });

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.dean.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSchool = () => {
    const newSchool: School = {
      id: schools.length + 1,
      ...formData,
      departments: 0,
      students: 0,
      faculty: 0
    };
    setSchools([...schools, newSchool]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditSchool = () => {
    if (selectedSchool) {
      setSchools(schools.map(school =>
        school.id === selectedSchool.id
          ? { ...school, ...formData }
          : school
      ));
      setShowEditDialog(false);
      resetForm();
    }
  };

  const handleDeleteSchool = (id: number) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      setSchools(schools.filter(school => school.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      dean: "",
      email: "",
      phone: "",
      established: "",
      campus: "",
      description: "",
      status: "Active"
    });
  };

  const openEditDialog = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      code: school.code,
      dean: school.dean,
      email: school.email,
      phone: school.phone,
      established: school.established,
      campus: school.campus,
      description: school.description,
      status: school.status
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Schools</h1>
          <p className="text-gray-600 mt-1">Oversee all schools and academic units</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Active Schools</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.filter(s => s.status === "Active").length}
                </p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
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
                placeholder="Search schools by name, code, or dean..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">School Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Dean</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Campus</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Students</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Faculty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{school.name}</p>
                        <p className="text-sm text-gray-500">{school.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{school.code}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{school.dean}</p>
                        <p className="text-sm text-gray-500">{school.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{school.campus}</td>
                    <td className="py-3 px-4">{school.students.toLocaleString()}</td>
                    <td className="py-3 px-4">{school.faculty}</td>
                    <td className="py-3 px-4">{getStatusBadge(school.status)}</td>
                    <td className="py-3 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">School Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter school name"
              />
            </div>
            <div>
              <Label htmlFor="code">School Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="e.g., CNCS"
              />
            </div>
            <div>
              <Label htmlFor="dean">Dean Name</Label>
              <Input
                id="dean"
                value={formData.dean}
                onChange={(e) => setFormData({...formData, dean: e.target.value})}
                placeholder="Enter dean name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="school@aau.edu.et"
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
                placeholder="e.g., 2010"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="campus">Campus</Label>
              <Select value={formData.campus} onValueChange={(value) => setFormData({...formData, campus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Campus">Main Campus</SelectItem>
                  <SelectItem value="Business Campus">Business Campus</SelectItem>
                  <SelectItem value="Science Campus">Science Campus</SelectItem>
                  <SelectItem value="Engineering Campus">Engineering Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter school description"
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
            <Button onClick={handleAddSchool}>
              Add School
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update school information
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="edit-name">School Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-code">School Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-dean">Dean Name</Label>
              <Input
                id="edit-dean"
                value={formData.dean}
                onChange={(e) => setFormData({...formData, dean: e.target.value})}
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
              <Label htmlFor="edit-campus">Campus</Label>
              <Select value={formData.campus} onValueChange={(value) => setFormData({...formData, campus: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Campus">Main Campus</SelectItem>
                  <SelectItem value="Business Campus">Business Campus</SelectItem>
                  <SelectItem value="Science Campus">Science Campus</SelectItem>
                  <SelectItem value="Engineering Campus">Engineering Campus</SelectItem>
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
            <Button onClick={handleEditSchool}>
              Update School
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* School Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">School Name</Label>
                  <p className="font-semibold">{selectedSchool.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">School Code</Label>
                  <p className="font-semibold">{selectedSchool.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Dean</Label>
                  <p className="font-semibold">{selectedSchool.dean}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campus</Label>
                  <p className="font-semibold">{selectedSchool.campus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedSchool.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedSchool.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Established</Label>
                  <p className="font-semibold">{selectedSchool.established}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedSchool.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedSchool.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSchools;
