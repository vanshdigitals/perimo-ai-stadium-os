import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// We import a few critical immediate-load components (loaders, common layouts)
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

// Lazy loading all pages/views to drastically reduce initial bundle size!
const RoleSelection = React.lazy(() => import('@/pages/RoleSelection').then(m => ({ default: m.RoleSelection })));
const Success = React.lazy(() => import('@/pages/Success').then(m => ({ default: m.Success })));
const FanAuth = React.lazy(() => import('@/features/auth/fan/FanAuth').then(m => ({ default: m.FanAuth })));
const ForgotPassword = React.lazy(() => import('@/features/auth/fan/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const VolunteerAuth = React.lazy(() => import('@/features/auth/volunteer/VolunteerAuth').then(m => ({ default: m.VolunteerAuth })));
const StaffAuth = React.lazy(() => import('@/features/auth/staff/StaffAuth').then(m => ({ default: m.StaffAuth })));

// Admin Auth
const AdminLogin = React.lazy(() => import('@/features/auth/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminForgotPassword = React.lazy(() => import('@/features/auth/admin/AdminForgotPassword').then(m => ({ default: m.AdminForgotPassword })));
const AdminEmailSent = React.lazy(() => import('@/features/auth/admin/AdminEmailSent').then(m => ({ default: m.AdminEmailSent })));
const AdminVerifyCode = React.lazy(() => import('@/features/auth/admin/AdminVerifyCode').then(m => ({ default: m.AdminVerifyCode })));
const AdminResetPassword = React.lazy(() => import('@/features/auth/admin/AdminResetPassword').then(m => ({ default: m.AdminResetPassword })));
const AdminResetSuccess = React.lazy(() => import('@/features/auth/admin/AdminResetSuccess').then(m => ({ default: m.AdminResetSuccess })));
const AdminMFA = React.lazy(() => import('@/features/auth/admin/AdminMFA').then(m => ({ default: m.AdminMFA })));

// Protected Routes
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const LiveOperations = React.lazy(() => import('@/features/live-ops/pages/LiveOperations').then(m => ({ default: m.LiveOperations })));
const CrowdIntelligence = React.lazy(() => import('@/features/crowd/pages/CrowdIntelligence').then(m => ({ default: m.CrowdIntelligence })));
const DigitalTwinOverview = React.lazy(() => import('@/features/digital-twin/pages/DigitalTwinOverview').then(m => ({ default: m.DigitalTwinOverview })));
const IncidentCenter = React.lazy(() => import('@/features/incidents/pages/IncidentCenter').then(m => ({ default: m.IncidentCenter })));
const Transportation = React.lazy(() => import('@/features/transportation/pages/Transportation').then(m => ({ default: m.Transportation })));
const Facilities = React.lazy(() => import('@/features/facilities/pages/Facilities').then(m => ({ default: m.Facilities })));
const SecurityCenter = React.lazy(() => import('@/features/security/pages/SecurityCenter').then(m => ({ default: m.SecurityCenter })));
const AICenter = React.lazy(() => import('@/features/ai/pages/AICenter').then(m => ({ default: m.AICenter })));
const Analytics = React.lazy(() => import('@/features/analytics/pages/Analytics').then(m => ({ default: m.Analytics })));

// Administration Routes
const UserManagement = React.lazy(() => import('@/features/administration/pages/UserManagement').then(m => ({ default: m.UserManagement })));
const RolesPermissions = React.lazy(() => import('@/features/administration/pages/RolesPermissions').then(m => ({ default: m.RolesPermissions })));
const Notifications = React.lazy(() => import('@/features/administration/pages/Notifications').then(m => ({ default: m.Notifications })));
const AuditLogs = React.lazy(() => import('@/features/administration/pages/AuditLogs').then(m => ({ default: m.AuditLogs })));
const PlatformSettings = React.lazy(() => import('@/features/administration/pages/PlatformSettings').then(m => ({ default: m.PlatformSettings })));

const FallbackLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
    <div className="w-8 h-8 rounded-full border-4 border-[#2563EB] border-t-transparent animate-spin"></div>
  </div>
);

export const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          {/* ── Public ────────────────────────────────────────────── */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/auth/success" element={<Success />} />

          {/* ── Fan Auth ──────────────────────────────────────────── */}
          <Route path="/auth/fan/login" element={<FanAuth />} />
          <Route path="/auth/fan/register" element={<FanAuth />} />
          <Route path="/auth/fan/forgot-password" element={<ForgotPassword />} />

          {/* ── Volunteer & Staff Auth ────────────────────────────── */}
          <Route path="/auth/volunteer/login" element={<VolunteerAuth />} />
          <Route path="/auth/staff/login" element={<StaffAuth />} />

          {/* ── Admin Auth ────────────────────────────────────────── */}
          <Route path="/auth/admin/login" element={<AdminLogin />} />
          <Route path="/auth/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/auth/admin/email-sent" element={<AdminEmailSent />} />
          <Route path="/auth/admin/verify-code" element={<AdminVerifyCode />} />
          <Route path="/auth/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/auth/admin/reset-success" element={<AdminResetSuccess />} />
          <Route path="/auth/admin/mfa" element={<AdminMFA />} />

          {/* ── Protected Admin Routes ──────────────────────────────── */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/live-ops" element={<ProtectedRoute><LiveOperations /></ProtectedRoute>} />
          <Route path="/admin/crowd" element={<ProtectedRoute><CrowdIntelligence /></ProtectedRoute>} />
          <Route path="/admin/digital-twin" element={<ProtectedRoute><DigitalTwinOverview /></ProtectedRoute>} />
          <Route path="/admin/incidents" element={<ProtectedRoute><IncidentCenter /></ProtectedRoute>} />
          <Route path="/admin/transportation" element={<ProtectedRoute><Transportation /></ProtectedRoute>} />
          <Route path="/admin/facilities" element={<ProtectedRoute><Facilities /></ProtectedRoute>} />
          <Route path="/admin/security" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
          <Route path="/admin/ai" element={<ProtectedRoute><AICenter /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><PlatformSettings /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
};
