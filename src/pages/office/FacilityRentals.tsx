import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Building, CheckCircle, XCircle, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialRentals = [
    { id: "R001", facility: "Nelson Mandela Hall", requester: "Debub Global Bank", date: "2025-01-15", status: "Pending", payment: "Unpaid" },
    { id: "R002", facility: "ICT Center Conference", requester: "Tech Ethiopia 2025", date: "2025-01-20", status: "Pending", payment: "Unpaid" },
    { id: "R003", facility: "Main Lab A", requester: "Zemen Bank", date: "2025-01-10", status: "Approved", payment: "Paid" },
];

const FacilityRentals = () => {
    const [rentals, setRentals] = useState(initialRentals);
    const [filter, setFilter] = useState("All");

    const handleAction = (id: string, action: "Approved" | "Rejected") => {
        setRentals(rentals.map(r => r.id === id ? { ...r, status: action } : r));
        toast.success(`Rental ${id} ${action} successfully`);
    };

    const filteredRentals = filter === "All" ? rentals : rentals.filter(r => r.status === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Facility Rentals"
                description="Review and coordinate facility bookings for external events"
            />

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="bg-gray-100 p-1 rounded-sm h-auto overflow-x-auto">
                                <TabsTrigger value="All" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-red">All Requests</TabsTrigger>
                                <TabsTrigger value="Pending" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-red">Pending</TabsTrigger>
                                <TabsTrigger value="Approved" className="rounded-sm text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-aau-red">Approved</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input placeholder="Search rentals..." className="pl-9 h-10 text-xs" />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredRentals.map((r) => (
                            <div key={r.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:border-aau-red transition-colors bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <Building className="h-5 w-5 text-aau-red" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{r.facility}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {r.id}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-medium flex items-center gap-1">
                                                <Calendar className="h-2.5 w-2.5" /> {r.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                    <div className="flex flex-col items-end mr-4">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Requester</span>
                                        <span className="text-xs font-bold text-gray-800">{r.requester}</span>
                                    </div>

                                    <Badge
                                        variant={r.payment === "Paid" ? "success" : "warning"}
                                        className="rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-tighter"
                                    >
                                        {r.payment}
                                    </Badge>

                                    {r.status === "Pending" ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 border-green-600 text-green-600 hover:bg-green-50 rounded-none text-[10px] font-bold" onClick={() => handleAction(r.id, "Approved")}>APPROVE</Button>
                                            <Button size="sm" variant="outline" className="h-8 border-red-600 text-red-600 hover:bg-red-50 rounded-none text-[10px] font-bold" onClick={() => handleAction(r.id, "Rejected")}>REJECT</Button>
                                        </div>
                                    ) : (
                                        <Badge variant={r.status === "Approved" ? "success" : "destructive"}>{r.status}</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacilityRentals;
