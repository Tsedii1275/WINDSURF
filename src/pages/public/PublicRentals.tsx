import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const facilities = [
    {
        id: 1,
        name: "Nelson Mandela Hall",
        campus: "Main Campus (6 Killow)",
        capacity: "1,500 Seats",
        type: "Auditorium",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "ICT Center Conference Room",
        campus: "ICT Park",
        capacity: "50 Seats",
        type: "Meeting Room",
        image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Main Laboratory A",
        campus: "Science Faculty",
        capacity: "40 Workstations",
        type: "Laboratory",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
    }
];

const PublicRentals = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
            <div className="border-b-2 border-aau-blue pb-4 mb-12">
                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Facility Rentals</h1>
                <p className="text-gray-600 mt-2">Rent our world-class facilities for your corporate events, research, or training.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {facilities.map((f) => (
                    <div key={f.id} className="border border-gray-200 group hover:shadow-xl transition-all duration-300">
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-aau-blue text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">{f.type}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-2 truncate">{f.name}</h2>
                            <div className="space-y-1 mb-6">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{f.campus}</p>
                                <p className="text-xs text-gray-600">Capacity: {f.capacity}</p>
                            </div>
                            <Button asChild className="w-full bg-gray-900 hover:bg-aau-blue text-white rounded-none py-6 font-bold uppercase tracking-widest text-[10px]">
                                <Link to="/public/registration">Request Booking</Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicRentals;
