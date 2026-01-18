import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialTrainings = [
    { id: "T001", name: "Python for Data Science", applicant: "Abebe Kebede", date: "2025-01-08", status: "Pending", email: "abebe@gmail.com" },
    { id: "T002", name: "Project Management", applicant: "Sarah Michael", date: "2025-01-07", status: "Pending", email: "sarah.m@yahoo.com" },
    { id: "T003", name: "Strategic Leadership", applicant: "Dawit Samuel", date: "2025-01-06", status: "Pending", email: "dawit@aau.edu.et" },
];

const TrainingApprovals = () => {
    const [trainings, setTrainings] = useState(initialTrainings);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAction = (id: string, action: "Approved" | "Rejected") => {
        setProcessingId(id);
        setTimeout(() => {
            setTrainings(trainings.map(t => t.id === id ? { ...t, status: action } : t));
            setProcessingId(null);
            toast.success(`Request ${id} ${action} successfully`);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Training Approvals"
                description="Review and manage student and external training applications"
            />

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search applicants or programs..." className="pl-10" />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                    </div>

                    <div className="relative overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Request ID</th>
                                    <th className="px-6 py-4 font-bold">Training Program</th>
                                    <th className="px-6 py-4 font-bold">Applicant Details</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainings.map((t) => (
                                    <tr key={t.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{t.id}</td>
                                        <td className="px-6 py-4 font-medium">{t.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{t.applicant}</span>
                                                <span className="text-[10px] text-gray-500">{t.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={t.status === "Approved" ? "success" : t.status === "Pending" ? "warning" : "destructive"}
                                                className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                            >
                                                {t.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {t.status === "Pending" ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        disabled={processingId === t.id}
                                                        onClick={() => handleAction(t.id, "Approved")}
                                                        title="Approve"
                                                    >
                                                        {processingId === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        disabled={processingId === t.id}
                                                        onClick={() => handleAction(t.id, "Rejected")}
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrainingApprovals;
