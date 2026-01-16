import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2, Save, RefreshCw, User as UserIcon, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";

interface ProfileFormData {
    name: string;
    email: string;
}

export default function Profile() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormData>({
        defaultValues: {
            name: "",
            email: "",
        },
        mode: "onChange",
    });

    // Update form when user data loads
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user, form]);

    const onSubmit = async (data: ProfileFormData) => {
        if (!data.name.trim()) {
            form.setError("name", { type: "manual", message: "Full name is required" });
            return;
        }

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update local storage for simulation
            const savedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
            const updatedUser = { ...savedUser, name: data.name };
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));

            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <PageHeader
                title="My Profile"
                description="Manage your personal information and account details"
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 shadow-md border-t-4 border-t-aau-red">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-aau-red" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Email Address
                                    </label>
                                    <Input
                                        value={user?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email address cannot be changed.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        Role
                                    </label>
                                    <Input
                                        value={user?.role || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your role is assigned by the system.
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => user && form.reset({ name: user.name, email: user.email })}
                                        disabled={isSaving}
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-aau-red hover:bg-red-700 text-white min-w-[140px]"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
