import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, BookOpen, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TrainingRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestedItem: string;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
  motivation: string;
  notes: string;
}

const mockRequests: TrainingRequest[] = [
  {
    id: "TR001",
    applicantName: "Abebe Kebede",
    applicantEmail: "abebe@gmail.com",
    requestedItem: "Python for Data Science",
    submissionDate: "2025-01-08",
    status: "Pending",
    motivation: "Looking to enhance my data analysis skills for my research work. This training will help me process large datasets more efficiently and apply advanced machine learning techniques to my academic projects.",
    notes: "Graduate student in Computer Science department, currently working on thesis related to predictive analytics."
  },
  {
    id: "TR002", 
    applicantName: "Sarah Michael",
    applicantEmail: "sarah.m@yahoo.com",
    requestedItem: "Project Management",
    submissionDate: "2025-01-07",
    status: "Approved",
    motivation: "Need PMP certification for career advancement. My current role requires better project coordination skills and this training will help me lead cross-functional teams effectively.",
    notes: "Works at Ethiopian Airlines as Operations Coordinator, 5 years of experience."
  },
  {
    id: "TR003",
    applicantName: "Dawit Samuel", 
    applicantEmail: "dawit@aau.edu.et",
    requestedItem: "Strategic Leadership",
    submissionDate: "2025-01-06",
    status: "Rejected",
    motivation: "Leadership development for management role. I'm transitioning to department head position and need strategic planning skills.",
    notes: "Faculty member in Business School, being considered for department chair position."
  }
];

const TrainingRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TrainingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const foundRequest = mockRequests.find(req => req.id === id);
    setRequest(foundRequest || null);
    setLoading(false);
  }, [id]);

  const handleApprove = () => {
    if (!request) return;
    
    setProcessing(true);
    setTimeout(() => {
      setRequest({ ...request, status: "Approved" });
      setProcessing(false);
      toast.success(`Training request ${request.id} approved successfully`);
    }, 1000);
  };

  const handleReject = () => {
    if (!request) return;
    
    setProcessing(true);
    setTimeout(() => {
      setRequest({ ...request, status: "Rejected" });
      setProcessing(false);
      toast.success(`Training request ${request.id} rejected successfully`);
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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Request Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">The training request you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Training Request Details</h1>
            <p className="text-sm text-gray-600">Request ID: {request.id}</p>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-aau-blue" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="font-semibold">{request.applicantName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{request.applicantEmail}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Additional Notes</label>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-aau-blue" />
              Training Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Requested Training</label>
              <p className="font-semibold">{request.requestedItem}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Submission Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{request.submissionDate}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Motivation & Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{request.motivation}</p>
          </div>
        </CardContent>
      </Card>

      {request.status === "Pending" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={processing}
                variant="destructive"
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {request.status !== "Pending" && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">
                This request has been {request.status.toLowerCase()} and cannot be modified.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingRequestDetails;
