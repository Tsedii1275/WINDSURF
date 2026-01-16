import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const trainings = [
    {
        id: 1,
        title: "Advanced Data Science with Python",
        department: "Computer Science",
        duration: "4 Weeks",
        fee: "5,000 ETB",
        status: "Published",
        startDate: "2025-02-15"
    },
    {
        id: 2,
        title: "Strategic Leadership for Public Servants",
        department: "Public Administration",
        duration: "2 Weeks",
        fee: "3,500 ETB",
        status: "Published",
        startDate: "2025-03-01"
    },
    {
        id: 3,
        title: "Environmental Impact Assessment",
        department: "Development Studies",
        duration: "10 Days",
        fee: "Free",
        status: "Published",
        startDate: "2025-02-20"
    }
];

const AvailableTrainings = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
            <div className="border-b-2 border-aau-blue pb-4 mb-12">
                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Available Trainings</h1>
                <p className="text-gray-600 mt-2">Explore and apply for our current professional development programs.</p>
            </div>

            <div className="grid gap-8">
                {trainings.map((t) => (
                    <div key={t.id} className="border border-gray-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-aau-blue transition-colors">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="rounded-none border-gray-400 text-gray-600 uppercase text-[10px] font-bold">
                                    {t.department}
                                </Badge>
                                <span className="text-[10px] font-bold text-aau-blue uppercase tracking-widest px-2 py-0.5 bg-blue-50">Starts: {t.startDate}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{t.title}</h2>
                            <div className="flex gap-4 text-sm text-gray-500 font-medium">
                                <span>Duration: {t.duration}</span>
                                <span>•</span>
                                <span>Fee: {t.fee}</span>
                            </div>
                        </div>
                        <Button asChild className="bg-gray-900 hover:bg-aau-blue text-white rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs h-auto w-full md:w-auto">
                            <Link to="/public/registration">Apply Now</Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableTrainings;
