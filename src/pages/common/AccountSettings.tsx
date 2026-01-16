import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield, KeyRound, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function AccountSettings() {
    const { toast } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const form = useForm<ChangePasswordForm>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: ChangePasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
            form.setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
            return;
        }

        setIsChangingPassword(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Success",
                description: "Password changed successfully.",
            });
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to change password.",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <PageHeader
                title="Account Settings"
                description="Manage your account security and authentication preferences"
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Change Password Card */}
                <Card className="md:col-span-2 shadow-md border-t-4 border-t-aau-red">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-aau-red" />
                            Change Password
                        </CardTitle>
                        <CardDescription>
                            Update your account password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password *</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password *</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormDescription>Min 8 characters.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password *</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pt-4 border-t">
                                    <Button
                                        type="submit"
                                        className="bg-aau-red hover:bg-red-700 text-white"
                                        disabled={isChangingPassword}
                                    >
                                        {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Change Password
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Preferences Card */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-aau-red" />
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <Switch id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Summary Card */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-aau-red" />
                            Account Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Last login: Just now
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Login location: Addis Ababa, Ethiopia
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
