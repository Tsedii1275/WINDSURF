import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import RolesPermissions from "./pages/admin/RolesPermissions";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemSettings from "./pages/admin/SystemSettings";

// Common Pages
import MyProfile from "./pages/common/Profile";
import AccountSettings from "./pages/common/AccountSettings";

// Public Pages
import Login from "./pages/public/Login";
import PublicHome from "./pages/public/PublicHome";
import AvailableTrainings from "./pages/public/AvailableTrainings";
import PublicRentals from "./pages/public/PublicRentals";
import Registration from "./pages/public/Registration";
import PublicDashboard from "./pages/public/PublicDashboard";

// Campus Pages
import CampusDashboard from "./pages/campus/CampusDashboard";
import CampusTrainingApprovals from "./pages/campus/CampusTrainingApprovals";
import CampusFacilityRentals from "./pages/campus/CampusFacilityRentals";
import CampusReports from "./pages/campus/CampusReports";

// Campus Admin - Request Management
import CampusTrainingRequests from "./pages/campus/CampusTrainingRequests";
import CampusRentalRequests from "./pages/campus/CampusRentalRequests";
import CampusTrainingRequestDetails from "./pages/campus/CampusTrainingRequestDetails";
import CampusRentalRequestDetails from "./pages/campus/CampusRentalRequestDetails";

// Campus Admin - Management
import CampusManageTrainings from "./pages/campus/CampusManageTrainings";
import CampusManageFacilities from "./pages/campus/CampusManageFacilities";
import CampusTrainingForm from "./pages/campus/CampusTrainingForm";
import CampusFacilityForm from "./pages/campus/CampusFacilityForm";

const NotFound = () => <div className="p-8 text-center">404 - Page Not Found</div>;

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user && !allowedRoles.includes("PUBLIC")) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/public" element={<PublicHome />} />
                <Route path="/public/trainings" element={<AvailableTrainings />} />
                <Route path="/public/rentals" element={<PublicRentals />} />
                <Route path="/public/registration" element={<Registration />} />
                <Route
                  path="/public/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["PUBLIC", "SYSTEM_ADMIN", "CAMPUS_ADMIN"]}>
                      <PublicDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<div className="p-20 text-center">Unauthorized Access</div>} />
                <Route path="/" element={<Navigate to="/public" replace />} />
              </Route>

              {/* Admin Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/roles" element={<RolesPermissions />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/profile" element={<MyProfile />} />
                <Route path="/admin/account-settings" element={<AccountSettings />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
              </Route>

              {/* Campus Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["CAMPUS_ADMIN", "SYSTEM_ADMIN"]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/campus/dashboard" element={<CampusDashboard />} />
                <Route path="/campus/trainings" element={<CampusTrainingApprovals />} />
                <Route path="/campus/rentals" element={<CampusFacilityRentals />} />
                <Route path="/campus/reports" element={<CampusReports />} />
                
                {/* Request Management */}
                <Route path="/campus/requests/trainings" element={<CampusTrainingRequests />} />
                <Route path="/campus/requests/rentals" element={<CampusRentalRequests />} />
                <Route path="/campus/requests/trainings/:id" element={<CampusTrainingRequestDetails />} />
                <Route path="/campus/requests/rentals/:id" element={<CampusRentalRequestDetails />} />
                
                {/* Management */}
                <Route path="/campus/trainings/manage" element={<CampusManageTrainings />} />
                <Route path="/campus/facilities/manage" element={<CampusManageFacilities />} />
                <Route path="/campus/trainings/create" element={<CampusTrainingForm />} />
                <Route path="/campus/trainings/edit/:id" element={<CampusTrainingForm />} />
                <Route path="/campus/facilities/create" element={<CampusFacilityForm />} />
                <Route path="/campus/facilities/edit/:id" element={<CampusFacilityForm />} />
                
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
