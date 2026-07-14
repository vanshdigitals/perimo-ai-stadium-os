import React from 'react';
import { Menu, PanelRight } from 'lucide-react';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { WorkspaceSwitcher } from '@/components/navigation/WorkspaceSwitcher';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { NotificationCenter } from '@/components/navigation/NotificationBell';
import { QuickActions } from '@/components/navigation/QuickActions';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { ProfileMenu } from '@/components/navigation/ProfileMenu';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onToggleUtilityPanel: () => void;
  onLogout?: () => void; // Adding this to match AdminLayout signature
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, onToggleUtilityPanel, onLogout }) => {
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

          {/* Breadcrumb - improved baseline alignment */}
          <div className="flex items-center gap-3 text-[14px] min-w-0 border-l border-[#E2E8F0] pl-4 ml-1 hidden lg:flex h-[24px]">
            <span className="text-[#0F172A] font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              Command Center
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1FAA6D] bg-[#1FAA6D]/10 px-2 py-0.5 rounded-[4px] uppercase tracking-wider leading-none">
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
