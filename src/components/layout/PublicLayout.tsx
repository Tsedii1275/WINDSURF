import { Link, Outlet, useNavigate } from "react-router-dom";
import aauLogo from "@/assets/aau-logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export function PublicLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/public");
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            {/* AAU Institutional Header */}
            <header className="border-b-4 border-aau-blue">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo Section */}
                        <Link to="/public" className="flex items-center gap-4">
                            <img src={aauLogo} alt="AAU Logo" className="h-16 w-16" />
                            <div className="flex flex-col border-l-2 border-aau-blue pl-4">
                                <span className="text-sm font-semibold text-aau-blue leading-tight uppercase">አዲስ አበባ ዩኒቨርሲቲ</span>
                                <span className="text-xl font-bold tracking-tight text-aau-red leading-tight">ADDIS ABABA UNIVERSITY</span>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/public" className="text-sm font-bold text-gray-700 hover:text-aau-blue transition-colors">HOME</Link>
                            <Link to="/public/trainings" className="text-sm font-bold text-gray-700 hover:text-aau-blue transition-colors">TRAININGS</Link>
                            <Link to="/public/rentals" className="text-sm font-bold text-gray-700 hover:text-aau-blue transition-colors">FACILITIES</Link>
                            {user ? (
                                <>
                                    <Link to="/public/dashboard" className="text-sm font-bold text-aau-blue hover:underline transition-colors">MY DASHBOARD</Link>
                                    <Button onClick={handleLogout} variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-none border-2 px-6 h-10">
                                        <span className="font-bold uppercase tracking-wider text-xs">Logout</span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/public/registration" className="text-sm font-bold text-gray-700 hover:text-aau-blue transition-colors">REGISTRATION</Link>
                                    <Button asChild variant="outline" className="border-aau-blue text-aau-blue hover:bg-aau-blue hover:text-white rounded-none border-2 px-6 h-10">
                                        <Link to="/login" className="font-bold uppercase tracking-wider text-xs">Login</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Institutional Footer */}
            <footer className="bg-gray-100 border-t border-gray-200 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-aau-blue inline-block pb-1">About AAU</h3>
                            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto sm:mx-0">
                                Addis Ababa University (AAU), which was established in 1950 as the University College of Addis Ababa (UCAA), is the oldest and the largest higher learning and research institution in Ethiopia.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-aau-blue inline-block pb-1">Quick Links</h3>
                            <ul className="text-xs text-gray-600 space-y-2 uppercase font-medium">
                                <li><Link to="/public/trainings" className="hover:text-aau-blue">Upcoming Trainings</Link></li>
                                <li><Link to="/public/rentals" className="hover:text-aau-blue">Facility Catalog</Link></li>
                                <li><Link to="/public/registration" className="hover:text-aau-blue">Apply for Training</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-aau-blue inline-block pb-1">Contact Us</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Addis Ababa University<br />
                                P.O. Box 1176<br />
                                Addis Ababa, Ethiopia<br />
                                Email: info@aau.edu.et
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            © 2025 ADDIS ABABA UNIVERSITY. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
