import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, PieChart as PieChartIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

const reportData = [
    { activity: "Nelson Mandela Hall Rental", category: "Facility", count: 4, revenue: "45,000 ETB" },
    { activity: "Python Training Program", category: "Training", count: 25, revenue: "32,500 ETB" },
    { activity: "ICT Lab Rental", category: "Facility", count: 8, revenue: "12,000 ETB" },
    { activity: "Strategic Leadership Seminar", category: "Training", count: 15, revenue: "15,000 ETB" },
];

const OfficeReports = () => {
    const handleExport = (format: string) => {
        toast.info(`Exporting report as ${format}...`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="Activity Reports"
                    description="View statistical summaries and revenue breakdown for your department"
                />
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-none border-gray-300 text-[10px] font-bold uppercase tracking-widest h-9" onClick={() => handleExport("PDF")}>
                        <Download className="mr-2 h-3 w-3" /> PDF Export
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-none border-gray-300 text-[10px] font-bold uppercase tracking-widest h-9" onClick={() => handleExport("Excel")}>
                        <FileSpreadsheet className="mr-2 h-3 w-3" /> EXCEL
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-aau-red" />
                            Revenue by Activity (Read-only)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reportData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{item.activity}</span>
                                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-tight">{item.category} ({item.count} items)</span>
                                    </div>
                                    <span className="text-sm font-black text-aau-red">{item.revenue}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4 text-aau-red" />
                            Distribution Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="h-32 w-32 rounded-full border-[16px] border-aau-red border-r-gray-200 border-b-gray-400 relative flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">75% Facilities</span>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                <div className="h-2 w-2 bg-aau-red"></div> Facility Revenue
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                <div className="h-2 w-2 bg-gray-400"></div> Training Revenue
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Detailed Monthly Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
                        <p className="text-xs text-gray-400 font-medium italic italic">"Detailed table logs are available in the full report export."</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OfficeReports;
