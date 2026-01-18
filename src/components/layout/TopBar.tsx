import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User, Settings, HelpCircle, Menu, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import aauLogo from "@/assets/aau-logo.png";

interface TopBarProps {
  sidebarCollapsed?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopBar({ sidebarCollapsed = false, onMenuClick, showMenuButton = false }: TopBarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, logout } = useAuth();
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "SA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // All notifications (you can expand this list)
  const allNotifications = [
    {
      id: 1,
      title: "New User Registration",
      description: "A new ICT Administrator has been added to the system. Please review and assign appropriate permissions.",
      time: "2 minutes ago",
      read: false,
      type: "user"
    },
    {
      id: 2,
      title: "Campus Settings Updated",
      description: "Main Campus settings have been modified. Changes include facility capacity updates and schedule adjustments.",
      time: "15 minutes ago",
      read: false,
      type: "system"
    },
    {
      id: 3,
      title: "System Backup Completed",
      description: "Automated backup completed successfully. All data has been securely backed up to the cloud storage.",
      time: "6 hours ago",
      read: false,
      type: "system"
    },
    {
      id: 4,
      title: "Role Permission Changed",
      description: "Training Coordinator role permissions have been updated. New access levels have been applied.",
      time: "1 day ago",
      read: true,
      type: "system"
    },
    {
      id: 5,
      title: "Monthly Report Generated",
      description: "Monthly system usage report for January 2025 has been generated and is available for download.",
      time: "2 days ago",
      read: true,
      type: "report"
    },
    {
      id: 6,
      title: "Security Alert",
      description: "Multiple failed login attempts detected from IP address 192.168.1.100. Please review security logs.",
      time: "3 days ago",
      read: true,
      type: "security"
    },
    {
      id: 7,
      title: "Database Maintenance Scheduled",
      description: "Scheduled database maintenance will occur tonight at 2:00 AM. System may be unavailable for 30 minutes.",
      time: "4 days ago",
      read: true,
      type: "system"
    },
    {
      id: 8,
      title: "User Account Deactivated",
      description: "User account for John Doe has been deactivated due to inactivity. Data will be archived after 90 days.",
      time: "5 days ago",
      read: true,
      type: "user"
    },
  ];

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const recentNotifications = allNotifications.slice(0, 3);

  const handleViewAllNotifications = () => {
    setNotificationsDialogOpen(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "user":
        return "👤";
      case "system":
        return "⚙️";
      case "report":
        return "📊";
      case "security":
        return "🔒";
      default:
        return "🔔";
    }
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm transition-all duration-300 ${showMenuButton ? "left-0" : (sidebarCollapsed ? "left-16" : "left-64")
        }`}
    >
      {/* Left Section - Mobile Menu & Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="hidden md:flex items-center gap-3">
          <div className="h-8 w-px bg-border" />
          <div>
            <h1 className="text-base font-semibold text-foreground">
              University Resource & Training Facility Management
            </h1>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
              {role === "SYSTEM_ADMIN" ? "System Administrator Portal" : "Campus Admin Portal"}
            </p>
          </div>
        </div>
        <div className="md:hidden">
          <h1 className="text-sm font-semibold text-foreground">URTFMS Admin</h1>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">URTFMS Help & Support</p>
              <p className="text-xs text-muted-foreground">
                Access documentation, tutorials, and support resources for the University Resource & Training Facility Management System.
              </p>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                <strong>Contact:</strong> ICT Department<br />
                <strong>Email:</strong> support@aau.edu.et
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-aau-red text-white font-semibold">
                {unreadCount}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <DropdownMenuLabel className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Notifications</span>
                <Badge variant="outline" className="bg-aau-red/10 text-aau-red border-aau-red/20">
                  {unreadCount} new
                </Badge>
              </div>
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-muted/50 border-b last:border-0"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-aau-red'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {notification.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm text-aau-red hover:text-aau-red hover:bg-aau-red/10"
                onClick={handleViewAllNotifications}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* All Notifications Dialog */}
        <Dialog open={notificationsDialogOpen} onOpenChange={setNotificationsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>All Notifications</span>
                <Badge variant="outline" className="bg-aau-red/10 text-aau-red border-aau-red/20">
                  {unreadCount} unread
                </Badge>
              </DialogTitle>
              <DialogDescription>
                View and manage all your system notifications
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {allNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
                    <div className="text-2xl mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-aau-red flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < allNotifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  // Mark all as read functionality could go here
                  setNotificationsDialogOpen(false);
                }}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button
                variant="outline"
                onClick={() => setNotificationsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="h-8 w-px bg-border mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-secondary">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {getInitials(user?.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {role === "SYSTEM_ADMIN" ? "ICT Department" : "Registrar Office"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "user@aau.edu.et"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/account-settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => {
                logout();
                toast({
                  title: "Signed out successfully",
                  description: "You have been logged out of your account",
                });
                navigate("/public");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
