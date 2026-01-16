import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, Clock, User2, FileText, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const mockLogs = [
  {
    id: 1,
    timestamp: "2025-01-07 14:32:15",
    user: "Abebe Kebede",
    role: "Office User",
    action: "CREATE",
    resource: "Training",
    description: "Created new training: Python for Data Science",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2025-01-07 14:28:42",
    user: "System",
    role: "System",
    action: "UPDATE",
    resource: "Facility",
    description: "Updated Conference Hall availability",
    ip: "127.0.0.1",
  },
  {
    id: 3,
    timestamp: "2025-01-07 13:45:33",
    user: "Sara Hailu",
    role: "Office User",
    action: "APPROVE",
    resource: "Request",
    description: "Approved training request: TR001",
    ip: "192.168.1.101",
  },
  {
    id: 4,
    timestamp: "2025-01-07 12:15:08",
    user: "Meron Alemu",
    role: "Office User",
    action: "VIEW",
    resource: "Report",
    description: "Accessed monthly training report",
    ip: "192.168.1.102",
  },
  {
    id: 5,
    timestamp: "2025-01-07 11:30:22",
    user: "System",
    role: "System",
    action: "BACKUP",
    resource: "Database",
    description: "Automated backup completed",
    ip: "127.0.0.1",
  },
  {
    id: 6,
    timestamp: "2025-01-07 10:15:44",
    user: "Dawit Tesfaye",
    role: "Office User",
    action: "EDIT",
    resource: "Training",
    description: "Updated training details: Project Management",
    ip: "192.168.1.103",
  },
  {
    id: 7,
    timestamp: "2025-01-07 09:30:11",
    user: "Tigist Bekele",
    role: "Office User",
    action: "CREATE",
    resource: "Facility",
    description: "Created new facility: Meeting Room A",
    ip: "192.168.1.104",
  },
];

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case "CREATE":
      return "default";
    case "UPDATE":
      return "secondary";
    case "DELETE":
      return "destructive";
    case "VIEW":
      return "outline";
    default:
      return "secondary";
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-success";
    case "UPDATE":
      return "bg-info";
    case "DELETE":
      return "bg-destructive";
    case "VIEW":
      return "bg-muted-foreground";
    default:
      return "bg-primary";
  }
};

export default function AuditLogs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  // Get unique users from logs for the filter dropdown
  const uniqueUsers = useMemo(() => {
    const users = new Set(mockLogs.map(log => log.user));
    return Array.from(users).sort();
  }, []);

  // Filter logs based on search query and dropdown filters
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser = userFilter === "all" || log.user === userFilter;
      const matchesAction = actionFilter === "all" || log.action === actionFilter.toUpperCase();

      return matchesSearch && matchesUser && matchesAction;
    });
  }, [searchQuery, userFilter, actionFilter]);

  const handleExport = () => {
    const logsToExport = filteredLogs;
    try {
      // Define CSV headers
      const headers = ["ID", "Timestamp", "User", "Role", "Action", "Resource", "Description", "IP Address"];

      // Convert logs to CSV rows
      const csvContent = [
        headers.join(","),
        ...logsToExport.map(log => [
          log.id,
          `"${log.timestamp}"`,
          `"${log.user}"`,
          `"${log.role}"`,
          `"${log.action}"`,
          `"${log.resource}"`,
          `"${log.description}"`,
          `"${log.ip}"`
        ].join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `aau_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${logsToExport.length} logs to CSV format.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the logs. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audit Logs"
        description="View system activity and user actions (read-only)"
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Filtered Logs
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{filteredLogs.length}</p>
                <p className="text-xs text-muted-foreground">Showing Result</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockLogs.filter(l => l.action === "CREATE").length}</p>
                <p className="text-xs text-muted-foreground">Total Create</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockLogs.filter(l => l.action === "UPDATE").length}</p>
                <p className="text-xs text-muted-foreground">Total Update</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockLogs.filter(l => l.action === "DELETE").length}</p>
                <p className="text-xs text-muted-foreground">Total Delete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs by user, action or description..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4" />
                <SelectValue placeholder="User" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="view">View</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || userFilter !== "all" || actionFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setUserFilter("all");
                setActionFilter("all");
              }}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timestamp
                </div>
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getActionColor(log.action)}`} />
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell className="max-w-[250px] truncate text-muted-foreground">
                    {log.description}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No logs matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {mockLogs.length} logs
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled={filteredLogs.length === mockLogs.length}>Next</Button>
        </div>
      </div>
    </div>
  );
}
