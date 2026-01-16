import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import aauLogo from "@/assets/aau-logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);

        // Redirection is handled by a side effect or manually here
        // Based on the role, navigate to the correct dashboard
        // We'll use a short delay to ensure state is updated or check role immediately
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md border-none shadow-2xl rounded-none">
                <CardHeader className="space-y-4 flex flex-col items-center border-b-4 border-aau-blue">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Sign In</CardTitle>
                    <CardDescription className="text-center font-medium">
                        Access to Resource & Training Facility Management System
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 mt-8">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                    <CardFooter className="flex flex-col gap-6 mt-4 pb-8">
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
                            <Button asChild variant="link" className="text-aau-blue font-bold uppercase tracking-widest text-[10px] mt-1 h-auto p-0 hover:underline">
                                <Link to="/public/registration">Create Public Account</Link>
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
