import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, UserPlus, Phone } from "lucide-react";
import { toast } from "sonner";
import aauLogo from "@/assets/aau-logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });
    const { login, signup, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);

        // Redirection is handled by a side effect or manually here
        // Based on the role, navigate to the correct dashboard
        // We'll use a short delay to ensure state is updated or check role immediately
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            await signup(signupData.name, signupData.email, signupData.password);
            toast.success("Account created successfully!");
            navigate("/public/dashboard");
        } catch (error) {
            toast.error("Failed to create account.");
        }
    };

    // Listen for user change to redirect
    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            if (user.role === "SYSTEM_ADMIN") {
                navigate("/admin/dashboard");
            } else if (user.role === "OFFICE_USER") {
                navigate("/office/dashboard");
            } else if (user.role === "PUBLIC") {
                navigate("/public/dashboard");
            }
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <Card className="w-full max-w-md border-none shadow-2xl rounded-none mx-auto my-8">
                <CardHeader className="space-y-4 flex flex-col items-center border-b-4 border-aau-blue px-8 py-6">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">
                        {isSignup ? "Create Account" : "Sign In"}
                    </CardTitle>
                    <CardDescription className="text-center font-medium">
                        {isSignup 
                            ? "Join AAU Resource Portal" 
                            : "Access to Resource & Training Facility Management System"
                        }
                    </CardDescription>
                </CardHeader>
                
                {isSignup ? (
                    <form onSubmit={handleSignup}>
                        <CardContent className="space-y-4 mt-8 px-8">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Full Name</Label>
                                <div className="relative">
                                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Abebe Kebede"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={signupData.name}
                                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="signup-email" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="phone" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+251 91 123 4567"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={signupData.phone}
                                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="signup-password" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="confirm-password" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={signupData.confirmPassword}
                                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 mt-8 pb-8 px-8">
                            <Button
                                type="submit"
                                className="w-full bg-aau-blue hover:bg-blue-900 text-white font-bold py-6 rounded-none uppercase tracking-widest text-xs"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                            <div className="text-xs text-center border-t border-gray-100 pt-6 w-full">
                                <p className="text-gray-500 font-medium">Already have an account?</p>
                                <Button 
                                    type="button"
                                    onClick={() => setIsSignup(false)}
                                    variant="link" 
                                    className="text-aau-blue font-bold uppercase tracking-widest text-[10px] mt-1 h-auto p-0 hover:underline"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-6 mt-8 px-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password" className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-none h-12 border-gray-300 focus-visible:ring-aau-blue"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 mt-8 pb-8 px-8">
                            <Button
                                type="submit"
                                className="w-full bg-aau-blue hover:bg-blue-900 text-white font-bold py-6 rounded-none uppercase tracking-widest text-xs"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Login to Dashboard"
                                )}
                            </Button>
                            <div className="text-xs text-center border-t border-gray-100 pt-6 w-full">
                                <p className="text-gray-500 font-medium">Don't have an account?</p>
                                <Button 
                                    type="button"
                                    onClick={() => setIsSignup(true)}
                                    variant="link" 
                                    className="text-aau-blue font-bold uppercase tracking-widest text-[10px] mt-1 h-auto p-0 hover:underline"
                                >
                                    Create Public Account
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default Login;
