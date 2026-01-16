import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info, Clock, CheckCircle2, XCircle, Building, Calendar, Users, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";

const PublicDashboard = () => {
    const { user } = useAuth();
    const [selectedTraining, setSelectedTraining] = useState<any>(null);
    const [selectedRental, setSelectedRental] = useState<any>(null);
    const [showTrainingDialog, setShowTrainingDialog] = useState(false);
    const [showRentalDialog, setShowRentalDialog] = useState(false);

    const registeredTrainings = [
        {
            id: 1,
            title: "Advanced Data Science with Python",
            department: "Computer Science",
            dateApplied: "2025-01-05",
            status: "Approved",
            details: "Please complete the payment to confirm your seat.",
            instructor: "Dr. John Smith",
            duration: "12 weeks",
            schedule: "Mon, Wed, Fri - 6:00 PM to 8:00 PM",
            location: "Science Building, Room 301",
            description: "Comprehensive course covering Python programming, data analysis, machine learning fundamentals, and real-world project implementation."
        },
        {
            id: 2,
            title: "Strategic Leadership for Public Servants",
            department: "Public Administration",
            dateApplied: "2025-01-08",
            status: "Pending",
            details: "Your application is currently being reviewed by the department head.",
            instructor: "Prof. Sarah Johnson",
            duration: "8 weeks",
            schedule: "Tue, Thu - 5:30 PM to 7:30 PM",
            location: "Admin Building, Hall A",
            description: "Leadership development program focusing on strategic planning, public policy implementation, and organizational management."
        }
    ];

    const rentalRequests = [
        {
            id: 1,
            facility: "Nelson Mandela Hall",
            campus: "Main Campus",
            dateRequested: "2025-01-07",
            status: "Rejected",
            details: "The hall is already booked for the requested date. Please choose another date.",
            requestedDate: "2025-02-15",
            timeSlot: "2:00 PM - 6:00 PM",
            purpose: "Annual Department Meeting",
            capacity: "200 people",
            equipment: "Projector, Sound System, Microphones",
            description: "Large conference hall suitable for meetings, presentations, and events with modern audio-visual equipment."
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Approved": return <CheckCircle2 className="h-4 w-4" />;
            case "Pending": return <Clock className="h-4 w-4" />;
            case "Rejected": return <XCircle className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Approved": 
                return <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors">Approved</Badge>;
            case "Pending": 
                return <Badge className="bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors">Pending</Badge>;
            case "Rejected": 
                return <Badge className="bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors">Rejected</Badge>;
            default: 
                return <Badge className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors">{status}</Badge>;
        }
    };

    const handleViewProgramDetails = (training: any) => {
        setSelectedTraining(training);
        setShowTrainingDialog(true);
    };

    const handleViewBookingSummary = (rental: any) => {
        setSelectedRental(rental);
        setShowRentalDialog(true);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">{user?.name}'s Dashboard</h1>
                    <p className="text-blue-100 text-sm">Manage your training registrations and facility rental requests</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Trainings Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-4">
                            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">My Training Applications</h2>
                        </div>
                        
                        {registeredTrainings.map((t) => (
                            <Card key={t.id} className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:border-gray-200">
                                <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-row justify-between items-center space-y-0">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Applied: {t.dateApplied}</span>
                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{t.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 text-xs font-medium uppercase tracking-widest bg-white">
                                        {getStatusIcon(t.status)}
                                        <span className="ml-2">{getStatusBadge(t.status)}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.title}</h3>
                                    <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg flex gap-4">
                                        <Info className="h-5 w-5 text-gray-500 shrink-0" />
                                        <p className="text-sm text-gray-600 italic leading-relaxed">
                                            {t.details}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button 
                                            variant="link" 
                                            className="text-blue-600 font-semibold uppercase tracking-widest text-[10px] hover:text-blue-700 transition-colors"
                                            onClick={() => handleViewProgramDetails(t)}
                                        >
                                            View Program Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Rentals Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-4">
                            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">My Facility Requests</h2>
                        </div>
                        
                        {rentalRequests.map((r) => (
                            <Card key={r.id} className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:border-gray-200">
                                <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-row justify-between items-center space-y-0">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Requested: {r.dateRequested}</span>
                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{r.campus}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 text-xs font-medium uppercase tracking-widest bg-white">
                                        {getStatusIcon(r.status)}
                                        <span className="ml-2">{getStatusBadge(r.status)}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{r.facility}</h3>
                                    <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg flex gap-4">
                                        <Info className="h-5 w-5 text-gray-500 shrink-0" />
                                        <p className="text-sm text-gray-600 italic leading-relaxed">
                                            {r.details}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button 
                                            variant="link" 
                                            className="text-green-600 font-semibold uppercase tracking-widest text-[10px] hover:text-green-700 transition-colors"
                                            onClick={() => handleViewBookingSummary(r)}
                                        >
                                            View Booking Summary
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        {rentalRequests.length === 0 && (
                            <div className="text-center py-20">
                                <div className="bg-white border border-gray-100 rounded-lg p-12">
                                    <Building className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Rental Requests Found</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        You haven't made any facility rental requests yet. Browse available facilities and submit your first booking.
                                    </p>
                                    <div className="mt-6">
                                        <Button asChild className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg px-8 py-4 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                                            <Link to="/public/rentals" className="flex items-center gap-2">
                                                <Building className="h-6 w-6" />
                                                Browse Facilities
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Training Details Dialog */}
            <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {selectedTraining?.title}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-gray-600">
                            Training Program Details
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTraining && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedTraining.description}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Instructor</p>
                                        <p className="text-gray-600">{selectedTraining.instructor}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Duration</p>
                                        <p className="text-gray-600">{selectedTraining.duration}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Schedule</p>
                                        <p className="text-gray-600">{selectedTraining.schedule}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Location</p>
                                        <p className="text-gray-600">{selectedTraining.location}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                                <Info className="h-5 w-5 text-blue-600" />
                                <p className="text-sm text-blue-800">
                                    {selectedTraining.details}
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowTrainingDialog(false)}
                                >
                                    Close
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Contact Instructor
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Booking Summary Dialog */}
            <Dialog open={showRentalDialog} onOpenChange={setShowRentalDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {selectedRental?.facility}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-gray-600">
                            Booking Summary
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRental && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedRental.description}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Requested Date</p>
                                        <p className="text-gray-600">{selectedRental.requestedDate}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Time Slot</p>
                                        <p className="text-gray-600">{selectedRental.timeSlot}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Campus</p>
                                        <p className="text-gray-600">{selectedRental.campus}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Capacity</p>
                                        <p className="text-gray-600">{selectedRental.capacity}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Purpose</p>
                                        <p className="text-gray-600">{selectedRental.purpose}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Equipment</p>
                                        <p className="text-gray-600">{selectedRental.equipment}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                                <Info className="h-5 w-5 text-green-600" />
                                <p className="text-sm text-green-800">
                                    {selectedRental.details}
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowRentalDialog(false)}
                                >
                                    Close
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Make New Booking
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PublicDashboard;
