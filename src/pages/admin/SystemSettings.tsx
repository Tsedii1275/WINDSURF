import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Server, Database, Shield, Bell, Clock, Globe, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import aauLogo from "@/assets/aau-logo.png";

const DEFAULT_MODULES = [
  { id: "training", name: "Training Management", enabled: true, description: "Manage training programs" },
  { id: "rental", name: "Facility Rental", enabled: true, description: "Handle facility bookings" },
  { id: "reporting", name: "Advanced Reporting", enabled: true, description: "Generate detailed reports" },
  { id: "notifications", name: "Email Notifications", enabled: false, description: "Send email alerts" },
  { id: "api", name: "External API Access", enabled: false, description: "Third-party integrations" },
];

const DEFAULT_WORKFLOWS = [
  { id: "user_creation", name: "User Creation Approval", enabled: true, description: "Require approval for new users" },
  { id: "campus_changes", name: "Campus Changes Approval", enabled: true, description: "Approve campus modifications" },
  { id: "role_assignment", name: "Role Assignment Approval", enabled: false, description: "Approve role changes" },
  { id: "facility_booking", name: "Facility Booking Approval", enabled: true, description: "Approve facility requests" },
];

export default function SystemSettings() {
  const { toast } = useToast();
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [workflows, setWorkflows] = useState(DEFAULT_WORKFLOWS);
  const [isSaving, setIsSaving] = useState(false);

  const handleModuleToggle = (id: string) => {
    setModules(prev => prev.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handleWorkflowToggle = (id: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Settings Saved",
      description: "System configuration has been updated successfully.",
    });
    setIsSaving(false);
  };

  const handleReset = () => {
    setModules(DEFAULT_MODULES);
    setWorkflows(DEFAULT_WORKFLOWS);
    toast({
      title: "Settings Reset",
      description: "All configuration values have been restored to default.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="System Settings"
        description="Configure system modules and approval workflows"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              className="bg-aau-gradient hover:opacity-90 min-w-[140px]"
              onClick={handleSave}
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
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Modules */}
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">System Modules</CardTitle>
            </div>
            <CardDescription>
              Enable or disable system modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <Label htmlFor={module.id} className="text-sm font-medium cursor-pointer">
                    {module.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
                <Switch
                  id={module.id}
                  checked={module.enabled}
                  onCheckedChange={() => handleModuleToggle(module.id)}
                  disabled={isSaving}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Approval Workflows */}
        <Card className="border-l-4 border-l-aau-red shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-aau-red" />
              <CardTitle className="text-lg">Approval Workflows</CardTitle>
            </div>
            <CardDescription>
              Configure approval requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <Label htmlFor={workflow.id} className="text-sm font-medium cursor-pointer">
                    {workflow.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">{workflow.description}</p>
                </div>
                <Switch
                  id={workflow.id}
                  checked={workflow.enabled}
                  onCheckedChange={() => handleWorkflowToggle(workflow.id)}
                  disabled={isSaving}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={aauLogo} alt="AAU" className="h-10 w-10 object-contain" />
                <div>
                  <CardTitle className="text-lg text-primary">System Information</CardTitle>
                  <CardDescription>
                    Read-only system metadata
                  </CardDescription>
                </div>
              </div>
              <Badge variant="default" className="bg-success">Operational</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">System Version</Label>
                </div>
                <Input value="URTFMS v2.1.0" disabled className="bg-muted font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Last Updated</Label>
                </div>
                <Input value="January 7, 2025" disabled className="bg-muted font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Database Status</Label>
                </div>
                <Input value="Connected" disabled className="bg-muted font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Server className="h-4 w-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Environment</Label>
                </div>
                <Input value="Production" disabled className="bg-muted font-mono text-xs" />
              </div>
            </div>
            <Separator className="my-6 opacity-50" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization</Label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-semibold text-foreground">Addis Ababa University</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Administrator</Label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-semibold text-foreground">ICT Department</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
