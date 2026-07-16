import React, { useMemo } from 'react';
import { Menu, PanelRight } from 'lucide-react';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { WorkspaceSwitcher } from '@/components/navigation/WorkspaceSwitcher';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { NotificationCenter } from '@/components/navigation/NotificationBell';
import { QuickActions } from '@/components/navigation/QuickActions';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { ProfileMenu } from '@/components/navigation/ProfileMenu';

import { useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onToggleUtilityPanel: () => void;
  onLogout?: () => void;
}

const ROUTE_MAP: Record<string, { category: string; page: string }> = {
  '/admin': { category: 'Operations', page: 'Command Center' },
  '/admin/live-ops': { category: 'Operations', page: 'Live Operations' },
  '/admin/crowd': { category: 'Intelligence', page: 'Crowd Intelligence' },
  '/admin/digital-twin': { category: 'Intelligence', page: 'Digital Twin' },
  '/admin/incidents': { category: 'Operations', page: 'Incident Center' },
  '/admin/transportation': { category: 'Logistics', page: 'Transportation' },
  '/admin/facilities': { category: 'Logistics', page: 'Facilities' },
  '/admin/security': { category: 'Operations', page: 'Security Center' },
  '/admin/ai': { category: 'Intelligence', page: 'AI Copilot' },
  '/admin/analytics': { category: 'Reporting', page: 'Analytics' },
  '/admin/users': { category: 'Administration', page: 'User Management' },
  '/admin/roles': { category: 'Administration', page: 'Roles & Permissions' },
  '/admin/notifications': { category: 'Administration', page: 'Notifications' },
  '/admin/audit-logs': { category: 'Administration', page: 'Audit Logs' },
  '/admin/settings': { category: 'Administration', page: 'Platform Settings' },
  '/admin/profile': { category: 'Account', page: 'My Profile' },
  '/admin/workspace': { category: 'Account', page: 'Workspace' },
  '/admin/preferences': { category: 'Account', page: 'Preferences' },
  '/admin/security-settings': { category: 'Account', page: 'Security & API Keys' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, onToggleUtilityPanel, onLogout }) => {
  const location = useLocation();

  const breadcrumb = useMemo(() => {
    const defaultNav = { category: 'Operations', page: 'Command Center' };
    return ROUTE_MAP[location.pathname] || defaultNav;
  }, [location.pathname]);

  return (
    <OverlayProvider>
      <header className="fixed top-0 left-0 right-0 h-[72px] flex items-center gap-4 px-6 border-b border-[#E2E8F0] bg-white z-[100]">

        {/* Left: Hamburger + Brand Area */}
        <div className="flex items-center gap-4 h-full shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-[10px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#334155] hover:bg-[#F1F5F9] transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>

          {/* Interactive Workspace Switcher (Single Clickable Surface) */}
          <WorkspaceSwitcher />

          {/* Dynamic Breadcrumb */}
          <div className="flex items-center gap-2.5 text-[14px] min-w-0 border-l border-[#E2E8F0] pl-4 ml-1 hidden lg:flex h-[24px]">
            <span className="text-[#64748B] font-medium whitespace-nowrap">PERIMO</span>
            <span className="text-[#94A3B8] text-[12px] font-medium">/</span>
            <span className="text-[#64748B] font-medium whitespace-nowrap">{breadcrumb.category}</span>
            <span className="text-[#94A3B8] text-[12px] font-medium">/</span>
            <span className="text-[#0F172A] font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              {breadcrumb.page}
            </span>
            <span className="ml-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#1FAA6D] bg-[#1FAA6D]/10 px-2 py-0.5 rounded-[4px] uppercase tracking-wider leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
              System Live
            </span>
          </div>
        </div>

        {/* Search Bar / Command Palette */}
        <CommandPalette />

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <NotificationCenter />
          
          <QuickActions />

          <LanguageSwitcher />
          
          <div className="w-px h-6 bg-[#E2E8F0] mx-1 shrink-0 hidden sm:block" />
          
          <ProfileMenu onLogout={() => onLogout?.()} />

          <div className="w-px h-6 bg-[#E2E8F0] mx-1 shrink-0 hidden sm:block" />
          
          <button
            onClick={onToggleUtilityPanel}
            className="w-[36px] h-[36px] rounded-[8px] bg-white flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors duration-200 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <PanelRight className="w-[17px] h-[17px]" strokeWidth={2} />
          </button>
        </div>
      </header>
    </OverlayProvider>
  );
};
