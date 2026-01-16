import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Calendar, Building, User, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const mockRentalRequests = [
  {
    id: "RR001",
    applicantName: "Debub Global Bank",
    applicantEmail: "events@debubbank.com",
    requestedItem: "Nelson Mandela Hall",
    submissionDate: "2025-01-15",
    status: "Pending",
    motivation: "Annual general meeting for shareholders and board members",
    notes: "Expected attendance: 200 people, needs audio equipment"
  },
  {
    id: "RR002",
    applicantName: "Tech Ethiopia 2025",
    applicantEmail: "info@techethiopia.org",
    requestedItem: "ICT Center Conference Room",
    submissionDate: "2025-01-20",
    status: "Approved",
    motivation: "Technology conference and startup showcase event",
    notes: "3-day event, requires parking arrangements"
  },
  {
    id: "RR003",
    applicantName: "Zemen Bank",
    applicantEmail: "training@zemenbank.com",
    requestedItem: "Main Laboratory A",
    submissionDate: "2025-01-10",
    status: "Rejected",
    motivation: "Staff training program on new banking software",
    notes: "Requested dates conflict with university exam schedule"
  }
];

const RentalRequests = () => {
  const [requests, setRequests] = useState(mockRentalRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRentalRequests[0] | null>(null);

  const filteredRequests = requests.filter(request =>
    request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      setRequests(requests.map(req => req.id === id ? { ...req, status: "Approved" } : req));
      setProcessingId(null);
      toast.success(`Request ${id} approved successfully`);
    }, 1000);
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      setRequests(requests.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
      setProcessingId(null);
      toast.success(`Request ${id} rejected successfully`);
    }, 1000);
  };

  const handleView = (request: typeof mockRentalRequests[0]) => {
    setSelectedRequest(request);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "warning",
      Approved: "success", 
      Rejected: "destructive"
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Rental Requests"
        description="Review and manage facility rental applications submitted by public users"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by organization name, facility name, or request ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-sm h-auto overflow-x-auto">
              <TabsTrigger value="all" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                All Requests
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-blue">
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <RequestTable 
                requests={filteredRequests}
                processingId={processingId}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusBadge={getStatusBadge}
                onView={handleView}
              />
            </TabsContent>

            <TabsContent value="pending">
              <RequestTable 
                requests={filteredRequests.filter(req => req.status === "Pending")}
                processingId={processingId}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusBadge={getStatusBadge}
                onView={handleView}
              />
            </TabsContent>

            <TabsContent value="approved">
              <RequestTable 
                requests={filteredRequests.filter(req => req.status === "Approved")}
                processingId={processingId}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusBadge={getStatusBadge}
                onView={handleView}
              />
            </TabsContent>

            <TabsContent value="rejected">
              <RequestTable 
                requests={filteredRequests.filter(req => req.status === "Rejected")}
                processingId={processingId}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusBadge={getStatusBadge}
                onView={handleView}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rental Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <RentalRequestDetails 
              request={selectedRequest}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface RequestTableProps {
  requests: typeof mockRentalRequests;
  processingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onView: (request: typeof mockRentalRequests[0]) => void;
}

const RequestTable = ({ requests, processingId, onApprove, onReject, getStatusBadge, onView }: RequestTableProps) => {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 font-bold">Applicant Name</th>
            <th className="px-6 py-4 font-bold">Requested Item</th>
            <th className="px-6 py-4 font-bold">Submission Date</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{request.applicantName}</span>
                  <span className="text-[10px] text-gray-500">{request.applicantEmail}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-aau-red" />
                  <span className="font-medium">{request.requestedItem}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-600">{request.submissionDate}</span>
                </div>
              </td>
              <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
              <td className="px-6 py-4 text-right">
                {request.status === "Pending" ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="View Details"
                      onClick={() => onView(request)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={processingId === request.id}
                      onClick={() => onApprove(request.id)}
                      title="Approve"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={processingId === request.id}
                      onClick={() => onReject(request.id)}
                      title="Reject"
                    >
                      <span className="h-4 w-4 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white text-xs">×</span>
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="View Details"
                      onClick={() => onView(request)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Processed</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Rental Request Details Dialog Component
interface RentalRequestDetailsProps {
  request: typeof mockRentalRequests[0];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

const RentalRequestDetails = ({ request, onApprove, onReject, onClose }: RentalRequestDetailsProps) => {
  const [processing, setProcessing] = useState(false);

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => {
      onApprove(request.id);
      onClose();
    }, 1000);
  };

  const handleReject = () => {
    setProcessing(true);
    setTimeout(() => {
      onReject(request.id);
      onClose();
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "warning",
      Approved: "success", 
      Rejected: "destructive"
    } as const;
    
    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wider"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Request ID: {request.id}</h3>
          <p className="text-sm text-gray-600">Submitted on {request.submissionDate}</p>
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-4 w-4" />
            Applicant Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Organization Name</label>
              <p className="font-semibold">{request.applicantName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Email Address</label>
              <p className="font-semibold">{request.applicantEmail}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Additional Requirements</label>
              <p className="text-sm text-gray-700">{request.notes}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Facility Details
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Requested Facility</label>
              <p className="font-semibold">{request.requestedItem}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Current Status</label>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Motivation & Event Purpose</h4>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{request.motivation}</p>
        </div>
      </div>

      {request.status === "Pending" && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2 inline" />
                Approve Request
              </>
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                Processing...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2 inline" />
                Reject Request
              </>
            )}
          </button>
        </div>
      )}

      {request.status !== "Pending" && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 font-medium">
            This request has been {request.status.toLowerCase()} and cannot be modified.
          </p>
        </div>
      )}
    </div>
  );
};

export default RentalRequests;
