import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Building, ClipboardCheck, ArrowRight, Users, Calendar, MapPin, CheckCircle, UserPlus, CheckCircle2, Lock } from "lucide-react";

const PublicHome = () => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                            AAU Resource Portal
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-light text-gray-600 mb-8">
                            Your Gateway to Excellence
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                            Access world-class training programs and state-of-the-art facilities at Addis Ababa University. 
                            Designed for students, faculty, and external partners seeking professional development.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 py-5 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                            <Link to="/public/trainings" className="flex items-center gap-3">
                                <GraduationCap className="h-6 w-6" />
                                Explore Training Programs
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white rounded-xl px-10 py-5 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                            <Link to="/public/rentals" className="flex items-center gap-3">
                                <Building className="h-6 w-6" />
                                Reserve Facilities
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Choose AAU Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose AAU?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of successful graduates who started their journey with AAU's comprehensive resource management platform.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                                <CheckCircle className="h-12 w-12 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Access</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Simple, intuitive application process designed for seamless user experience
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-green-200 transition-colors duration-300">
                                <Calendar className="h-12 w-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Updates</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Instant notifications on application status and important deadlines
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-200 transition-colors duration-300">
                                <Users className="h-12 w-12 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Guidance</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Learn from industry professionals and experienced faculty members
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive solutions designed to meet your academic and professional development needs.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Training Programs */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <GraduationCap className="h-10 w-10 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Professional Training</h3>
                            <p className="text-xl text-gray-600 mb-8 text-center leading-relaxed">
                                Industry-relevant courses taught by experienced faculty
                            </p>
                            <ul className="text-left text-gray-600 space-y-4 mb-8">
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Cutting-edge curriculum</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Expert instructors</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Flexible scheduling</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <Link to="/public/trainings" className="inline-flex items-center text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">
                                    View All Programs
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                        
                        {/* Facility Rentals */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <Building className="h-10 w-10 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Facility Rentals</h3>
                            <p className="text-xl text-gray-600 mb-8 text-center leading-relaxed">
                                Modern venues for events and activities
                            </p>
                            <ul className="text-left text-gray-600 space-y-4 mb-8">
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Smart booking system</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">24/7 availability</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Equipment support</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <Link to="/public/rentals" className="inline-flex items-center text-green-600 font-bold text-lg hover:text-green-700 transition-colors">
                                    Browse Facilities
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="bg-blue-50 rounded-2xl p-12">
                            <div className="text-5xl font-bold text-blue-600 mb-6">500+</div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Training Programs</h3>
                            <p className="text-lg text-gray-600">Available courses</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-12">
                            <div className="text-5xl font-bold text-green-600 mb-6">50+</div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Facilities</h3>
                            <p className="text-lg text-gray-600">Modern venues</p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-12">
                            <div className="text-5xl font-bold text-purple-600 mb-6">1000+</div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Active Users</h3>
                            <p className="text-lg text-gray-600">Satisfied students</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEST SECTION - This should be visible */}
            <section className="py-10 bg-red-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">TEST: This should be visible!</h2>
                    <p className="text-red-500">If you can see this, the changes are working.</p>
                </div>
            </section>

            {/* Signup Card Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">New to AAU?</h2>
                        <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                            Create your account to access exclusive training programs and state-of-the-art facilities.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                            <div className="text-center mb-6">
                                <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
                                <p className="text-gray-600">Join our community and start your journey</p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold">✓ Track Applications</span>
                                    <p className="text-xs">Monitor your training requests</p>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold">✓ Reserve Facilities</span>
                                    <p className="text-xs">Book venues and equipment</p>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold">✓ Access Resources</span>
                                    <p className="text-xs">Digital learning materials</p>
                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                                    <Link to="/public/registration" className="flex items-center gap-3">
                                        <UserPlus className="h-5 w-5" />
                                        Create Your Account
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
                            <div className="text-center mb-6">
                                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Already Have an Account?</h3>
                                <p className="text-gray-600">Sign in to access your personalized dashboard</p>
                            </div>
                            <div className="text-center mt-6">
                                <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-8 py-4 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                                    <Link to="/login" className="flex items-center gap-3">
                                        <Users className="h-5 w-5" />
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
                    <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join thousands of students and professionals advancing their careers with AAU's world-class resources.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-center">
                        <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 rounded-xl px-12 py-6 font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105">
                            <Link to="/public/trainings" className="flex items-center gap-3">
                                <GraduationCap className="h-7 w-7" />
                                Browse Training Programs
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-xl px-12 py-6 font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105">
                            <Link to="/public/rentals" className="flex items-center gap-3">
                                <Building className="h-7 w-7" />
                                Reserve Facilities
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PublicHome;
