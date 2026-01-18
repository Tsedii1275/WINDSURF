import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ClipboardCheck, Building, CheckCircle, Banknote, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
    { id: 1, type: "Training", name: "Python for Data Science", user: "John Doe", date: "2025-01-08", status: "Pending" },
    { id: 2, type: "Rental", name: "Nelson Mandela Hall", user: "ABC Corp", date: "2025-01-07", status: "Approved" },
    { id: 3, type: "Training", name: "Strategic Leadership", user: "Jane Smith", date: "2025-01-06", status: "Rejected" },
    { id: 4, type: "Rental", name: "ICT Lab A", user: "Tech Hub", date: "2025-01-05", status: "Pending" },
];

const OfficeDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Campus Admin Dashboard"
                description="Manage training programs and facility rentals for your department"
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Pending Trainings"
                    value="12"
                    icon={Clock}
                    description="Awaiting review"
                    className="border-l-4 border-l-yellow-500"
                />
                <StatCard
                    title="Pending Rentals"
                    value="8"
                    icon={Building}
                    description="Awaiting approval"
                    className="border-l-4 border-l-orange-500"
                />
                <StatCard
                    title="Approved Activities"
                    value="45"
                    icon={CheckCircle}
                    description="Current month"
                    className="border-l-4 border-l-green-500"
                />
                <StatCard
                    title="Monthly Revenue"
                    value="124,500 ETB"
                    icon={Banknote}
                    description="Read-only"
                    className="border-l-4 border-l-aau-red"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Activity</th>
                                    <th className="px-6 py-4 font-semibold">User/Entity</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivities.map((activity) => (
                                    <tr key={activity.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{activity.name}</span>
                                                <span className="text-[10px] uppercase text-gray-500">{activity.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">{activity.user}</td>
                                        <td className="px-6 py-4">{activity.date}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={activity.status === "Approved" ? "success" : activity.status === "Pending" ? "warning" : "destructive"}
                                                className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                            >
                                                {activity.status}
                                            </Badge>
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

export default OfficeDashboard;
