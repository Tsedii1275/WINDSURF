import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Building2, FileText, Settings, DollarSign, Eye, Edit, Trash, Plus } from "lucide-react";

const roles = [
  { id: "office", name: "Office User", icon: Users, users: 7, description: "Manage training and facility requests" },
];

const permissionGroups = [
  {
    module: "Request Management",
    permissions: [
      { id: "requests.view", name: "View Requests", icon: Eye },
      { id: "requests.approve", name: "Approve Requests", icon: Plus },
      { id: "requests.reject", name: "Reject Requests", icon: Trash },
    ],
  },
  {
    module: "Resource Management",
    permissions: [
      { id: "resources.view", name: "View Resources", icon: Eye },
      { id: "resources.create", name: "Create Resources", icon: Plus },
      { id: "resources.edit", name: "Edit Resources", icon: Edit },
      { id: "resources.delete", name: "Delete Resources", icon: Trash },
    ],
  },
  {
    module: "Reports",
    permissions: [
      { id: "reports.view", name: "View Reports", icon: Eye },
      { id: "reports.export", name: "Export Reports", icon: FileText },
    ],
  },
];

const rolePermissions: Record<string, string[]> = {
  office: ["requests.view", "requests.approve", "requests.reject", "resources.view", "resources.create", "resources.edit", "resources.delete", "reports.view", "reports.export"],
};

export default function RolesPermissions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Roles & Permissions"
        description="Manage system roles and their associated permissions"
      />

      <Tabs defaultValue="ict" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted">
          {roles.map((role) => (
            <TabsTrigger 
              key={role.id} 
              value={role.id} 
              className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <role.icon className="h-3 w-3 mr-1" />
              {role.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role.id} value={role.id}>
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Role Info Card */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <role.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary">
                      <p className="text-2xl font-bold text-secondary-foreground">{role.users}</p>
                      <p className="text-xs text-muted-foreground">Users assigned</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary">
                      <p className="text-2xl font-bold text-secondary-foreground">{rolePermissions[role.id]?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Permissions</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="default" className="bg-success">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Permissions Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {permissionGroups.map((group) => (
                      <div key={group.module} className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          {group.module}
                        </h4>
                        <div className="space-y-2">
                          {group.permissions.map((permission) => {
                            const isGranted = rolePermissions[role.id]?.includes(permission.id);
                            return (
                              <div
                                key={permission.id}
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                                  isGranted ? "bg-success/10" : "bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  checked={isGranted}
                                  disabled
                                  className={isGranted ? "border-success data-[state=checked]:bg-success" : ""}
                                />
                                <permission.icon className={`h-3.5 w-3.5 ${isGranted ? "text-success" : "text-muted-foreground"}`} />
                                <span className={`text-sm ${isGranted ? "text-foreground" : "text-muted-foreground"}`}>
                                  {permission.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
