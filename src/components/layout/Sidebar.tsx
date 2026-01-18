import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ClipboardCheck,
  Building,
  BarChart3,
  BookOpen,
  Home,
  Plus,
  Edit,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/providers/AuthProvider";
import aauLogo from "@/assets/aau-logo.png";

interface NavigationItem {
  title: string;
  icon: any;
  href: string;
  submenu?: NavigationItem[];
}

const adminNavigation: NavigationItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { title: "User Management", icon: Users, href: "/admin/users" },
  { 
    title: "Institutional Management", 
    icon: Building2, 
    href: "/admin/institutional/campuses",
    submenu: [
      { title: "Manage Campuses", icon: Building2, href: "/admin/institutional/campuses" },
      { title: "Manage Schools", icon: GraduationCap, href: "/admin/institutional/schools" },
      { title: "Manage Departments", icon: Users, href: "/admin/institutional/departments" }
    ]
  },
  { title: "Roles & Permissions", icon: Shield, href: "/admin/roles" },
  { title: "Audit Logs", icon: FileText, href: "/admin/audit-logs" },
  { title: "System Settings", icon: Settings, href: "/admin/settings" },
];

const officeNavigation: NavigationItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/office/dashboard" },
  { 
    title: "Request Management", 
    icon: Home, 
    href: "/office/requests/trainings",
    submenu: [
      { title: "Training Requests", icon: BookOpen, href: "/office/requests/trainings" },
      { title: "Rental Requests", icon: Building, href: "/office/requests/rentals" }
    ]
  },
  { 
    title: "Resource Management", 
    icon: Plus, 
    href: "/office/trainings/manage",
    submenu: [
      { title: "Manage Trainings", icon: Edit, href: "/office/trainings/manage" },
      { title: "Manage Facilities", icon: Edit, href: "/office/facilities/manage" }
    ]
  },
  { title: "Reports", icon: BarChart3, href: "/office/reports" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { role } = useAuth();

  const navigationItems = role === "SYSTEM_ADMIN" ? adminNavigation : officeNavigation;
  const portalName = role === "SYSTEM_ADMIN" ? "System Administrator Portal" : "Office User Portal";

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 ease-in-out",
          !isMobile && (collapsed ? "w-16" : "w-64"),
          isMobile && "w-64",
          isMobile && (mobileOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="absolute right-2 top-2 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
          {(!collapsed || isMobile) ? (
            <div className="flex items-center gap-3">
              <img src={aauLogo} alt="AAU Logo" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-aau-red uppercase">አዲስ አበባ ዩኒቨርሲቲ</span>
                <span className="text-sm font-bold text-sidebar-foreground">ADDIS ABABA UNIVERSITY</span>
              </div>
            </div>
          ) : (
            <img src={aauLogo} alt="AAU Logo" className="h-10 w-10 object-contain" />
          )}
        </div>

        {(!collapsed || isMobile) && (
          <div className="border-b border-sidebar-border px-4 py-3">
            <div className="rounded-md bg-sidebar-accent/50 px-3 py-2">
              <span className="text-xs font-medium text-sidebar-foreground uppercase tracking-wider">URTFMS</span>
              <p className="text-[10px] text-sidebar-foreground/70 uppercase font-semibold">{portalName}</p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-3 mt-2">
          <span className={cn(
            "text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2",
            collapsed && !isMobile && "sr-only"
          )}>
            Main Menu
          </span>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.submenu && item.submenu.some((sub) => location.pathname === sub.href));
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            
            return (
              <div key={item.href}>
                <NavLink
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-4 border-l-aau-red"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {(!collapsed || isMobile) && <span>{item.title}</span>}
                </NavLink>
                
                {hasSubmenu && !collapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu!.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <NavLink
                          key={subItem.href}
                          to={subItem.href}
                          onClick={handleNavClick}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                            "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                            isSubActive && "bg-sidebar-accent/70 text-sidebar-accent-foreground border-l-2 border-l-aau-blue"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{subItem.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-border bg-card text-foreground shadow-md hover:bg-accent hover:shadow-lg transition-all"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        )}

        {(!collapsed || isMobile) && (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="rounded-md bg-sidebar-accent/30 px-3 py-2 text-center">
              <p className="text-[10px] text-sidebar-foreground/60">© 2025 Addis Ababa University</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
