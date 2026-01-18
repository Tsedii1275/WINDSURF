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
import CampusManagement from "./pages/admin/CampusManagement";
import RolesPermissions from "./pages/admin/RolesPermissions";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemSettings from "./pages/admin/SystemSettings";

// Institutional Management Pages
import ManageCampuses from "./pages/admin/institutional/ManageCampuses";
import ManageSchools from "./pages/admin/institutional/ManageSchools";
import ManageDepartments from "./pages/admin/institutional/ManageDepartments";
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

// Office Pages
import OfficeDashboard from "./pages/office/OfficeDashboard";
import TrainingApprovals from "./pages/office/TrainingApprovals";
import FacilityRentals from "./pages/office/FacilityRentals";
import OfficeReports from "./pages/office/OfficeReports";

// Office User - Request Management
import TrainingRequests from "./pages/office/TrainingRequests";
import RentalRequests from "./pages/office/RentalRequests";
import TrainingRequestDetails from "./pages/office/TrainingRequestDetails";
import RentalRequestDetails from "./pages/office/RentalRequestDetails";

// Office User - Management
import ManageTrainings from "./pages/office/ManageTrainings";
import ManageFacilities from "./pages/office/ManageFacilities";
import TrainingForm from "./pages/office/TrainingForm";
import FacilityForm from "./pages/office/FacilityForm";

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
                    <ProtectedRoute allowedRoles={["PUBLIC", "SYSTEM_ADMIN", "OFFICE_USER"]}>
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
                <Route path="/admin/campuses" element={<CampusManagement />} />
                <Route path="/admin/institutional/campuses" element={<ManageCampuses />} />
                <Route path="/admin/institutional/schools" element={<ManageSchools />} />
                <Route path="/admin/institutional/departments" element={<ManageDepartments />} />
                <Route path="/admin/roles" element={<RolesPermissions />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/profile" element={<MyProfile />} />
                <Route path="/admin/account-settings" element={<AccountSettings />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
              </Route>

              {/* Office Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["OFFICE_USER", "SYSTEM_ADMIN"]}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/office/dashboard" element={<OfficeDashboard />} />
                <Route path="/office/trainings" element={<TrainingApprovals />} />
                <Route path="/office/rentals" element={<FacilityRentals />} />
                <Route path="/office/reports" element={<OfficeReports />} />
                
                {/* Request Management */}
                <Route path="/office/requests/trainings" element={<TrainingRequests />} />
                <Route path="/office/requests/rentals" element={<RentalRequests />} />
                <Route path="/office/requests/trainings/:id" element={<TrainingRequestDetails />} />
                <Route path="/office/requests/rentals/:id" element={<RentalRequestDetails />} />
                
                {/* Management */}
                <Route path="/office/trainings/manage" element={<ManageTrainings />} />
                <Route path="/office/facilities/manage" element={<ManageFacilities />} />
                <Route path="/office/trainings/create" element={<TrainingForm />} />
                <Route path="/office/trainings/edit/:id" element={<TrainingForm />} />
                <Route path="/office/facilities/create" element={<FacilityForm />} />
                <Route path="/office/facilities/edit/:id" element={<FacilityForm />} />
                
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
