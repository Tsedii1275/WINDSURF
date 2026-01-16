import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, UserPlus, FileText } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Registration = () => {
    const [mode, setMode] = useState<"apply" | "signup">("apply");
    const [submitted, setSubmitted] = useState(false);
    const { signup, isLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        type: "",
        message: ""
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(formData.name, formData.email, formData.password);
            toast.success("Account created successfully!");
            navigate("/public/dashboard");
        } catch (error) {
            toast.error("Failed to create account.");
        }
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade-in">
                <div className="bg-blue-50 p-12 border-2 border-aau-blue border-dashed">
                    <CheckCircle2 className="h-16 w-16 text-aau-blue mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-4">Application Submitted!</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed italic font-medium">
                        "Your request has been received. Our office will review your application and contact you via email within 3-5 working days."
                    </p>
                    <Button asChild onClick={() => setSubmitted(false)} className="bg-aau-blue hover:bg-blue-900 text-white rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs">
                        <button onClick={() => navigate("/public")}>Back to Home</button>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
            <div className="flex border-b-2 border-gray-100 mb-12">
                <button
                    onClick={() => setMode("apply")}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all ${mode === "apply" ? "border-aau-blue text-aau-blue bg-blue-50/50" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                    <FileText className="h-4 w-4" /> Quick Application
                </button>
                <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all ${mode === "signup" ? "border-aau-blue text-aau-blue bg-blue-50/50" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                    <UserPlus className="h-4 w-4" /> Create Account
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                    {mode === "apply" ? "Instant Registration" : "Join the AAU Portal"}
                </h1>
                <p className="text-gray-600 mt-2 font-medium">
                    {mode === "apply"
                        ? "Submit a quick request for training or facilities without an account."
                        : "Create an account to track your applications, view statuses, and manage your rentals."}
                </p>
            </div>

            <form onSubmit={mode === "apply" ? handleApply : handleSignup} className="space-y-8 bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name *</Label>
                        <Input
                            id="fullname"
                            placeholder="Abebe Kebede"
                            className="rounded-none border-gray-300 h-12 focus:border-aau-blue focus:ring-0"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            className="rounded-none border-gray-300 h-12 focus:border-aau-blue focus:ring-0"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                {mode === "signup" && (
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password *</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-none border-gray-300 h-12 focus:border-aau-blue focus:ring-0"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                )}

                {mode === "apply" && (
                    <>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number *</Label>
                                <Input id="phone" placeholder="+251 ..." className="rounded-none border-gray-300 h-12 focus:border-aau-blue focus:ring-0" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Request Type *</Label>
                                <select id="type" className="w-full h-12 px-3 py-2 text-sm border border-gray-300 bg-white rounded-none focus:outline-none focus:border-aau-blue font-medium" required>
                                    <option value="">Select an option</option>
                                    <option value="training">Training Program</option>
                                    <option value="facility">Facility Rental</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Additional Details</Label>
                            <Textarea id="message" placeholder="Provide more information about your request..." className="rounded-none border-gray-300 focus:border-aau-blue focus:ring-0 min-h-[120px]" />
                        </div>
                    </>
                )}

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full h-14 bg-aau-blue hover:bg-blue-900 text-white rounded-none font-bold uppercase tracking-widest text-xs"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : mode === "apply" ? "Submit Application" : "Create Account"}
                    </Button>
                    <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-tighter">
                        By proceeding, you agree to AAU's resource usage terms and privacy guidelines.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Registration;
